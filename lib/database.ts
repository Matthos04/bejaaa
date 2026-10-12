import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

type BoundStatement = {
  bind: (...values: unknown[]) => BoundStatement;
  all: () => Promise<{ results: Record<string, unknown>[] }>;
  first: () => Promise<Record<string, unknown> | null>;
  run: () => Promise<{ meta: { changes: number } }>;
};

let sqlite: DatabaseSync | undefined;

function getSqlite() {
  if (sqlite) return sqlite;
  const databasePath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "bejaaa.sqlite");
  mkdirSync(path.dirname(databasePath), { recursive: true });
  sqlite = new DatabaseSync(databasePath);
  sqlite.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  sqlite.exec(`
  CREATE TABLE IF NOT EXISTS cafes (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    cafe_id TEXT NOT NULL REFERENCES cafes(id),
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    body TEXT NOT NULL,
    purpose TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    author_id TEXT,
    fingerprint TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS reviews_cafe_status ON reviews(cafe_id, status);
  CREATE INDEX IF NOT EXISTS reviews_rate_limit ON reviews(fingerprint, created_at);
  `);
  return sqlite;
}

export function db() {
  return {
    prepare(sql: string): BoundStatement {
      let values: unknown[] = [];
      return {
        bind(...bound) {
          values = bound;
          return this;
        },
        async all() {
          const results = getSqlite().prepare(sql).all(...(values as never[])) as Record<string, unknown>[];
          return { results };
        },
        async first() {
          return (getSqlite().prepare(sql).get(...(values as never[])) as Record<string, unknown> | undefined) ?? null;
        },
        async run() {
          const result = getSqlite().prepare(sql).run(...(values as never[]));
          return { meta: { changes: Number(result.changes) } };
        },
      };
    },
  };
}
