-- PREPARED ONLY. Never run against the existing production DB.
-- Apply to a separately authorized, empty account database after provider review.
PRAGMA foreign_keys = ON;
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  issuer TEXT NOT NULL,
  subject TEXT NOT NULL,
  display_name TEXT NOT NULL CHECK(length(display_name) BETWEEN 1 AND 100),
  role TEXT NOT NULL DEFAULT 'learner' CHECK(role IN ('learner','admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended')),
  pilot_allowed INTEGER NOT NULL DEFAULT 0 CHECK(pilot_allowed IN (0,1)),
  UNIQUE(issuer,subject)
);
CREATE TABLE account_progress (
  account_id TEXT NOT NULL REFERENCES accounts(id),
  record_key TEXT NOT NULL,
  area TEXT NOT NULL CHECK(area IN ('typing','topic-mission','command-practice','assessed-course','braille')),
  curriculum_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  path TEXT NOT NULL CHECK(path IN ('both','left','right','none')),
  verification TEXT NOT NULL CHECK(verification IN ('practice','imported','verified')),
  payload TEXT NOT NULL CHECK(json_valid(payload)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(account_id,record_key,verification)
);
CREATE INDEX account_progress_area ON account_progress(account_id,area);
CREATE TABLE account_audit (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL REFERENCES accounts(id),
  target_id TEXT NOT NULL REFERENCES accounts(id),
  action TEXT NOT NULL CHECK(action IN ('suspend','restore')),
  reason TEXT NOT NULL CHECK(length(reason) BETWEEN 5 AND 200),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- No credential fields. No automatic account creation, role grants or legacy claims.
