const express = require('express');
const requireAuth = require('../middleware/jwt-auth');
const AccountsServices = require('./accounts-services');
const accountsRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');

accountsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    console.log(req.user);
    const userId = req.user.id;
    AccountsServices.getUserAccounts(req.app.get('db'), userId).then(
      (accounts) => {
        res.json(accounts);
      }
    );
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { account_name, account_total } = req.body;
    const user_id = req.user.id;
    const accountInfo = { account_name, account_total, user_id };
    for (const [key, value] of Object.entries(accountInfo)) {
      if (value === null) {
        return res.status(400).json({
          error: `Missing ${key} in request body`,
        });
      }
    }
    if (!parseFloat(account_total)) {
      return res.status(400).json({
        error: `${account_total} is not a number`,
      });
    }
    AccountsServices.insertAccount(req.app.get('db'), accountInfo)
      .then((account) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${account.id}`))
          .json(AccountsServices.serializeAccount(account));
      })
      .catch(next);
  });

module.exports = accountsRouter;
