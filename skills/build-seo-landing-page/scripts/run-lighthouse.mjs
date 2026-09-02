#!/usr/bin/env node
import { existsSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const [, , url, strategy = "mobile"] = process.argv;

if (!url) {
  console.error("Usage: node <skill-dir>/scripts/run-lighthouse.mjs <url> [mobile|desktop]");
  process.exit(1);
}

if (!["mobile", "desktop"].includes(strategy)) {
  console.error("Strategy must be either 'mobile' or 'desktop'.");
  process.exit(1);
}

const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, "reports");
mkdirSync(reportsDir, { recursive: true });

const presetArgs =
  strategy === "desktop"
    ? ["--preset=desktop"]
    : ["--form-factor=mobile", "--screenEmulation.mobile=true"];

const outputPath = path.join(reportsDir, `lighthouse-${strategy}.json`);
const args = [
  "lighthouse",
  url,
  "--output=json",
  `--output-path=${outputPath}`,
  "--chrome-flags=--headless",
  ...presetArgs
];

console.log(`Running Lighthouse for ${url} (${strategy})...`);
const child = spawn("npx", args, { stdio: "inherit", shell: process.platform === "win32" });

// Set exitCode rather than calling process.exit() from inside this callback,
// and verify the file rather than trusting the child's exit code alone: a
// known chrome-launcher bug crashes with EPERM while deleting its own Chrome
// temp profile directory on Windows (GoogleChrome/chrome-launcher#355), after
// the child process has already reported success or failure but sometimes
// without the report ever being written to disk.
child.on("exit", (code) => {
  const reportExists = existsSync(outputPath);

  if (code === 0 && reportExists) {
    console.log(`Lighthouse report written to ${outputPath}`);
    return;
  }

  if (reportExists) {
    console.warn(`Lighthouse exited with a non-zero code, but ${outputPath} exists. Inspect it before trusting it.`);
    return;
  }

  process.exitCode = code || 1;
  console.error(`Lighthouse failed: no report was written to ${outputPath}.`);
  console.error("If the error above is an EPERM during Chrome cleanup on Windows (chrome-launcher destroyTmp),");
  console.error("that is a known upstream issue unrelated to missing dependencies - see");
  console.error("github.com/GoogleChrome/chrome-launcher/issues/355. Use run-pagespeed.mjs as a working");
  console.error("alternative; it does not need a local Chrome launch and also returns field data.");
  console.error("For other failures, missing dependencies may be the cause: try npm install -D lighthouse.");
});
