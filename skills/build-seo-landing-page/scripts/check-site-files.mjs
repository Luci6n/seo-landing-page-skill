#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const siteRootArg = args.find((arg) => !arg.startsWith("--")) || ".";
const shouldWriteReport = !args.includes("--no-write") && !args.includes("--stdout");
const projectRoot = path.resolve(process.cwd(), siteRootArg);
const reportsDir = path.join(process.cwd(), "reports");

function result(label, status, detail = "") {
  return { label, status, detail };
}

function readIfExists(relativePath) {
  const filePath = path.join(projectRoot, relativePath);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf8");
}

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(value);
}

function localFileExists(urlPath) {
  if (!urlPath || isAbsoluteUrl(urlPath) || urlPath.startsWith("data:")) return true;
  const cleanPath = urlPath.split("?")[0].split("#")[0];
  const normalized = cleanPath.startsWith("/") ? `.${cleanPath}` : cleanPath;
  return existsSync(path.resolve(projectRoot, normalized));
}

const checks = [];

const robots = readIfExists("robots.txt");
checks.push(result("robots.txt exists", robots ? "pass" : "fail"));
if (robots) {
  checks.push(result("robots.txt has User-agent", /User-agent\s*:/i.test(robots) ? "pass" : "warn"));
  checks.push(result("robots.txt has Sitemap", /Sitemap\s*:/i.test(robots) ? "pass" : "warn"));
  checks.push(result("robots.txt has no template placeholders", /\{\{[^}]+\}\}/.test(robots) ? "fail" : "pass"));
}

const sitemap = readIfExists("sitemap.xml");
checks.push(result("sitemap.xml exists", sitemap ? "pass" : "fail"));
if (sitemap) {
  const locs = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1].trim());
  const lastmods = [...sitemap.matchAll(/<lastmod>\s*([^<]+)\s*<\/lastmod>/gi)].map((match) => match[1].trim());

  checks.push(result("sitemap.xml has URL entries", locs.length > 0 ? "pass" : "fail", `${locs.length} URL(s).`));
  checks.push(result("sitemap URLs are absolute", locs.every(isAbsoluteUrl) ? "pass" : "fail"));
  checks.push(result("sitemap.xml has no template placeholders", /\{\{[^}]+\}\}/.test(sitemap) ? "fail" : "pass"));
  checks.push(
    result(
      "sitemap lastmod values look valid",
      lastmods.length === 0 || lastmods.every((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)) ? "pass" : "warn",
      lastmods.length ? `${lastmods.length} lastmod value(s).` : "No lastmod values found."
    )
  );
}

const manifestText = readIfExists("site.webmanifest");
checks.push(result("site.webmanifest exists", manifestText ? "pass" : "warn"));
if (manifestText) {
  try {
    const manifest = JSON.parse(manifestText);
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];

    checks.push(result("site.webmanifest parses", "pass"));
    checks.push(result("manifest has name", manifest.name ? "pass" : "fail"));
    checks.push(result("manifest has short_name", manifest.short_name ? "pass" : "warn"));
    checks.push(result("manifest has icons", icons.length > 0 ? "pass" : "warn", `${icons.length} icon(s).`));
    checks.push(result("manifest icon files exist", icons.every((icon) => localFileExists(icon.src)) ? "pass" : "fail"));

    const iconSizes = new Set(icons.flatMap((icon) => String(icon.sizes || "").split(/\s+/)));
    checks.push(
      result(
        "manifest has 192x192 and 512x512 icons",
        iconSizes.has("192x192") && iconSizes.has("512x512") ? "pass" : "warn",
        "Chrome's installability check expects both sizes."
      )
    );
    checks.push(result("manifest has theme_color", manifest.theme_color ? "pass" : "warn"));
    checks.push(result("site.webmanifest has no template placeholders", /\{\{[^}]+\}\}/.test(manifestText) ? "fail" : "pass"));
  } catch (error) {
    checks.push(result("site.webmanifest parses", "fail", error.message));
  }
}

for (const iconPath of ["favicon.ico", "favicon.png", "apple-touch-icon.png"]) {
  checks.push(result(`${iconPath} exists`, existsSync(path.join(projectRoot, iconPath)) ? "pass" : "warn"));
}

const llmsTxt = readIfExists("llms.txt");
checks.push(result("llms.txt exists", llmsTxt ? "pass" : "warn", "Optional AI-crawler guidance file; not required."));
if (llmsTxt) {
  checks.push(result("llms.txt has an H1 title", /^#\s+\S/m.test(llmsTxt) ? "pass" : "fail"));
  checks.push(result("llms.txt has a summary blockquote", /^>\s*\S/m.test(llmsTxt) ? "pass" : "warn"));
  checks.push(result("llms.txt has no template placeholders", /\{\{[^}]+\}\}/.test(llmsTxt) ? "fail" : "pass"));
}

const passed = checks.filter((check) => check.status === "pass").length;
const warned = checks.filter((check) => check.status === "warn").length;
const failed = checks.filter((check) => check.status === "fail").length;

const markdown = [
  "# Site Support Files Audit",
  "",
  `Root: ${projectRoot}`,
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
  "- Run this from the project root.",
  "- Pass a site root such as `public` when crawl files live in a framework public directory.",
  "- This is a static support-file check, not a crawler or Search Console replacement."
].join("\n");

const outputPath = path.join(reportsDir, "site-files-audit.md");
if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, `${markdown}\n`);
  console.log(`Site support files audit written to ${outputPath}`);
} else {
  console.log(markdown);
}

if (failed > 0) {
  console.warn(`${failed} site support file issue(s) need review.`);
  process.exitCode = 1;
} else if (warned > 0) {
  console.warn(`${warned} warning(s) should be reviewed in context.`);
}
