import { cp, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(root, "dist");
const client = path.join(assets, "client");
const server = path.join(assets, "server");
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
for (const entry of await readdir(assets)) {
  if (["client", "server", ".openai"].includes(entry)) continue;
  await cp(path.join(assets, entry), path.join(client, entry), {
    recursive: true,
  });
}
await cp(
  path.join(root, "account", "worker.mjs"),
  path.join(server, "index.js"),
);
