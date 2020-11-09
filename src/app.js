require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const accountsRouter = require('./accounts/accounts-router');
const transactionsRouter = require('./transactions/transactions-router');

// describe app to use express
const app = express();

// set morgan option based on node environment
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

// set app options and basic security
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// routes
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error : {mesage : 'server error'}};
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;