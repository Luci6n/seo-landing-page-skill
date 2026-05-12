#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const reportPathArg = args.find((arg) => !arg.startsWith("--")) || "reports/lighthouse-mobile.json";
const shouldWriteReport = !args.includes("--no-write") && !args.includes("--stdout");
const projectRoot = process.cwd();
const reportPath = path.resolve(projectRoot, reportPathArg);

if (!existsSync(reportPath)) {
  console.error(`Report file not found: ${reportPath}`);
  console.error("Usage: node <skill-dir>/scripts/summarize-lighthouse.mjs [lighthouse-json-report] [--no-write]");
  process.exit(1);
}

const lighthouse = JSON.parse(readFileSync(reportPath, "utf8"));

function score(category) {
  const value = lighthouse.categories?.[category]?.score;
  return typeof value === "number" ? Math.round(value * 100) : "n/a";
}

function auditValue(id) {
  return lighthouse.audits?.[id]?.displayValue || "n/a";
}

function failedAuditIds() {
  return Object.values(lighthouse.audits || {})
    .filter((audit) => audit.scoreDisplayMode !== "notApplicable")
    .filter((audit) => typeof audit.score === "number" && audit.score < 0.9)
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
    .slice(0, 8)
    .map((audit) => `- ${audit.title}: ${audit.displayValue || audit.description || "review"}`);
}

const lines = [
  "# Lighthouse Summary",
  "",
  `URL: ${lighthouse.finalDisplayedUrl || lighthouse.finalUrl || lighthouse.requestedUrl || "n/a"}`,
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
  "## Top Audits To Review",
  "",
  ...(failedAuditIds().length ? failedAuditIds() : ["- No major scored audit issues found."]),
  "",
  "## Notes",
  "",
  "- Lighthouse is lab data from one run. Re-test after important content, asset, or script changes.",
  "- Check the rendered page manually for layout, copy, and conversion quality."
];

const reportsDir = path.join(projectRoot, "reports");
const outputPath = path.join(reportsDir, "lighthouse-summary.md");
if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, `${lines.join("\n")}\n`);
  console.log(`Lighthouse summary written to ${outputPath}`);
} else {
  console.log(lines.join("\n"));
}
