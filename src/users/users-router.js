const express = require('express');
const UsersService = require('./users-services');
const userRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');

userRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { email, password } = req.body;

  for (const field of ['email', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing ${field} in request body`,
      });
  const passwordError = UsersService.validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithEmail(req.app.get('db'), email)
    .then((hasUserWithEmail) => {
      if (hasUserWithEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      } else {
        return UsersService.hashPassword(password).then((hashedPassword) => {
          const newUser = {
            email,
            password: hashedPassword,
          };
          return UsersService.insertUser(req.app.get('db'), newUser).then(
            (user) => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user));
            }
          );
        });
        // create user in database
      }
    })
    .catch(next);
});

module.exports = userRouter;
