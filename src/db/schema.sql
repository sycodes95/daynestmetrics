CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY,
  given_name TEXT DEFAULT '',
  family_name TEXT DEFAULT '',
  nickname TEXT DEFAULT '',
  name TEXT,
  picture TEXT DEFAULT '',
  locale TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIMEZONE NOT NULL,
  email TEXT NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  sub TEXT NOT NULL,
  sid TEXT NOT NULL
) 