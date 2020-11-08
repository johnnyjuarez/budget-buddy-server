const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// auth service object
const AuthService = {
  getEmail(db, email) {
    return db('budget_buddy_users')
      .select('*')
      .where({email})
      .first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  }
};

module.exports = AuthService;