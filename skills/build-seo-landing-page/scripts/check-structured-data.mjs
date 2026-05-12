#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const htmlPathArg = args.find((arg) => !arg.startsWith("--")) || "index.html";
const shouldWriteReport = !args.includes("--no-write") && !args.includes("--stdout");
const projectRoot = process.cwd();
const htmlPath = path.resolve(projectRoot, htmlPathArg);

if (!existsSync(htmlPath)) {
  console.error(`HTML file not found: ${htmlPath}`);
  console.error("Usage: node <skill-dir>/scripts/check-structured-data.mjs [html-file] [--no-write]");
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const reportsDir = path.join(projectRoot, "reports");

function result(label, status, detail = "") {
  return { label, status, detail };
}

function asArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function hasAny(object, keys) {
  return keys.some((key) => object[key] !== undefined && object[key] !== "");
}

function nodeTypes(node) {
  return asArray(node?.["@type"]).filter(Boolean);
}

function collectNodes(value, nodes = [], seen = new WeakSet()) {
  if (!value) return nodes;

  if (Array.isArray(value)) {
    for (const item of value) collectNodes(item, nodes, seen);
    return nodes;
  }

  if (typeof value !== "object") return nodes;
  if (seen.has(value)) return nodes;
  seen.add(value);

  if (value["@type"]) nodes.push(value);

  for (const child of Object.values(value)) {
    collectNodes(child, nodes, seen);
  }

  return nodes;
}

function extractJsonLdBlocks() {
  const blocks = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  for (const match of html.matchAll(pattern)) {
    blocks.push(match[1].trim());
  }

  return blocks;
}

function checkLocalBusiness(node) {
  const checks = [];
  const required = ["name", "url", "address"];

  for (const key of required) {
    checks.push(result(`LocalBusiness has ${key}`, node[key] ? "pass" : "fail"));
  }

  checks.push(
    result(
      "LocalBusiness has phone or contactPoint",
      hasAny(node, ["telephone", "contactPoint"]) ? "pass" : "warn"
    )
  );
  checks.push(
    result(
      "LocalBusiness has opening hours",
      hasAny(node, ["openingHours", "openingHoursSpecification"]) ? "pass" : "warn"
    )
  );
  checks.push(result("LocalBusiness has service area", node.areaServed ? "pass" : "warn"));
  checks.push(result("LocalBusiness has image or logo", hasAny(node, ["image", "logo"]) ? "pass" : "warn"));

  return checks;
}

function checkWebsite(node) {
  return [
    result("WebSite has name", node.name ? "pass" : "fail"),
    result("WebSite has url", node.url ? "pass" : "fail")
  ];
}

function checkFaqPage(node) {
  const questions = asArray(node.mainEntity);
  const checks = [
    result("FAQPage has questions", questions.length > 0 ? "pass" : "fail", `${questions.length} question(s).`)
  ];

  questions.forEach((question, index) => {
    checks.push(result(`FAQ question ${index + 1} has name`, question.name ? "pass" : "fail"));
    checks.push(
      result(
        `FAQ question ${index + 1} has acceptedAnswer text`,
        question.acceptedAnswer?.text ? "pass" : "fail"
      )
    );
  });

  return checks;
}

function checkProduct(node) {
  const hasRichResultRequirement = hasAny(node, ["offers", "review", "aggregateRating"]);
  return [
    result(
      "Product schema has offers, review, or aggregateRating",
      hasRichResultRequirement ? "pass" : "fail",
      "Avoid Product schema for services unless real product offer/review data exists."
    )
  ];
}

function checkService(node) {
  return [
    result("Service has name", node.name ? "pass" : "fail")
  ];
}

const checks = [];
const jsonLdBlocks = extractJsonLdBlocks();
const parsedBlocks = [];

checks.push(
  result("JSON-LD blocks exist", jsonLdBlocks.length > 0 ? "pass" : "fail", `${jsonLdBlocks.length} block(s).`)
);

jsonLdBlocks.forEach((block, index) => {
  try {
    parsedBlocks.push(JSON.parse(block));
    checks.push(result(`JSON-LD block ${index + 1} parses`, "pass"));
  } catch (error) {
    checks.push(result(`JSON-LD block ${index + 1} parses`, "fail", error.message));
  }
});

const nodes = parsedBlocks.flatMap((block) => collectNodes(block));
const detectedTypes = [...new Set(nodes.flatMap(nodeTypes))].sort();
checks.push(
  result(
    "Structured data types detected",
    detectedTypes.length > 0 ? "pass" : "warn",
    detectedTypes.length > 0 ? detectedTypes.join(", ") : "No @type values found."
  )
);

for (const node of nodes) {
  const types = nodeTypes(node);
  if (types.some((type) => ["LocalBusiness", "HVACBusiness", "HomeAndConstructionBusiness"].includes(type))) {
    checks.push(...checkLocalBusiness(node));
  }

  if (types.includes("WebSite")) {
    checks.push(...checkWebsite(node));
  }

  if (types.includes("FAQPage")) {
    checks.push(...checkFaqPage(node));
  }

  if (types.includes("Product")) {
    checks.push(...checkProduct(node));
  }

  if (types.includes("Service")) {
    checks.push(...checkService(node));
  }
}

const passed = checks.filter((check) => check.status === "pass").length;
const warned = checks.filter((check) => check.status === "warn").length;
const failed = checks.filter((check) => check.status === "fail").length;

const markdown = [
  "# Structured Data Audit",
  "",
  `File: ${path.relative(projectRoot, htmlPath)}`,
  `Generated: ${new Date().toISOString()}`,
  "",
  `Passed: ${passed}`,
  `Warnings: ${warned}`,
  `Failed: ${failed}`,
  "",
  "## Checks",
  "",
  ...checks.map((check) => `- [${check.status === "pass" ? "x" : " "}] ${check.status.toUpperCase()}: ${check.label}${check.detail ? ` - ${check.detail}` : ""}`),
  "",
  "## Notes",
  "",
  "- This is a static JSON-LD sanity check, not a replacement for Rich Results Test or Schema.org validator.",
  "- Treat warnings in context. Some fields are recommended rather than universally required."
].join("\n");

const outputPath = path.join(reportsDir, "structured-data-audit.md");

if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, `${markdown}\n`);
  console.log(`Structured data audit written to ${outputPath}`);
} else {
  console.log(markdown);
}
if (failed > 0) {
  console.warn(`${failed} structured data issue(s) need review.`);
  process.exitCode = 1;
} else if (warned > 0) {
  console.warn(`${warned} warning(s) should be reviewed in context.`);
}
