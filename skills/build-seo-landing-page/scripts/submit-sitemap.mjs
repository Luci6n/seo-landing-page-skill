#!/usr/bin/env node
const [, , siteUrl, sitemapUrl] = process.argv;

if (!siteUrl || !sitemapUrl) {
  console.error("Usage: node <skill-dir>/scripts/submit-sitemap.mjs <search-console-site-url> <sitemap-url>");
  console.error("Example: node <skill-dir>/scripts/submit-sitemap.mjs https://example.com/ https://example.com/sitemap.xml");
  process.exit(1);
}

const accessToken = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN;

if (!accessToken) {
  console.error("Missing GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN.");
  console.error("Use an OAuth flow or official Google tooling to obtain a token with the webmasters scope.");
  process.exit(1);
}

const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

const response = await fetch(endpoint, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

if (response.ok) {
  console.log(`Submitted sitemap: ${sitemapUrl}`);
  console.log("Submitted is not indexed. Check coverage later before reporting success.");
} else {
  // Set exitCode rather than calling process.exit(): an immediate exit while
  // the HTTP connection is still closing aborts the process on Windows.
  process.exitCode = 1;
  console.error(`Sitemap submit failed with HTTP ${response.status}`);
  console.error(await response.text());
}
