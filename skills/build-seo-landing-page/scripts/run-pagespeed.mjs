#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , url, strategy = "mobile"] = process.argv;

if (!url) {
  console.error("Usage: node <skill-dir>/scripts/run-pagespeed.mjs <url> [mobile|desktop]");
  process.exit(1);
}

if (!["mobile", "desktop"].includes(strategy)) {
  console.error("Strategy must be either 'mobile' or 'desktop'.");
  process.exit(1);
}

const apiKey = process.env.PAGESPEED_API_KEY;
const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, "reports");
mkdirSync(reportsDir, { recursive: true });

const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
endpoint.searchParams.set("url", url);
endpoint.searchParams.set("strategy", strategy);
endpoint.searchParams.append("category", "performance");
endpoint.searchParams.append("category", "accessibility");
endpoint.searchParams.append("category", "best-practices");
endpoint.searchParams.append("category", "seo");
if (apiKey) endpoint.searchParams.set("key", apiKey);

console.log(`Running PageSpeed Insights for ${url} (${strategy})...`);
if (!apiKey) {
  console.warn("PAGESPEED_API_KEY is not set. No-key requests can hit shared quota and return 429.");
}

const response = await fetch(endpoint);
const body = await response.text();
const outputPath = path.join(reportsDir, `pagespeed-${strategy}.json`);
writeFileSync(outputPath, body);

if (!response.ok) {
  console.error(`PageSpeed API failed with HTTP ${response.status}. Report written to ${outputPath}`);
  if (response.status === 429) {
    console.error("Quota exceeded. Set PAGESPEED_API_KEY or fall back to Lighthouse CLI.");
  }
  process.exit(1);
}

console.log(`PageSpeed report written to ${outputPath}`);
