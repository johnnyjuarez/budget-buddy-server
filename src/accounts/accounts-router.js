const express = require('express');
const {requireAuth} = require('../middleware/basic-auth');

const accountsRouter = express.Router();
const jsonBodyParser = express.json();

accountsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    res.send('this is the GET \'/accounts\' route');
  })
  .post(jsonBodyParser, (req, res, next) => {
    res.send('this is the POST \'/accounts\' route');
  });

accountsRouter
  .route('/:account_id')
  .all(requireAuth)
  .get((req, res, next) => {
    res.send(`this is the ${req.params.account_id} route`);
  });

module.exports = accountsRouter;