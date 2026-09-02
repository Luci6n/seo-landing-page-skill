# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This repo *is* a portable agent skill, not an application. There is no build, lint, or test suite, no `package.json`, and no runtime to start. The deliverable is the content under `skills/build-seo-landing-page/` — a `SKILL.md` plus references, templates, and standalone Node scripts — packaged so it can be installed into Claude Code (as a plugin), Codex, Gemini CLI, or other `SKILL.md`-compatible agents. Changes to this repo are changes to that packaged content, and their effect is judged by how well an agent uses the skill when helping someone build/audit a landing page in some *other* project.

## Repository layout

```
.
|-- .claude-plugin/
|   |-- marketplace.json      # Claude Code plugin marketplace entry (points at "./")
|   `-- plugin.json           # plugin manifest, lists skills/build-seo-landing-page
|-- skills/build-seo-landing-page/
|   |-- SKILL.md              # trigger metadata + core workflow (the skill's entry point)
|   |-- agents/openai.yaml    # UI-facing metadata for Codex-style skill UIs
|   |-- references/           # deep-dive guidance, loaded on demand by SKILL.md
|   |-- scripts/              # standalone Node (.mjs) validation/reporting helpers
|   `-- templates/            # copy-and-adapt starting points (HTML, JSON-LD, config files)
`-- skill-dev-notes/build-seo-landing-page/   # builder-only notes; NOT part of the shipped skill
    |-- AGENTS.md
    |-- BEST_PRACTICES.md
    `-- README.md
```

Two directories look similar (`skills/build-seo-landing-page` vs `skill-dev-notes/build-seo-landing-page`) but serve different purposes: only `skills/` ships to installers. `skill-dev-notes/` holds meta-notes about maintaining the skill and must never be treated as content to install or reference from `SKILL.md`.

## How the skill is structured (`SKILL.md` as router)

`SKILL.md` is intentionally short and acts as a router, not a manual:

- It defines a fixed 8-step **Core Workflow** (inspect project → identify entity/audience/location/goal → detect tech stack → check metadata/structured data/site files → check responsive/a11y/perf → make edits → run validation → summarize).
- It lists **Default Priorities** (visible facts over hidden metadata, `Service` vs `Product` schema choice, NAP consistency for local business, no faked scores/reviews/rankings) that apply regardless of which reference is loaded.
- Each `references/*.md` file is loaded on demand for one concern only — e.g. `structured-data.md` for JSON-LD/rich results, `local-business-seo.md` for NAP/local search, `performance-accessibility.md` for CLS/a11y, `validation-workflow.md` for how to run the scripts and interpret reports.
- `templates/*` are starting points with `{{PLACEHOLDER}}`-style tokens, never final drop-ins — `scripts/check-placeholders.mjs` exists specifically to catch unreplaced placeholders after a template is adapted.

Two template rules that are easy to violate and have both been regressions before:

- **Templates ship to the user's site verbatim.** Never put skill-internal guidance in one — no `references/...` paths, no instructions addressed to the agent. A template carries at most a terse note a site developer would want. Explanation belongs in `references/`. To check, assemble a page from the templates and grep the output.
- **One value per fact.** Do not invent a new placeholder for something that already has a name. `{{PHONE}}` is the readable number for display and schema; `{{PHONE_E164}}` is `tel:` href form only. Duplicate names cause an agent to fill one and miss the other, producing exactly the NAP inconsistency the skill exists to prevent.

When editing the skill, preserve this shape: keep `SKILL.md` a short router, put depth in `references/`, and never duplicate reference content back into `SKILL.md` (see Editing Guidelines in `CONTRIBUTING.md`).

## Scripts (`skills/build-seo-landing-page/scripts/`)

All scripts are dependency-free ESM Node scripts (`#!/usr/bin/env node`, only `node:*` built-ins) invoked directly with `node`, run from the *target project's* root (the site being audited), not from this repo:

