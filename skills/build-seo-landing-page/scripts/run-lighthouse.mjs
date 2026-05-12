#!/usr/bin/env node
import { mkdirSync } from "node:fs";
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

child.on("exit", (code) => {
  if (code === 0) {
    console.log(`Lighthouse report written to ${outputPath}`);
    return;
  }

  console.error("Lighthouse failed. If dependencies are missing, try: npm install -D lighthouse");
  process.exit(code ?? 1);
});
