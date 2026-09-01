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

const METRIC_LABELS = {
  LARGEST_CONTENTFUL_PAINT_MS: "LCP",
  INTERACTION_TO_NEXT_PAINT: "INP",
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "CLS",
  FIRST_CONTENTFUL_PAINT_MS: "FCP",
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: "TTFB"
};

// Field data (CrUX) is the real-user measurement Google uses. It is absent for
// URLs without enough traffic; absence is not the same as passing.
function fieldLines(experience, label) {
  if (!experience?.metrics) return [`- ${label}: no field data available (not enough real-user traffic).`];

  const entries = Object.entries(experience.metrics).map(([key, metric]) => {
    const name = METRIC_LABELS[key] || key;
    // Only label a unit the key itself declares; values are otherwise printed
    // exactly as the API returned them rather than converted.
    const unit = key.endsWith("_MS") ? " ms" : "";
    const category = metric?.category ? ` (${metric.category})` : "";
    return `  - ${name}: ${metric?.percentile ?? "n/a"}${unit}${category}`;
  });

  return [`- ${label}: ${experience.overall_category || "n/a"}`, ...entries];
}

const lines = [
  "# PageSpeed Summary",
  "",
  `URL: ${lighthouse.finalDisplayedUrl || lighthouse.finalUrl || report.id || "n/a"}`,
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Field Data (real users, CrUX)",
  "",
  ...fieldLines(report.loadingExperience, "This URL"),
  ...fieldLines(report.originLoadingExperience, "Whole origin"),
  "",
  "## Lab Scores (simulated)",
  "",
  `- Performance: ${score("performance")}`,
  `- Accessibility: ${score("accessibility")}`,
  `- Best Practices: ${score("best-practices")}`,
  `- SEO: ${score("seo")}`,
  "",
  "## Lab Metrics (simulated)",
  "",
  `- LCP: ${auditValue("largest-contentful-paint")}`,
  `- CLS: ${auditValue("cumulative-layout-shift")}`,
  `- TBT: ${auditValue("total-blocking-time")}`,
  `- Speed Index: ${auditValue("speed-index")}`,
  "",
  "## Notes",
  "",
  "- Field data above is what Google actually uses for Core Web Vitals. Lab numbers are a simulation of one run.",
  "- Lab runs cannot measure INP, because they never interact with the page. Only the field section can report it.",
  "- No field data means too little real-user traffic yet. It does not mean the page passes.",
  "- Field values are printed exactly as the API returns them. Check the metric's documented unit before quoting a CLS number to anyone.",
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
