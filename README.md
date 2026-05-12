# Building SEO Landing Pages Skill

This repository contains a Codex skill for building, improving, auditing, deploying, and validating SEO-focused landing pages.

The skill helps agents work on static sites, service pages, local business pages, React/Next.js marketing pages, and other landing-page projects with attention to UX, conversion copy, local SEO, AEO/GEO readiness, structured data, performance, accessibility, deployment, Search Console, and post-launch checks.

## Skill

The installable skill lives in:

```text
building-seo-landing-pages/
```

Its entry point is:

```text
building-seo-landing-pages/SKILL.md
```

Codex uses the `name` and `description` in `SKILL.md` to decide when to load the skill. The current skill name is:

```text
building-seo-landing-pages
```

## What It Includes

- `SKILL.md` - core trigger metadata and workflow instructions.
- `agents/openai.yaml` - UI metadata for the skill.
- `references/` - focused guides for landing-page workflow, framework implementation, content, SEO, local SEO, structured data, validation, deployment, domains, and Search Console.
- `templates/` - reusable starting points for metadata, manifests, robots, sitemaps, JSON-LD, static landing pages, launch checklists, and privacy notices.
- `scripts/` - optional validation helpers for metadata, links, structured data, site files, placeholders, Lighthouse, PageSpeed, and Search Console actions.

## Example Prompts

```text
Use $building-seo-landing-pages to audit this landing page for SEO, structured data, performance, and conversion issues.
```

```text
Use $building-seo-landing-pages to create a local service landing page for an air conditioning business in Kuala Lumpur.
```

```text
Use $building-seo-landing-pages to review this Next.js page before launch and tell me what still needs fixing.
```

## Installation

Copy or link the skill folder into your Codex skills directory:

```powershell
Copy-Item -Recurse .\building-seo-landing-pages "$env:USERPROFILE\.codex\skills\building-seo-landing-pages"
```

After installation, restart Codex or reload the agent environment so the skill metadata is discovered.

## Useful Commands

Run validation scripts from the target website project root.

```bash
node path/to/building-seo-landing-pages/scripts/check-metadata.mjs index.html
node path/to/building-seo-landing-pages/scripts/check-structured-data.mjs index.html
node path/to/building-seo-landing-pages/scripts/check-links.mjs index.html
node path/to/building-seo-landing-pages/scripts/check-site-files.mjs public
node path/to/building-seo-landing-pages/scripts/check-placeholders.mjs .
```

For live performance checks:

```bash
node path/to/building-seo-landing-pages/scripts/run-lighthouse.mjs https://example.com/ mobile
node path/to/building-seo-landing-pages/scripts/summarize-lighthouse.mjs reports/lighthouse-mobile.json
node path/to/building-seo-landing-pages/scripts/run-pagespeed.mjs https://example.com/ mobile
node path/to/building-seo-landing-pages/scripts/summarize-pagespeed.mjs reports/pagespeed-mobile.json
```

PageSpeed can use:

```text
PAGESPEED_API_KEY
```

Search Console scripts require:

```text
GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN
```

## Development Notes

Keep `SKILL.md` concise and put detailed guidance in `references/`. Add scripts only for repeatable checks that benefit from deterministic behavior. Keep templates generic and make sure agents are instructed to adapt them before inserting them into a real project.

When updating the skill, validate the skill folder:

```powershell
python C:\Users\User\.codex\skills\.system\skill-creator\scripts\quick_validate.py .\building-seo-landing-pages
```

## Safety Rules

The skill should never fake ratings, reviews, rankings, indexing status, Lighthouse/PageSpeed scores, Core Web Vitals outcomes, deployment status, or Search Console results. If network access, credentials, dependencies, or quotas are unavailable, the agent should explain the blocker and provide the exact manual command or next step.
