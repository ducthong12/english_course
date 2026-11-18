import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(root, "dist");
const client = path.join(assets, "client");
const server = path.join(assets, "server");
// Version assets so CDN caches cannot mix new markup with old styles or scripts.
const indexPath = path.join(assets, "index.html");
let html = await readFile(indexPath, "utf8");
for (const match of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g)) {
  const hash = createHash("sha256")
    .update(await readFile(path.join(assets, match[1])))
    .digest("hex").slice(0, 12);
  html = html.replace(match[0], match[0].split('=')[0] + '="' + match[1] + '?v=' + hash + '"');
}
await writeFile(indexPath, html);
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
