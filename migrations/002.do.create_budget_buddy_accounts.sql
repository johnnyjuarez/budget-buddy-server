CREATE TABLE budget_buddy_accounts(
  id SERIAL PRIMARY KEY,
  account_name TEXT NOT NULL,
  account_total NUMERIC,
  user_id INTEGER 
    REFERENCES budget_buddy_users(id) ON DELETE CASCADE NOT NULL
);