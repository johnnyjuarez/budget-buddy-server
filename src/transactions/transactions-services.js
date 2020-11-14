const xss = require('xss');

const TransactionServices = {
  getAccountTransactions(db, accountId) {
    return db
      .from('budget_buddy_transactions as transaction')
      .select(
        'transaction.id',
        'transaction.amount',
        'transaction.type',
        'transaction.date_added',
        'transaction.description',
        'transaction.account_id'
      )
      .where('transaction.account_id', accountId);
  },
  insertTransaction(db, newTransaction) {
    return db
      .insert(newTransaction)
      .into('budget_buddy_transactions')
      .returning('*')
      .then(([transaction]) => transaction);
  },
  serializeTransaction(transaction) {
    return {
      id: transaction.id,
      amount: xss(transaction.amount),
      type: xss(transaction.type),
      description: xss(transaction.description),
      account: transaction.account_id,
    };
  },
};

module.exports = TransactionServices;
