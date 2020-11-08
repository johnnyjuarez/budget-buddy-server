BEGIN;

TRUNCATE
  budget_buddy_users,
  budget_buddy_accounts,
  budget_buddy_transactions
  RESTART IDENTITY CASCADE;

INSERT INTO budget_buddy_users (email, password)
VALUES
  ('test@test.com', '$2a$04$V0LLJBSv1FBfIRhMukYus.NPjbKfep2COiJhcCVMsJyPYLIxNFN/G'),
  ('doesthiswork@wow.com', '$2a$04$X5l6fc/s8JR7sm4jaMIOOeI2TGByWIJIyV8wsC/PIXJlRpwnvDB3S'),
  ('checking@check.com', '$2a$04$ztoDGJ2A/VOIe8kYuNpKw.ojGVav3bGpH..jA2Ta71g3Ha7caku76');

INSERT INTO budget_buddy_accounts (account_name, account_total, user_id)
VALUES
  ('checking', 50, 1),
  ('savings', 2334.23, 2),
  ('credit', 44.20, 3);

INSERT INTO budget_buddy_transactions (amount, type, description, account_id)
VALUES
  (20, 'increase', 'extra cash', 1 ),
  (187, 'increase', 'bonus', 2),
  (200, 'decrease', 'headset', 3);

COMMIT;