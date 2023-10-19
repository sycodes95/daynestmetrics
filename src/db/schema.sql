CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY,
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  nickname TEXT ,
  name TEXT NOT NULL,
  picture TEXT,
  locale TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIMEZONE NOT NULL,
  email TEXT NOT NULL,
  email_verified boolean NOT NULL,
  sub TEXT NOT NULL,
  sid TEXT NOT NULL
)