---
name: build-seo-landing-page
description: Builds, improves, and audits landing pages with conversion-focused design, responsive UX, SEO/AEO/GEO, structured data, accessibility, performance, deployment, and launch validation. Use for creating, redesigning, launching, or auditing landing pages, service pages, local business sites, portfolios, SaaS/product pages, static sites, React/Next.js pages, or other marketing pages. Do not use for tiny copy or style edits unless SEO, conversion, or launch readiness matters.
---

# Building SEO Landing Pages

Use this skill to create, improve, audit, deploy, or validate landing pages.

Do not use this skill for tiny copy, style, or component edits unless SEO, conversion, accessibility, performance, deployment, or launch readiness is part of the request.

## Core Workflow

1. Inspect the existing project before editing.
2. Identify the business/entity, audience, location, services, conversion goal, and deployment target.
3. Identify the technology stack and preserve its conventions.
4. Check metadata, headings, structured data, sitemap, robots (including AI-crawler access), `llms.txt`, favicon, manifest, social previews, and visible business facts.
5. Review responsive layout, accessibility, image sizing, JavaScript loading, and CLS risks.
6. Make concrete file changes using the existing project style.
7. Run available validation tools or provide exact commands if blocked.
8. Summarize changes, verification, remaining risks, and post-launch steps.

## Default Priorities

- Make the first viewport clear: entity, offer, location or audience, and primary CTA.
- Keep important facts visible in HTML, not only metadata or JSON-LD.
- Prefer `Service` schema for services; use `Product` schema only with real product offer data.
- For local businesses, prioritize NAP consistency, service areas, opening hours, map/profile links, reviews, and real photos.
- Treat custom domain, Google Business Profile, reviews, citations, Search Console, and real photos as launch/off-site work, not just code tweaks.
- After domain or deploy changes, update canonical, sitemap, robots sitemap URL, structured data URLs, social image URLs, and Search Console property.
- Do not fake ratings, reviews, guarantees, rankings, indexing, Core Web Vitals, Lighthouse/PageSpeed scores, deployment status, AI Overview/AI citation status, or API results.
- FAQ and HowTo schema no longer produce Google rich results (FAQ removed May 7, 2026; HowTo removed 2023); keep `FAQPage` schema for AI/answer-engine understanding, not for a promised SERP feature.
- Ask the site owner before changing AI-bot access in `robots.txt`; it changes real exposure to assistant citations and model training. Note that Google AI Overviews/AI Mode are governed by normal `Googlebot` access and Search Console controls, not by AI-bot tokens.
- `llms.txt` is optional hygiene with no proven ranking or citation lift, and Google states it is not needed for AI features; offer it, do not sell it as an AI-visibility win.
- Match the design to the page type and audience; prioritize clarity, trust, mobile usability, and conversion over decoration.

## When To Read References

- For build flow and page structure, read `references/landing-page-workflow.md`.
- For framework-specific implementation details, read `references/framework-implementation.md`.
- For landing page copy, CTAs, and trust signals, read `references/content-conversion.md`.
- For SEO, AEO, GEO, and local search checks, read `references/seo-aeo-geo-checklist.md`.
- For local business websites, read `references/local-business-seo.md`.
- For JSON-LD and rich-result concerns, read `references/structured-data.md`.
- For performance, accessibility, and CLS work, read `references/performance-accessibility.md`.
- For validation scripts, Lighthouse/PageSpeed, Search Console, and reporting, read `references/validation-workflow.md`.
- For deployment, domains, Search Console, and Google Business Profile, read `references/deployment-domain-search-console.md`.
- For `llms.txt`, AI-crawler access, and AI-search reporting, read `references/ai-crawlers-and-llms-txt.md`.
- For WebMCP, agent-callable tools, and agent-ready forms, read `references/webmcp.md`.

## Templates

Use templates only as starting points. Adapt them to the project before inserting:

