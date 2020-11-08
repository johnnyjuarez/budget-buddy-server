const express = require('express');

const transactionsRouter = express.Router();
const jsonBodyParser = express.json();

transactionsRouter
  .route('/')
  .get((req, res, next) => {
    res.send('this is the GET \'/transactions\' route');
  })
  .post(jsonBodyParser, (req, res, next) => {
    res.send('this is the POST \'/transactions\' route');
  });

transactionsRouter
  .route('/:transaction_id')
  .get((req, res, next) => {
    res.send(`this is the ${req.params.account_id} route`);
  });

module.exports = transactionsRouter;