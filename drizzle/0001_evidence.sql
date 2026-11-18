CREATE TABLE IF NOT EXISTS practice_evidence (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  skill TEXT NOT NULL,
  question TEXT NOT NULL,
  day INTEGER NOT NULL,
  lesson TEXT NOT NULL,
  topic TEXT NOT NULL,
  correct INTEGER NOT NULL CHECK(correct IN (0,1)),
  seen_at INTEGER NOT NULL,
  PRIMARY KEY (user_id,level,skill,question,day)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS practice_time ON practice_evidence(user_id,level,seen_at);
