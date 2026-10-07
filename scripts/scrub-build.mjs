import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

try {
  const local = await readFile(path.join(".env.local"), "utf8");
  for (const line of local.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim();
  }
} catch {
  // Netlify injects the variables. A missing local file is expected there.
}

const secretNames = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_ANON_KEY",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "PAYSTACK_SECRET_KEY",
  "FLUTTERWAVE_SECRET_KEY",
  "FLUTTERWAVE_HASH",
  "RESEND_API_KEY",
];

const values = secretNames
  .map((name) => process.env[name])
  .filter((value) => typeof value === "string" && value.length >= 8);

async function files(dir) {
  const found = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await files(full)));
    else {
      const info = await stat(full).catch(() => null);
      if (info && info.size <= 1_500_000) found.push(full);
    }
  }
  return found;
}

await rm(path.join(".next", "cache"), { recursive: true, force: true });
await rm(path.join(".next", "dev"), { recursive: true, force: true });

const leaks = [];
for (const folder of [path.join(".next", "static"), path.join(".next", "server")]) {
  for (const file of await files(folder)) {
    let text = "";
    try {
      text = await readFile(file, "utf8");
    } catch {
      continue;
    }
    if (values.some((value) => text.includes(value))) leaks.push(path.relative(process.cwd(), file));
  }
}

if (leaks.length) {
  console.error("Refusing to publish. A server secret was written into the build output.");
  console.error(leaks.slice(0, 20).join("\n"));
  process.exit(1);
}

console.log("Build output has no server secrets.");
