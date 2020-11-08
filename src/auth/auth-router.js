const express = require('express');

const authRouter = express.Router();
const jsonBodyParser = express.json();
const AuthServices = require('./auth-services');

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const {email, password} = req.body;
    const loginUser = {email, password};

    for(const [key, value] of Object.entries(loginUser))
      if(value === null)
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
    // verify email
    AuthServices.getEmail(
      req.app.get('db'),
      loginUser.email
    )
      .then(dbUser => {
        if(!dbUser)
          return res.status(400).json({
            error: 'Incorrect email or password'
          });
        console.log(dbUser);
        // verify password
        return AuthServices.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if(!compareMatch)
              return res.status(400).json({
                error: 'Incorrect password'
              });
            res.send('post route for \'/login\'');
          });
      })
      .catch(next);

    

  });

module.exports = authRouter;