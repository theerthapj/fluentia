import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const host = "127.0.0.1";
const port = 3210;
const url = `http://${host}:${port}`;
const startupTimeoutMs = 180_000;

let server = null;
let stopping = false;

async function fetchWithTimeout(targetUrl, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(targetUrl, { signal: controller.signal });
    return response.ok || response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function serverExited() {
  return Boolean(server && (server.exitCode !== null || server.signalCode !== null));
}

async function isReady() {
  return fetchWithTimeout(url, 10_000);
}

function startServer() {
  server = spawn(
    process.execPath,
    ["./node_modules/next/dist/bin/next", "dev", "--port", String(port), "--hostname", host],
    {
      cwd: rootDir,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "inherit", "inherit"],
      windowsHide: true,
    },
  );

  server.on("exit", (code, signal) => {
    if (!stopping && code !== null && code !== 0) {
      console.error(`Next dev server exited early with code ${code}${signal ? ` (${signal})` : ""}.`);
    }
  });
}

async function waitForServer() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < startupTimeoutMs) {
    if (await isReady()) return;
    if (serverExited()) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function warmRoutes() {
  const paths = [
    "/",
    "/assessment",
    "/mode",
    "/scenarios",
    "/chat?kind=scenario&scenario=formal-beginner-introduce-to-teacher",
    "/chat?kind=scenario&scenario=casual-beginner-favorite-food",
    "/chat?kind=scenario&scenario=formal-advanced-professional-meeting",
  ];

  for (const path of paths) {
    const warmed = await fetchWithTimeout(`${url}${path}`, 90_000);
    if (!warmed) throw new Error(`Timed out warming ${url}${path}`);
  }
}

async function stopServer() {
  if (!server || serverExited() || server.pid === undefined) return;
  stopping = true;

  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });
      killer.on("exit", resolve);
      killer.on("error", resolve);
    });
    return;
  }

  await new Promise((resolve) => {
    const forceKill = setTimeout(() => {
      if (server?.exitCode === null) server.kill("SIGKILL");
    }, 5000);
    server.once("exit", () => {
      clearTimeout(forceKill);
      resolve();
    });
    server.kill("SIGTERM");
  });
}

async function runPlaywright() {
  const args = ["./node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)];
  const child = spawn(process.execPath, args, {
    cwd: rootDir,
    env: { ...process.env, PLAYWRIGHT_SKIP_WEB_SERVER: "1" },
    stdio: "inherit",
    windowsHide: true,
  });

  return await new Promise((resolve) => {
    child.on("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
    child.on("error", () => resolve(1));
  });
}

async function main() {
  const usingExistingServer = await isReady();
  if (!usingExistingServer) {
    startServer();
    await waitForServer();
  }

  try {
    await warmRoutes();
    return await runPlaywright();
  } finally {
    if (!usingExistingServer) await stopServer();
  }
}

process.on("SIGINT", () => {
  void stopServer().finally(() => process.exit(130));
});
process.on("SIGTERM", () => {
  void stopServer().finally(() => process.exit(143));
});

main()
  .then((code) => process.exit(code))
  .catch(async (error) => {
    console.error(error);
    await stopServer();
    process.exit(1);
  });
