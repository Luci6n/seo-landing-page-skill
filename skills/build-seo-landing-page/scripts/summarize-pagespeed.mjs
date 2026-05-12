#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const reportPathArg = args.find((arg) => !arg.startsWith("--")) || "reports/pagespeed-mobile.json";
const shouldWriteReport = !args.includes("--no-write") && !args.includes("--stdout");
const projectRoot = process.cwd();
const reportPath = path.resolve(projectRoot, reportPathArg);

if (!existsSync(reportPath)) {
  console.error(`Report file not found: ${reportPath}`);
  console.error("Usage: node <skill-dir>/scripts/summarize-pagespeed.mjs [pagespeed-json-report] [--no-write]");
  process.exit(1);
}

const report = JSON.parse(readFileSync(reportPath, "utf8"));
if (report.error) {
  console.error(`PageSpeed report contains API error: ${report.error.message || "Unknown error"}`);
  process.exit(1);
}

const lighthouse = report.lighthouseResult;
if (!lighthouse) {
  console.error("Invalid PageSpeed report: missing lighthouseResult.");
  process.exit(1);
}

function score(category) {
  const value = lighthouse.categories?.[category]?.score;
  return typeof value === "number" ? Math.round(value * 100) : "n/a";
}

function auditValue(id) {
  return lighthouse.audits?.[id]?.displayValue || "n/a";
}

const lines = [
  "# PageSpeed Summary",
  "",
  `URL: ${lighthouse.finalDisplayedUrl || lighthouse.finalUrl || report.id || "n/a"}`,
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Scores",
  "",
  `- Performance: ${score("performance")}`,
  `- Accessibility: ${score("accessibility")}`,
  `- Best Practices: ${score("best-practices")}`,
  `- SEO: ${score("seo")}`,
  "",
  "## Core Metrics",
  "",
  `- LCP: ${auditValue("largest-contentful-paint")}`,
  `- CLS: ${auditValue("cumulative-layout-shift")}`,
  `- TBT: ${auditValue("total-blocking-time")}`,
  `- Speed Index: ${auditValue("speed-index")}`,
  "",
  "## Notes",
  "",
  "- PageSpeed combines Lighthouse lab data with field data when available.",
  "- Treat scores as diagnostic signals, not guarantees."
];

const reportsDir = path.join(projectRoot, "reports");
const outputPath = path.join(reportsDir, "pagespeed-summary.md");
if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, `${lines.join("\n")}\n`);
  console.log(`PageSpeed summary written to ${outputPath}`);
} else {
  console.log(lines.join("\n"));
}
