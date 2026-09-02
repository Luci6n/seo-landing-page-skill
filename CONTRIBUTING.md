# Contributing

Thanks for contributing. This repo is for a reusable landing-page skill, so changes should make the skill more reliable, more transferable, or easier for agents to use correctly.

## Quick Start

```bash
git clone https://github.com/Luci6n/seo-landing-page-skill.git
cd seo-landing-page-skill
```

Validate the skill after meaningful changes:

```powershell
python C:\Users\User\.codex\skills\.system\skill-creator\scripts\quick_validate.py .\skills\build-seo-landing-page
```

If you changed scripts, also run at least the relevant script checks or usage tests.

## Repository Layout

```text
.
|-- .claude-plugin/
|-- skills/
|   `-- build-seo-landing-page/
|       |-- SKILL.md
|       |-- agents/
|       |-- references/
|       |-- scripts/
|       `-- templates/
|-- CONTRIBUTING.md
`-- README.md
```

## What Goes Where

- Put trigger logic and core workflow in `skills/build-seo-landing-page/SKILL.md`.
- Put detailed guidance in `references/`.
- Put deterministic helpers in `scripts/`.
- Put reusable starting points in `templates/`.
- Keep builder notes, experiments, and non-runtime docs in `skill-dev-notes/`, not inside the shipped skill folder.

## Quality Bar

Contributions should be:

- specific, not vague
- honest, not hypey
- reusable across real landing-page projects
- small enough to maintain
- aligned with real build, launch, and validation workflows

The skill should help agents avoid common mistakes like:

- keyword stuffing
- fake reviews or unsupported claims
- wrong schema type selection
- missing canonical, sitemap, robots, manifest, or favicon wiring
- claiming Lighthouse, PageSpeed, Search Console, or indexing success without evidence
- overengineering simple landing pages

## Editing Guidelines

When updating the skill:

- keep `SKILL.md` concise
- do not duplicate large chunks of reference content into `SKILL.md`
- prefer one-level-deep references from `SKILL.md`
- keep templates generic and clearly adaptable
- only add scripts when they save repeated effort or improve reliability
- preserve cross-framework usefulness unless a file is intentionally framework-specific

## Scripts

If you add or modify a script:

- keep usage text clear
- fail honestly when credentials, network access, quota, or dependencies are missing
- ask for secrets only when the requested action needs them, and have the user export the value in their own terminal rather than paste it into chat
- avoid pretending a remote action succeeded
- keep reports or generated output out of the repo unless they are intentional fixtures

Representative checks are better than no checks. At minimum, syntax-check Node scripts and run the ones affected by your change when possible.

## References And Templates

Good additions include:

- framework-specific implementation guidance that is still concise
- validation workflows that help agents prove outcomes
- templates for common landing-page SEO files or schema blocks
- local business launch guidance that applies across countries, not only one market

Avoid adding:

- generic SEO advice with no actionability
- duplicate files that say the same thing in slightly different words
- giant docs that belong in `skill-dev-notes/` instead of the shipped skill

## Pull Requests

A strong pull request usually includes:

- what changed
- why the change improves the skill
- what files were touched
- how you validated it
- any known limitations or follow-up work

Focused PRs are much easier to review than giant mixed changes.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
