const express = require('express');
const { requireAuth } = require('../middleware/basic-auth');
const TransactionsServices = require('./transactions-services');
const path = require('path');

const transactionsRouter = express.Router();
const jsonBodyParser = express.json();

transactionsRouter
  .route('/:account_id')
  // .all(requireAuth)
  .get((req, res, next) => {
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
    TransactionsServices.insertTransaction(req.app.get('db'), transactionInfo)
      .then((transaction) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${transaction.id}`))
          .json(TransactionsServices.serializeTransaction(transaction));
      })
      .catch(next);
  });

module.exports = transactionsRouter;
