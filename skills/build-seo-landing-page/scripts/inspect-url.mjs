#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , inspectionUrl, siteUrl, languageCode = "en-US"] = process.argv;

if (!inspectionUrl || !siteUrl) {
  console.error("Usage: node <skill-dir>/scripts/inspect-url.mjs <inspection-url> <search-console-site-url> [language-code]");
  console.error("Example: node <skill-dir>/scripts/inspect-url.mjs https://example.com/ https://example.com/ en-US");
  process.exit(1);
}

const accessToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN;

if (!accessToken) {
  console.error("Missing GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN.");
  console.error("This script requires a token with webmasters or webmasters.readonly scope.");
  process.exit(1);
}

const response = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    inspectionUrl,
    siteUrl,
    languageCode
  })
});

const body = await response.text();
const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, "reports");
mkdirSync(reportsDir, { recursive: true });
const outputPath = path.join(reportsDir, "search-console-url-inspection.json");
writeFileSync(outputPath, body);

if (response.ok) {
  console.log(`URL Inspection report written to ${outputPath}`);
} else {
  // Set exitCode rather than calling process.exit(): an immediate exit while
  // the HTTP connection is still closing aborts the process on Windows.
  process.exitCode = 1;
  console.error(`URL Inspection API failed with HTTP ${response.status}. Response written to ${outputPath}`);
}
