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
);

CREATE TABLE habits (
  id INTEGER NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  factor TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE daily_entries (
  id INTEGER NOT NULL PRIMARY KEY,
  mood_rating INTEGER NOT NULL,
  productivity_rating INTEGER NOT NULL,
  factors_did TEXT[],
  factors_did_not TEXT[],
  journal TEXT DEFAULT '',
  user_id INTEGER NOT NULL,
  entry_date TEXT NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
