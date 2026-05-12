#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const scanTargets = args.filter((arg) => !arg.startsWith("--"));
const shouldWriteReport = !args.includes("--no-write") && !args.includes("--stdout");
const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, "reports");
const defaultTargets = scanTargets.length ? scanTargets : ["."];
const ignoredDirs = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".output",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "reports",
  "temp"
]);
const allowedExtensions = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".svelte",
  ".ts",
  ".tsx",
  ".txt",
  ".toml",
  ".vue",
  ".xml",
  ".yaml",
  ".yml"
]);

function walk(targetPath, files = []) {
  if (!existsSync(targetPath)) return files;
  const stat = statSync(targetPath);

  if (stat.isDirectory()) {
    const name = path.basename(targetPath);
    if (ignoredDirs.has(name)) return files;

    for (const entry of readdirSync(targetPath)) {
      walk(path.join(targetPath, entry), files);
    }
    return files;
  }

  if (stat.isFile() && allowedExtensions.has(path.extname(targetPath).toLowerCase())) {
    files.push(targetPath);
  }

  return files;
}

const files = defaultTargets.flatMap((target) => walk(path.resolve(projectRoot, target)));
const placeholderPattern = /\{\{[A-Z0-9_][A-Z0-9_\s-]*\}\}/g;
const findings = [];

for (const filePath of files) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const matches = line.match(placeholderPattern);
    if (!matches) return;

    findings.push({
      file: path.relative(projectRoot, filePath),
      line: index + 1,
      placeholders: [...new Set(matches)]
    });
  });
}

const markdown = [
  "# Placeholder Audit",
  "",
  `Root: ${projectRoot}`,
  `Generated: ${new Date().toISOString()}`,
  `Files scanned: ${files.length}`,
  `Findings: ${findings.length}`,
  "",
  "## Findings",
  "",
  ...(findings.length
    ? findings.map((finding) => `- ${finding.file}:${finding.line} - ${finding.placeholders.join(", ")}`)
    : ["- No unreplaced template placeholders found."]),
  "",
  "## Notes",
  "",
  "- Run this from the project root after applying templates.",
  "- The default scan skips generated folders, dependencies, reports, and this draft `temp/` folder."
].join("\n");

const outputPath = path.join(reportsDir, "placeholder-audit.md");
if (shouldWriteReport) {
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(outputPath, `${markdown}\n`);
  console.log(`Placeholder audit written to ${outputPath}`);
} else {
  console.log(markdown);
}

if (findings.length > 0) {
  console.warn(`${findings.length} unreplaced placeholder occurrence(s) need review.`);
  process.exitCode = 1;
}
