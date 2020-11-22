const app = require('../src/app');
const knex = require('knex');
const AuthServices = require('../src/auth/auth-services');
const { hashPassword } = require('../src/users/users-services');

describe('App', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw(
      'TRUNCATE budget_buddy_users, budget_buddy_accounts, budget_buddy_transactions RESTART IDENTITY CASCADE'
    )
  );

  afterEach('cleanup', () =>
    db.raw(
      'TRUNCATE budget_buddy_users, budget_buddy_accounts, budget_buddy_transactions RESTART IDENTITY CASCADE'
    )
  );
  context('Given there is data in the database', () => {
    beforeEach('insert data', () => {
      return db
        .into('budget_buddy_users')
        .insert({
          id: 1,
          email: 'test@test.com',
          password:
            '$2a$04$ztoDGJ2A/VOIe8kYuNpKw.ojGVav3bGpH..jA2Ta71g3Ha7caku76',
        })
        .then(() => {
          return db.into('budget_buddy_accounts').insert({
            id: 1,
            account_name: 'test account',
            account_total: 123,
            user_id: 1,
          });
        })
        .then(() => {
          return db.into('budget_buddy_transactions').insert({
            amount: 20,
            type: 'increase',
            description: 'extra cash',
            account_id: 1,
          });
        });
    });
    it('responds with 200 and all of the accounts associated with user', () => {
      return supertest(app)
        .get('/api/accounts')
        .set(
          'Authorization',
          `bearer ${AuthServices.createJwt('test@test.com', {
            email: 'test@test.com',
          })}`
        )
        .expect(200, [
          {
            id: 1,
            account_name: 'test account',
            account_total: '123',
            user_id: 1,
          },
        ]);
    });
    it('responds with 200 and all of the transactions associated with the account id', () => {
      return supertest(app)
        .get('/api/transactions/1')
        .set(
          'Authorization',
          `bearer ${AuthServices.createJwt('test@test.com', {
            email: 'test@test.com',
          })}`
        )
        .expect(200, [
          {
            id: 1,
            amount: '20',
            type: 'increase',
            description: 'extra cash',
            account_id: 1,
            date_added: new Date().toISOString(),
          },
        ]);
    });
  });
});
