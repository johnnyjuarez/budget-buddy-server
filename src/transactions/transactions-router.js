const express = require('express');
const requireAuth = require('../middleware/jwt-auth');
const TransactionsServices = require('./transactions-services');
const path = require('path');
const AccountsServices = require('../accounts/accounts-services');

const transactionsRouter = express.Router();
const jsonBodyParser = express.json();

transactionsRouter
  .route('/:account_id')
  .all(requireAuth)
  .all(checkAccountExists)
  .get((req, res, next) => {
    console.log(req.user);
    const accountId = req.params.account_id;
    console.log(accountId);
    TransactionsServices.getAccountTransactions(
      req.app.get('db'),
      accountId
    ).then((transactions) => {
      res.status(200).json(transactions);
    });
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { amount, type, description } = req.body;
    const account_id = req.params.account_id;
    const transactionInfo = { amount, type, description, account_id };
    for (const [key, value] of Object.entries(transactionInfo)) {
      if (value === null) {
        return res.status(400).json({
          error: `Missing ${key} in request body`,
        });
      }
    }
    if (!parseFloat(amount)) {
      return res.status(400).json({
        error: `${amount} is not a number`,
      });
    }
    let transaction = null;
    TransactionsServices.insertTransaction(req.app.get('db'), transactionInfo)
      .then((_transaction) => {
        transaction = _transaction;
        return TransactionsServices.processTransaction(
          req.app.get('db'),
          account_id,
          amount,
          type
        );
      })
      .then(() => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${transaction.id}`))
          .json(TransactionsServices.serializeTransaction(transaction));
      })
      .catch(next);
  });

async function checkAccountExists(req, res, next) {
  try {
    const account = await AccountsServices.getAccountById(
      req.app.get('db'),
      req.params.account_id,
      req.user.id
    );

    if (!account)
      return res.status(404).json({
        error: `Account doesn't exist`,
      });

    res.account = account;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = transactionsRouter;
