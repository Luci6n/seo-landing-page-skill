# Validation Workflow

Use this when checking whether a landing page is ready before or after deployment.

## Contents

- Validation Order
- Static Local Checks
- Link And Asset Checks
- Support File Checks
- Placeholder Checks
- Lighthouse
- PageSpeed Insights
- Structured Data Validation
- Providing Credentials Safely
- Search Console
- Social Preview Checks
- Reporting

## Validation Order

Run checks in this order:

1. Static local checks.
2. Browser/mobile layout checks.
3. Lighthouse or PageSpeed checks.
4. Structured data validation.
5. Search Console checks after deployment.
6. Social preview checks when public URL is available.

## Static Local Checks

Useful when network, API keys, or browser tools are unavailable:

```bash
node <skill-dir>/scripts/check-metadata.mjs index.html
node <skill-dir>/scripts/check-structured-data.mjs index.html
node <skill-dir>/scripts/check-links.mjs index.html
node <skill-dir>/scripts/check-site-files.mjs
node <skill-dir>/scripts/check-placeholders.mjs
```

Use no-write mode when testing without creating reports:

```bash
node <skill-dir>/scripts/check-metadata.mjs index.html --no-write
node <skill-dir>/scripts/check-structured-data.mjs index.html --no-write
node <skill-dir>/scripts/check-links.mjs index.html --no-write
node <skill-dir>/scripts/check-site-files.mjs --no-write
node <skill-dir>/scripts/check-site-files.mjs public --no-write
node <skill-dir>/scripts/check-placeholders.mjs --no-write
```

These checks do not replace browser rendering, Lighthouse, Search Console, or official rich-result tools.

Run scripts from the target project root so relative paths and generated `reports/` output point to the project being audited.

## Link And Asset Checks

Run local-only checks first.

Use network checks only when outbound network is allowed:

```bash
node <skill-dir>/scripts/check-links.mjs index.html --network
```

Warnings for external URLs are expected when `--network` is not used.

## Support File Checks

Use support-file checks for static site identity and crawl files:

```bash
node <skill-dir>/scripts/check-site-files.mjs
```

This checks `robots.txt`, `sitemap.xml`, `site.webmanifest`, `llms.txt`, and common icon files. For framework projects before build, pass the public asset directory:

```bash
node <skill-dir>/scripts/check-site-files.mjs public
```

Manifest icon note: Chrome's installability check wants a 192x192 and a 512x512 PNG, which is why `templates/site.webmanifest` lists those sizes. Correct icons make the manifest valid and give a good add-to-home-screen icon, but full PWA installability also needs HTTPS and a service worker with a fetch handler. Most landing pages have neither and do not need them — do not tell a client the page is an installable PWA just because the manifest is correct.

## Placeholder Checks

After applying templates, check that no `{{PLACEHOLDER}}` values remain in project files:

```bash
node <skill-dir>/scripts/check-placeholders.mjs
```

## Lighthouse

Use Lighthouse for local or deployed pages:

```bash
node <skill-dir>/scripts/run-lighthouse.mjs https://example.com/ mobile
node <skill-dir>/scripts/run-lighthouse.mjs https://example.com/ desktop
node <skill-dir>/scripts/summarize-lighthouse.mjs reports/lighthouse-mobile.json
```

If Lighthouse is not installed, install it in the project only when appropriate:

```bash
npm install -D lighthouse
```

Do not treat a single Lighthouse run as permanent truth. Re-test after meaningful layout, asset, or script changes.

### Known Windows Failure

On Windows, `run-lighthouse.mjs` can fail with an `EPERM` error deleting a temp Chrome profile directory (`chrome-launcher` `destroyTmp`), even though Chrome and Lighthouse both ran correctly. This is a known upstream bug, not a missing dependency — see [GoogleChrome/chrome-launcher#355](https://github.com/GoogleChrome/chrome-launcher/issues/355). `run-lighthouse.mjs` checks whether a report file actually exists before claiming success or blaming a missing install, and says so plainly when it hits this failure. When it does, use `run-pagespeed.mjs` instead: verified working end to end in this environment, it needs no local Chrome launch, and it returns field data (real-user CrUX metrics) that Lighthouse cannot provide at all.

## PageSpeed Insights

Use PageSpeed Insights for deployed public URLs:

```bash
node <skill-dir>/scripts/run-pagespeed.mjs https://example.com/ mobile
node <skill-dir>/scripts/summarize-pagespeed.mjs reports/pagespeed-mobile.json
```

If `PAGESPEED_API_KEY` is unavailable, no-key requests may hit shared quota and return `429`.

If PageSpeed fails because of quota:

- Do not fake scores.
- Use Lighthouse CLI as fallback.
- Ask the user to provide `PAGESPEED_API_KEY` only when API validation is required.

## Structured Data Validation

Use the local JSON-LD checker first:

```bash
node <skill-dir>/scripts/check-structured-data.mjs index.html
```

Then, for deployed public URLs, use official validators where available:

- Google Rich Results Test
- Schema.org validator
- Search Console enhancement reports

Remember:

- Not all valid schema produces rich results.
- Search Console may show old crawled data until Google recrawls.
- Product schema needs real offer/review/rating data when used for rich results.

## Providing Credentials Safely

Scripts read credentials from environment variables only. There is deliberately no prompt and no `--key` flag.

Have the user set the variable in their own terminal **before starting the agent session**, so the value is inherited without ever entering the conversation:

```powershell
# PowerShell - lasts for this terminal session only
$env:PAGESPEED_API_KEY = "your-key"
```

```bash
# bash/zsh - lasts for this terminal session only
export PAGESPEED_API_KEY="your-key"
```

To persist across reboots instead, use `setx PAGESPEED_API_KEY "your-key"` on Windows (takes effect in new terminals) or a shell profile entry. That is convenient but no longer session-scoped, so it suits a personal machine rather than a shared one.

Three things to avoid, in order of severity:

- Do not ask the user to paste a key into the chat. It is then in the transcript and logs for good.
- Do not inline a key into a command, such as `PAGESPEED_API_KEY=... node run-pagespeed.mjs`. Same exposure, plus shell history and the process list.
- Do not write a key into `.env`, project config, or any tracked file unless the user explicitly asks.

Two practical notes. Environment variables exported inside one agent command do not carry over to the next, because each command runs in a fresh shell — so the variable must come from the user's own environment. And PageSpeed works with no key at all, just on shared quota, so try keyless first and only ask for a key after an actual `429`.

## Search Console

Search Console API scripts require a verified property and OAuth token:

```bash
node <skill-dir>/scripts/list-search-console-sites.mjs
node <skill-dir>/scripts/submit-sitemap.mjs https://example.com/ https://example.com/sitemap.xml
node <skill-dir>/scripts/inspect-url.mjs https://example.com/ https://example.com/
```

Required environment variable:

```bash
GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN
```

Do not claim that sitemap submission means the page is indexed. For ordinary pages, manual URL Inspection / Request Indexing may still be useful after launch.

## Social Preview Checks

After deployment, verify:

- Open Graph title.
- Description.
- Preview image.
- Site name.
- Favicon.

Social platforms and Google may cache old previews. Re-scrape or wait when caches lag.

## Reporting

When reporting validation, include:

- URL or file checked.
- Tool used.
- Date/time if relevant.
- Pass/warn/fail summary.
- Any blocked checks and why.
- Remaining manual or off-site actions.

Never report a score, indexing state, deployment state, or API result that was not actually observed.
