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
  console.error("Usage: node <skill-dir>/scripts/check-metadata.mjs [html-file] [--no-write]");
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const reportsDir = path.join(projectRoot, "reports");

function has(pattern) {
  return pattern.test(html);
}

function matchText(pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

function count(pattern) {
  return [...html.matchAll(pattern)].length;
}

function result(label, status, detail = "") {
  return { label, status, detail };
}

function parseAttributes(tag) {
  const attrs = {};
  const pattern = /([^\s=/"'<]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

  for (const match of tag.matchAll(pattern)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attrs;
}

const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => parseAttributes(match[0]));
const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => parseAttributes(match[0]));

function getMetaContent(attribute, value) {
  const expected = value.toLowerCase();
  return metaTags.find((attrs) => attrs[attribute]?.toLowerCase() === expected)?.content || "";
}

function hasMeta(attribute, value) {
  return Boolean(getMetaContent(attribute, value));
}

function hasLinkRel(rel) {
  const expected = rel.toLowerCase();
  return linkTags.some((attrs) => {
    const values = (attrs.rel || "").toLowerCase().split(/\s+/);
    return values.includes(expected);
  });
}

// Google Search supports BMP, GIF, ICO, PNG, JPEG, PPM and TIFF favicons, but
// not SVG. A site whose only icon is an SVG gets no favicon in search results.
function hasNonSvgFavicon() {
  return linkTags.some((attrs) => {
    const rels = (attrs.rel || "").toLowerCase().split(/\s+/);
    if (!rels.includes("icon") && !rels.includes("shortcut")) return false;
    const href = (attrs.href || "").toLowerCase().split("?")[0];
    return attrs.type?.toLowerCase() !== "image/svg+xml" && !href.endsWith(".svg");
  });
}

const title = matchText(/<title[^>]*>([\s\S]*?)<\/title>/i);
const description = getMetaContent("name", "description");
const h1Count = count(/<h1\b/gi);
const jsonLdCount = count(/<script\s+type=["']application\/ld\+json["'][^>]*>/gi);
const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
const externalBlankLinks = [...html.matchAll(/<a\b[^>]*>/gi)]
  .map((match) => match[0])
  .filter((tag) => parseAttributes(tag).target === "_blank");

const checks = [
  result("Title exists", title ? "pass" : "fail", title || "Missing <title>."),
  result("Title length is reasonable", title.length > 0 && title.length <= 70 ? "pass" : "warn", title ? `${title.length} characters.` : "Missing title."),
  result("Meta description exists", description ? "pass" : "fail", description || "Missing meta description."),
  result(
    "Meta description length is reasonable",
    description.length > 0 && description.length <= 180 ? "pass" : "warn",
    description ? `${description.length} characters.` : "Missing description."
  ),
  result("Canonical exists", hasLinkRel("canonical") ? "pass" : "fail"),
  result("Robots meta exists", hasMeta("name", "robots") ? "pass" : "warn"),
  result("Open Graph title exists", hasMeta("property", "og:title") ? "pass" : "warn"),
  result("Open Graph description exists", hasMeta("property", "og:description") ? "pass" : "warn"),
  result("Open Graph image exists", hasMeta("property", "og:image") ? "pass" : "warn"),
  result("Twitter card exists", hasMeta("name", "twitter:card") ? "pass" : "warn"),
  result("Favicon exists", hasLinkRel("icon") ? "pass" : "warn"),
  result(
    "Favicon uses a format Google supports",
    !hasLinkRel("icon") || hasNonSvgFavicon() ? "pass" : "warn",
    "Google Search does not support SVG favicons. Add a PNG or ICO alongside it."
  ),
  result("Apple touch icon exists", hasLinkRel("apple-touch-icon") ? "pass" : "warn"),
  result("Web manifest exists", hasLinkRel("manifest") ? "pass" : "warn"),
  result("Exactly one H1", h1Count === 1 ? "pass" : "fail", `${h1Count} h1 element(s).`),
  result("JSON-LD exists", jsonLdCount > 0 ? "pass" : "warn", `${jsonLdCount} JSON-LD script(s).`),
  result("FAQPage schema is present when FAQ appears", !has(/class=["'][^"']*faq|id=["']faq/i) || has(/"@type"\s*:\s*"FAQPage"/i) ? "pass" : "warn"),
  result("No Product schema detected", !has(/"@type"\s*:\s*"Product"/i) ? "pass" : "warn", "Use Product only when real product offer data exists."),
  result("Images include alt attributes", imageTags.every((tag) => /\salt=/.test(tag)) ? "pass" : "warn", `${imageTags.length} image tag(s).`),
  result("Images include width and height where practical", imageTags.every((tag) => /\swidth=/.test(tag) && /\sheight=/.test(tag)) ? "pass" : "warn", `${imageTags.length} image tag(s).`),
  result(
    "Blank-target links use rel noopener",
    externalBlankLinks.every((tag) => (parseAttributes(tag).rel || "").toLowerCase().split(/\s+/).includes("noopener")) ? "pass" : "warn",
    `${externalBlankLinks.length} target=_blank link(s).`
  )
];

const passed = checks.filter((check) => check.status === "pass").length;
const warned = checks.filter((check) => check.status === "warn").length;
const failed = checks.filter((check) => check.status === "fail").length;
const markdown = [
  "# Static Metadata Audit",
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
  "- This is a static heuristic audit, not a replacement for Lighthouse, Rich Results Test, Search Console, or manual review.",
  "- Review warnings in context before changing code."
].join("\n");

const outputPath = path.join(reportsDir, "seo-audit.md");

if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, `${markdown}\n`);
  console.log(`Static metadata audit written to ${outputPath}`);
} else {
  console.log(markdown);
}
if (failed > 0) {
  console.warn(`${failed} check(s) need review.`);
  process.exitCode = 1;
} else if (warned > 0) {
  console.warn(`${warned} warning(s) should be reviewed in context.`);
}
