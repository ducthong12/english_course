import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { handleAccount } from "./worker.mjs";

const directory =
  process.env.LINGO_DATA_DIR ||
  join(
    process.env.LOCALAPPDATA || join(homedir(), ".local", "share"),
    "LingoStudio",
  );
mkdirSync(directory, { recursive: true, mode: 0o700 });
const sqlite = new DatabaseSync(join(directory, "learners.sqlite"));
sqlite.exec(
  "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON",
);
sqlite.exec(
  readFileSync(
    new URL("../drizzle/0000_accounts.sql", import.meta.url),
    "utf8",
  ),
);
sqlite.exec(
  readFileSync(
    new URL("../drizzle/0001_evidence.sql", import.meta.url),
    "utf8",
  ),
);
if (process.argv[2] === "--grant-admin") {
  const email = (process.argv[3] || "").trim().toLowerCase();
  const { changes } = sqlite
    .prepare("UPDATE users SET role='admin' WHERE email=?")
    .run(email);
  console.log(
    changes ? "Đã cấp quyền quản trị." : "Chưa tìm thấy tài khoản đã đăng ký.",
  );
  sqlite.close();
  process.exit(changes ? 0 : 1);
}
function statement(sql, args = []) {
  return {
    bind: (...values) => statement(sql, values),
    first: () => sqlite.prepare(sql).get(...args) ?? null,
    all: () => ({ results: sqlite.prepare(sql).all(...args) }),
    run: () => sqlite.prepare(sql).run(...args),
  };
}
const db = {
  prepare: statement,
  batch(statements) {
    sqlite.exec("BEGIN IMMEDIATE");
    try {
      const result = statements.map((stmt) => stmt.run());
      sqlite.exec("COMMIT");
      return result;
    } catch (e) {
      sqlite.exec("ROLLBACK");
      throw e;
    }
  },
};
const server = createServer(async (incoming, outgoing) => {
  try {
    const method = incoming.method,
      headers = new Headers();
    for (const key of ["cookie", "content-type", "content-length", "origin"]) {
      if (incoming.headers[key]) headers.set(key, incoming.headers[key]);
    }
    const host = incoming.headers.host;
    if (!/^(?:localhost|127\.0\.0\.1|\[::1\])(?::[0-9]+)?$/i.test(host || "")) {
      outgoing.writeHead(403);
      outgoing.end();
      return;
    }
    const init = { method, headers };
    if (method !== "GET" && method !== "HEAD") {
      init.body = Readable.toWeb(incoming);
      init.duplex = "half";
    }
    const req = new Request("http://" + host + incoming.url, init);
    const res = await handleAccount(req, db);
    outgoing.writeHead(res.status, Object.fromEntries(res.headers));
    outgoing.end(Buffer.from(await res.arrayBuffer()));
  } catch {
    if (!outgoing.headersSent)
      outgoing.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
    outgoing.end(
      JSON.stringify({ error: "Không thể xử lý yêu cầu tài khoản." }),
    );
  }
});
server.listen(0, "127.0.0.1", () =>
  console.log(JSON.stringify({ port: server.address().port })),
);

if (process.argv.includes("--parent-pipe")) {
  process.stdin.resume();
  process.stdin.once("end", () => {
    server.closeAllConnections();
    server.close(() => sqlite.close());
  });
}