```bash
node <path-to-skill>/scripts/check-metadata.mjs [html-file] [--no-write]
node <path-to-skill>/scripts/check-structured-data.mjs [html-file] [--no-write]
node <path-to-skill>/scripts/check-links.mjs [html-file] [--network] [--no-write]
node <path-to-skill>/scripts/check-site-files.mjs [site-root] [--no-write]   # robots/sitemap/manifest/llms.txt/icons
node <path-to-skill>/scripts/check-placeholders.mjs [paths...] [--no-write]
node <path-to-skill>/scripts/run-lighthouse.mjs <url> [mobile|desktop]
node <path-to-skill>/scripts/summarize-lighthouse.mjs [lighthouse-json-report] [--no-write]
node <path-to-skill>/scripts/run-pagespeed.mjs <url> [mobile|desktop]
node <path-to-skill>/scripts/summarize-pagespeed.mjs [pagespeed-json-report] [--no-write]
node <path-to-skill>/scripts/list-search-console-sites.mjs [--no-write]
node <path-to-skill>/scripts/submit-sitemap.mjs <search-console-site-url> <sitemap-url>
node <path-to-skill>/scripts/inspect-url.mjs <inspection-url> <search-console-site-url> [language-code]
```

Notes:
- Running any script with missing/wrong arguments prints its usage text — that's the intended way to check a script's contract instead of reading source first.
- `run-pagespeed.mjs` and the Search Console scripts (`list-search-console-sites.mjs`, `submit-sitemap.mjs`, `inspect-url.mjs`) need `PAGESPEED_API_KEY` / `GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN` respectively. Ask for these only when the requested action actually needs them, and have the user export the value in their own terminal — never ask them to paste it into chat or type it into a command yourself, since scripts read credentials from environment variables only (no prompt, no `--key` flag) and a pasted/inlined key ends up in the transcript and logs. Never write them to `.env`, tracked files, or project config unless explicitly asked.
- Scripts must fail honestly (missing credentials/network/quota/deps) rather than fabricate a passing result — this is a hard rule from `CONTRIBUTING.md`, not just a style preference.
- Reports write to a `reports/` dir under the target project's cwd unless `--no-write` is passed; don't commit generated reports into *this* repo.

## Validating changes to the skill itself

There's no CI/test runner in-repo. Per `CONTRIBUTING.md`, after a meaningful change to the skill, validate with the external skill-creator tool:

```powershell
python C:\Users\User\.codex\skills\.system\skill-creator\scripts\quick_validate.py .\skills\build-seo-landing-page
```

(This script lives outside this repo, in the local Codex skills toolchain — it won't exist on every machine.) If scripts were changed, also syntax-check/run the affected `.mjs` files directly, e.g. `node --check scripts/foo.mjs` and, where feasible, a real invocation against a sample HTML file.

## Content rules the skill must keep enforcing

These are substantive guardrails baked into `SKILL.md`/`CONTRIBUTING.md` — when editing the skill's guidance, don't weaken them:

- Never fabricate ratings, reviews, rankings, indexing status, Core Web Vitals, Lighthouse/PageSpeed scores, deployment status, or AI Overview/AI-citation status.
- Several Google features the skill once recommended are dead and must not be re-added as wins: the FAQ rich result (removed 2026-05-07), HowTo (2023), and the sitelinks search box / `SearchAction` (2024-11-21). The schema types stay valid and useful for AI parsing — only the SERP feature is gone. `references/ai-crawlers-and-llms-txt.md` holds the detail.
- Google AI Overviews and AI Mode are governed by `Googlebot` access plus the Search Console generative AI control, **not** by AI-bot tokens like `GPTBot` or `Google-Extended`. Blocking those does not affect AI Overviews eligibility. Getting this backwards is the single easiest way to give a client false assurance.
- Claims about crawler user agents must trace to the vendor's own documentation. Bot-directory sites invent plausible tokens; an unrecognized user agent in `robots.txt` reads like protection and provides none.
- Prefer `Service` schema for services; only use `Product` schema when real product/offer data exists.
- For local business work, prioritize NAP (name/address/phone) consistency, service area, hours, map/profile links, and real photos over code-only tweaks.
- Domain/deploy changes must cascade to canonical URL, sitemap, robots sitemap URL, structured data URLs, social image URLs, and the Search Console property — treat these as one linked update, not independent edits.
- Avoid layout-shifting entrance animations; prefer opacity-only reveals.
- The skill is framework-agnostic by design (static HTML, React/Vite, Next.js, Astro) — keep references and templates usable across stacks unless a file is intentionally framework-specific.

## Distribution channels

This repo is installed three ways, and a change to `skills/build-seo-landing-page/` should stay valid for all of them: the community `skills` CLI (`npx skills add ...`), the Claude Code plugin marketplace (`.claude-plugin/marketplace.json` + `plugin.json`, both pointing at `./skills/build-seo-landing-page`), and manual copy into another agent's skills directory. Keep the skill folder self-contained (no path assumptions outside itself) so all three keep working.
