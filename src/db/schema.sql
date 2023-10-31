CREATE TABLE app_user (
  user_id SERIAL PRIMARY KEY,
  
  given_name TEXT DEFAULT '',
  family_name TEXT DEFAULT '',
  nickname TEXT DEFAULT '',
  name TEXT,
  picture TEXT DEFAULT '',
  locale TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  email TEXT NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  sub TEXT NOT NULL,
  sid TEXT NOT NULL
);

CREATE TABLE lifestyle_category (
  lifestyle_category_id SERIAL PRIMARY KEY,

  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  order_position INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES app_user(user_id)
);

CREATE TABLE lifestyle_factor (
  lifestyle_factor_id SERIAL PRIMARY KEY,

  lifestyle_category_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  nano_id TEXT NOT NULL,
  name TEXT NOT NULL,
  order_position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
  FOREIGN KEY (user_id) REFERENCES app_user(user_id),
  FOREIGN KEY (lifestyle_category_id) REFERENCES lifestyle_category(lifestyle_category_id)
);


CREATE TABLE daily_entry (
  daily_entry_id SERIAL PRIMARY KEY,

  mood_rating INTEGER NOT NULL,
  productivity_rating INTEGER NOT NULL,
  journal TEXT DEFAULT '',
  user_id INTEGER NOT NULL,
  entry_date DATE NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES app_user(user_id)
);

CREATE TABLE daily_entry_factor (
  daily_entry_id INTEGER NOT NULL,
  lifestyle_factor_id INTEGER NOT NULL,
  did BOOLEAN NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (daily_entry_id) REFERENCES daily_entry(daily_entry_id) ON DELETE CASCADE,
  FOREIGN KEY (lifestyle_factor_id) REFERENCES lifestyle_factor(lifestyle_factor_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app_user(user_id),
  PRIMARY KEY (daily_entry_id, lifestyle_factor_id)
);