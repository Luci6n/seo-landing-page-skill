#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const shouldWriteReport = !args.includes("--no-write") && !args.includes("--stdout");
const accessToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN;

if (!accessToken) {
  console.error("Missing GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN.");
  console.error("This script requires a token with webmasters or webmasters.readonly scope.");
  process.exit(1);
}

const response = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

const body = await response.text();

if (!response.ok) {
  console.error(`Search Console sites list failed with HTTP ${response.status}.`);
  console.error(body);
  process.exit(1);
}

const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, "reports");
const outputPath = path.join(reportsDir, "search-console-sites.json");

if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, body);
  console.log(`Search Console sites report written to ${outputPath}`);
} else {
  console.log(body);
}
