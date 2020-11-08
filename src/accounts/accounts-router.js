const express = require('express');

const accountsRouter = express.Router();
const jsonBodyParser = express.json();

accountsRouter
  .route('/')
  .get((req, res, next) => {
    res.send('this is the GET \'/accounts\' route');
  })
  .post(jsonBodyParser, (req, res, next) => {
    res.send('this is the POST \'/accounts\' route');
  });

accountsRouter
  .route('/:account_id')
  .get((req, res, next) => {
    res.send(`this is the ${req.params.account_id} route`);
  });

module.exports = accountsRouter;