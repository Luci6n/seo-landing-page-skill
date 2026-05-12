# Build SEO Landing Pages

Build, improve, and audit conversion-focused landing pages with responsive design, SEO/AEO/GEO, structured data, accessibility, performance, deployment, and launch validation.

## Why This Skill Exists

AI agents can build landing pages quickly, but they often miss the parts that matter in real launch work: clear first-view messaging, local business facts, metadata, structured data, site files, performance checks, Search Console steps, and honest post-launch validation.

This repo packages that workflow into one reusable skill so agents can create or improve landing pages with better judgment and fewer missed details.

## What's Inside

This repository currently ships one installable skill:

- `skills/build-seo-landing-page/`

The skill includes:

- `SKILL.md` for trigger metadata and core workflow
- `agents/openai.yaml` for UI-facing skill metadata
- `references/` for landing-page, SEO, local SEO, framework, deployment, and validation guidance
- `templates/` for reusable metadata, sitemap, robots, manifest, and JSON-LD starting points
- `scripts/` for repeatable validation and reporting tasks

## Compatibility

This repo is designed to be useful across multiple coding agents and workflows:

- Codex-style skill installs
- Claude Code plugin and skill workflows
- Community `skills` CLI installs
- Local/manual use as a reference or bundled skill folder

The skill content is framework-friendly rather than framework-specific. It can guide work on:

- static HTML/CSS/JavaScript landing pages
- React or Vite marketing pages
- Next.js marketing sites
- Astro and similar content-first frameworks
- local business websites, service pages, portfolio pages, and SaaS/product landing pages

## Quick Install / Usage

### Option A: `skills` CLI

Install from a repo with the community `skills` CLI:

```bash
npx skills add Luci6n/seo-landing-page-skill -s build-seo-landing-page
```

### Option B: Claude Code plugin marketplace

Add the marketplace repo, then install the bundled plugin:

```bash
/plugin marketplace add Luci6n/seo-landing-page-skill
/plugin install build-seo-landing-page-skills@seo-landing-pages
```

### Option C: Manual install

Copy the skill folder into your agent's skills directory:

```powershell
Copy-Item -Recurse .\skills\build-seo-landing-page "$env:USERPROFILE\.codex\skills\build-seo-landing-page"
```

You can also copy it into another tool's local skills directory if that tool supports `SKILL.md`-style skills.

### Example usage

```text
Use $build-seo-landing-page to audit this landing page for SEO, structured data, performance, and conversion issues.
```

```text
Use $build-seo-landing-page to create a local service landing page for an air conditioning business in Kuala Lumpur.
```

```text
Use $build-seo-landing-page to review this Next.js page before launch and tell me what still needs fixing.
```

Validation helpers are included under `skills/build-seo-landing-page/scripts/` for metadata, structured data, links, site files, placeholders, Lighthouse, PageSpeed, and Search Console workflows.

Optional API-backed checks may use:

- `PAGESPEED_API_KEY`
- `GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN`

If one of these is needed and missing, the agent should ask only when the requested action requires it and use the secret for the current session only by default.

See `SKILL.md` and `CONTRIBUTING.md` for deeper usage and validation details.

## Repo Structure

```text
.
|-- .claude-plugin/
|   |-- marketplace.json
|   `-- plugin.json
|-- skills/
|   `-- build-seo-landing-page/
|       |-- SKILL.md
|       |-- agents/
|       |   `-- openai.yaml
|       |-- references/
|       |-- scripts/
|       `-- templates/
|-- .gitignore
|-- CONTRIBUTING.md
|-- LICENSE
`-- README.md
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the repo workflow, quality bar, and validation expectations.

Good contributions here usually do one of these:

- improve the skill trigger wording or workflow
- add or tighten a reusable validation script
- improve a reference doc without bloating `SKILL.md`
- add a genuinely reusable template
- fix incorrect or outdated SEO/AEO/GEO guidance

## License

This repository is licensed under the [MIT License](./LICENSE).
