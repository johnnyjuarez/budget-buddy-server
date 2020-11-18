CREATE TABLE budget_buddy_transactions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date_added TIMESTAMPTZ DEFAULT now() NOT NULL,
  description TEXT,
  account_id INTEGER 
    REFERENCES budget_buddy_accounts(id) ON DELETE CASCADE NOT NULL
);