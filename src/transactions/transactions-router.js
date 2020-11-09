const express = require('express');
const {requireAuth} = require('../middleware/basic-auth');

const transactionsRouter = express.Router();
const jsonBodyParser = express.json();

transactionsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    res.send('this is the GET \'/transactions\' route');
  })
  .post(jsonBodyParser, (req, res, next) => {
    res.send('this is the POST \'/transactions\' route');
  });

transactionsRouter
  .route('/:transaction_id')
  .all(requireAuth)
  .get((req, res, next) => {
    res.send(`this is the ${req.params.transaction_id} route`);
  });

module.exports = transactionsRouter;