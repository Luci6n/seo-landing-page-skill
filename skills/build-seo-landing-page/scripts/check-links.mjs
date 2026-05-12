#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const htmlPathArg = args.find((arg) => !arg.startsWith("--")) || "index.html";
const shouldCheckNetwork = args.includes("--network");
const shouldWriteReport = !args.includes("--no-write") && !args.includes("--stdout");

const projectRoot = process.cwd();
const htmlPath = path.resolve(projectRoot, htmlPathArg);

if (!existsSync(htmlPath)) {
  console.error(`HTML file not found: ${htmlPath}`);
  console.error("Usage: node <skill-dir>/scripts/check-links.mjs [html-file] [--network] [--no-write]");
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const htmlDir = path.dirname(htmlPath);
const reportsDir = path.join(projectRoot, "reports");

function decodeAttributeValue(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .trim();
}

function isIgnoredProtocol(value) {
  return /^(?:mailto|tel|sms|javascript|data|blob):/i.test(value);
}

function splitPathAndHash(value) {
  const [withoutQuery] = value.split("?");
  const [pathname = "", hash = ""] = withoutQuery.split("#");
  return { pathname, hash };
}

function htmlHasAnchor(documentHtml, hash) {
  if (!hash) return true;
  const id = hash.replace(/^#/, "");
  if (!id) return true;

  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\s(?:id|name)=["']${escaped}["']`, "i").test(documentHtml);
}

function localPathFromUrl(value) {
  const { pathname } = splitPathAndHash(value);
  if (!pathname) return htmlPath;

  try {
    const decodedPath = decodeURI(pathname);
    if (decodedPath.startsWith("/")) {
      return path.resolve(projectRoot, `.${decodedPath}`);
    }
    return path.resolve(htmlDir, decodedPath);
  } catch {
    return null;
  }
}

function localTargetExists(filePath) {
  if (!filePath || !existsSync(filePath)) return false;
  const stat = statSync(filePath);
  if (stat.isDirectory()) {
    return existsSync(path.join(filePath, "index.html"));
  }
  return stat.isFile();
}

function collectAttributeUrls() {
  const urls = [];
  const attrPattern = /\b(?:href|src|poster)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrPattern)) {
    urls.push({ target: decodeAttributeValue(match[1]), source: "html attribute" });
  }

  const metaImagePattern =
    /<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(metaImagePattern)) {
    urls.push({ target: decodeAttributeValue(match[1]), source: "social image meta" });
  }

  return urls;
}

function result(status, target, detail, source) {
  return { status, target, detail, source };
}

async function checkExternalUrl(target, source) {
  if (!shouldCheckNetwork) {
    return result("warn", target, "External URL not checked. Run with --network to verify.", source);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    let response = await fetch(target, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "landing-page-link-check/1.0"
      }
    });

    if ([403, 405].includes(response.status)) {
      response = await fetch(target, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "landing-page-link-check/1.0"
        }
      });
    }

    if (response.ok) {
      return result("pass", target, `HTTP ${response.status}`, source);
    }

    return result("fail", target, `HTTP ${response.status}`, source);
  } catch (error) {
    return result("fail", target, error.message, source);
  } finally {
    clearTimeout(timeout);
  }
}

async function checkUrl({ target, source }) {
  if (!target || target === "#") {
    return result("warn", target || "(empty)", "Empty or placeholder URL.", source);
  }

  if (isIgnoredProtocol(target)) {
    return result("pass", target, "Skipped non-page protocol.", source);
  }

  if (/^https?:\/\//i.test(target)) {
    return checkExternalUrl(target, source);
  }

  if (target.startsWith("//")) {
    return checkExternalUrl(`https:${target}`, source);
  }

  const { pathname, hash } = splitPathAndHash(target);
  const localPath = localPathFromUrl(target);

  if (!localPath || !localTargetExists(localPath)) {
    return result("fail", target, "Local file or route target was not found.", source);
  }

  if (hash) {
    const isCurrentDocument = path.resolve(localPath) === path.resolve(htmlPath);
    const targetHtml = isCurrentDocument || localPath.endsWith(".html")
      ? readFileSync(localPath, "utf8")
      : html;

    if (!htmlHasAnchor(targetHtml, hash)) {
      return result("fail", target, `Fragment #${hash} was not found.`, source);
    }
  }

  return result("pass", target, pathname ? "Local target exists." : "Current document fragment exists.", source);
}

const uniqueUrls = new Map();
for (const item of collectAttributeUrls()) {
  if (!uniqueUrls.has(item.target)) uniqueUrls.set(item.target, item);
}

const checks = [];
for (const item of uniqueUrls.values()) {
  checks.push(await checkUrl(item));
}

const passed = checks.filter((check) => check.status === "pass").length;
const warned = checks.filter((check) => check.status === "warn").length;
const failed = checks.filter((check) => check.status === "fail").length;

const markdown = [
  "# Link And Asset Audit",
  "",
  `File: ${path.relative(projectRoot, htmlPath)}`,
  `Generated: ${new Date().toISOString()}`,
  `Network checks: ${shouldCheckNetwork ? "enabled" : "disabled"}`,
  "",
  `Passed: ${passed}`,
  `Warnings: ${warned}`,
  `Failed: ${failed}`,
  "",
  "## Checks",
  "",
  ...checks.map(
    (check) =>
      `- [${check.status === "pass" ? "x" : " "}] ${check.status.toUpperCase()}: ${check.target} - ${check.detail} (${check.source})`
  ),
  "",
  "## Notes",
  "",
  "- This script checks local files and same-page fragments without network access.",
  "- Use `--network` only when the environment allows outbound requests."
].join("\n");

const outputPath = path.join(reportsDir, "link-check.md");

if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, `${markdown}\n`);
  console.log(`Link and asset audit written to ${outputPath}`);
} else {
  console.log(markdown);
}
if (failed > 0) {
  console.warn(`${failed} link or asset issue(s) need review.`);
  process.exitCode = 1;
} else if (warned > 0) {
  console.warn(`${warned} warning(s) should be reviewed in context.`);
}
