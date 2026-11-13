PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS idea_reports (
  idea_id TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'off-topic')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'dismissed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (idea_id, visitor_id)
);
CREATE INDEX IF NOT EXISTS idea_reports_status ON idea_reports(status, created_at);