- `templates/metadata-head.html`
- `templates/site.webmanifest`
- `templates/robots.txt`
- `templates/sitemap.xml`
- `templates/local-business-jsonld.html`
- `templates/website-jsonld.html`
- `templates/website-with-search-jsonld.html` - legacy; its `SearchAction` no longer produces a Google feature
- `templates/organization-jsonld.html`
- `templates/person-jsonld.html`
- `templates/breadcrumb-jsonld.html`
- `templates/faq-jsonld.html`
- `templates/service-offer-catalog-jsonld.html`
- `templates/static-landing-page.html`
- `templates/launch-checklist.md`
- `templates/privacy-notice.md`
- `templates/llms.txt`

## Scripts

Scripts are optional helpers. Run them from the target project root when the environment allows it:

- `scripts/check-metadata.mjs [html-file] [--no-write]` - static metadata, headings, image, favicon, manifest, and basic SEO checks.
- `scripts/check-structured-data.mjs [html-file] [--no-write]` - JSON-LD parse and schema sanity checks.
- `scripts/check-links.mjs [html-file] [--network] [--no-write]` - local links, fragments, assets, and optional external URL checks.
- `scripts/check-site-files.mjs [site-root] [--no-write]` - `robots.txt`, `sitemap.xml`, `site.webmanifest`, `llms.txt`, and common icon checks; pass `public` for framework public folders.
- `scripts/check-placeholders.mjs [paths...] [--no-write]` - unreplaced `{{PLACEHOLDER}}` checks after templates are applied.
- `scripts/run-lighthouse.mjs <url> [mobile|desktop]` - Lighthouse JSON report.
- `scripts/summarize-lighthouse.mjs [lighthouse-json-report] [--no-write]` - Markdown summary from a Lighthouse report.
- `scripts/run-pagespeed.mjs <url> [mobile|desktop]` - PageSpeed Insights JSON report.
- `scripts/summarize-pagespeed.mjs [pagespeed-json-report] [--no-write]` - Markdown summary from a PageSpeed report.
- `scripts/list-search-console-sites.mjs [--no-write]` - list verified Search Console properties.
- `scripts/submit-sitemap.mjs <search-console-site-url> <sitemap-url>` - submit a sitemap through Search Console API.
- `scripts/inspect-url.mjs <inspection-url> <search-console-site-url> [language-code]` - inspect URL indexing data through Search Console API.

Use `PAGESPEED_API_KEY` for PageSpeed API calls when available.

Use `GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN` only for supported Search Console API actions.

If a requested API-backed action needs credentials and the environment variable is missing, ask the user to export it in their own terminal. Do not ask them to paste the secret into the conversation, and never type a key into a command yourself: a pasted or inlined key lands in the transcript and logs, while an exported variable is inherited by these scripts without ever entering the conversation. `references/validation-workflow.md` has the per-shell commands.

Do not write secrets to `.env`, tracked files, or project config unless the user explicitly asks for that.

If credentials, network, dependencies, or quota are unavailable, do not fake success. Explain the blocker and provide manual steps or fallback commands.

When unsure about usage, run the script with missing arguments to see its usage text or read `references/validation-workflow.md`.

## Rules

- Prefer concrete file edits over generic advice.
- Preserve existing project conventions.
- Ask for credentials only when the requested action needs them, and have the user export them rather than paste them.
- Do not keyword-stuff.
- Do not add fake ratings, fake reviews, or unsupported claims.
- Do not promise ranking, indexing, or Core Web Vitals outcomes.
- Avoid layout-moving entrance animations. Prefer opacity-only reveals when animation is needed.
- Frameworks are not bad by default. Use static HTML for simple sites, and use React, Next.js, Astro, or similar frameworks when the project already uses them or needs their features.
- For local businesses, prioritize exact business name, NAP consistency, service area, opening hours, map link, Google Business Profile or the local equivalent, reviews, and custom-domain guidance.
