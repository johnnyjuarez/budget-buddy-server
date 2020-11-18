const xss = require('xss');

const AccountsServices = {
  getUserAccounts(db, userId) {
    return db
      .from('budget_buddy_accounts as account')
      .select(
        'account.id',
        'account.account_name',
        'account.account_total',
        'account.user_id'
      )
      .where('account.user_id', userId);
  },
  insertAccount(db, newAccount) {
    return db
      .insert(newAccount)
      .into('budget_buddy_accounts')
      .returning('*')
      .then(([account]) => account);
  },
  serializeAccount(account) {
    return {
      id: account.id,
      name: xss(account.account_name),
      total: xss(account.account_total),
      user: account.user_id,
    };
  },
  getAccountById(db, accountId, userId) {
    return db
      .select('*')
      .from('budget_buddy_accounts')
      .where({ id: accountId, user_id: userId })
      .first();
  },
};
module.exports = AccountsServices;
