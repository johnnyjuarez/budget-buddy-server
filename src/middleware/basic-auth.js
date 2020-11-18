const AuthServices = require('../auth/auth-services');

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let basicToken;

  if(!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic token' });
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length);
  }

  const [tokenEmail, tokenPassword] = Buffer
    .from(basicToken, 'base64')
    .toString()
    .split(':');

  if(!tokenEmail || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request'});
  }

  AuthServices.getEmail(
    req.app.get('db'),
    tokenEmail
  )
    .then(user => {
      if(!user) {
        return res.status(401).json({ error: 'Unauthorized request '});
      }
      return AuthServices.comparePasswords(tokenPassword, user.password)
        .then(passwordsMatch => {
          if(!passwordsMatch) {
            return res.status(401).json({ error: 'Unauthorized request '});
          }
          req.user = user;
          next();
        });
    })
    .catch(next);
}

module.exports = {requireAuth};