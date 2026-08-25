import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

/**
 * Boots the production build (`next start`) once for the whole test run and
 * exposes its origin as globalThis.__SITE__. Tests fetch real HTTP responses —
 * the same thing Vercel serves.
 */
const PORT = 4123;

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  // Fully detached from our stdio and unref'd, so the test process can exit
  // the moment the suite finishes instead of being held open by child pipes.
  stdio: "ignore",
  env: { ...process.env },
});
server.unref();
process.on("exit", () => server.kill("SIGTERM"));

let ready = false;
for (let i = 0; i < 60 && !ready; i++) {
  try {
    await fetch(`http://localhost:${PORT}/`);
    ready = true;
  } catch {
    await sleep(500);
  }
}
if (!ready) {
  console.error("next start did not become ready on port", PORT);
  process.exit(1);
}

globalThis.__SITE__ = `http://localhost:${PORT}`;
