# AI Crawlers, llms.txt, And AI Search Reporting

Use this when a project needs an `llms.txt` file, an AI-crawler access decision in `robots.txt`, or a check on AI-search visibility after launch.

## Contents

- llms.txt
- llms-full.txt
- AI Crawler Access In robots.txt
- Google Search Console: Generative AI Performance
- FAQ And HowTo Rich Results Are Deprecated
- Honest Expectations

## llms.txt

`llms.txt` is a community-drafted convention (proposed 2024, still not an official W3C/IETF standard as of 2026), published at the site root as `/llms.txt`. It gives AI agents and assistants a short, curated Markdown map of a site instead of raw HTML. Some coding-agent tools (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Aider) already fetch `/llms.txt` automatically when pointed at a docs-style site.

Format, in order:

- One H1 with the site or project name (the only required section).
- One blockquote with a one- to two-sentence summary.
- Optional short paragraphs or bullets with essential context.
- One or more H2 sections, each a Markdown list of `[Name](URL): one-line description` links to canonical pages.
- An `## Optional` H2 section for secondary links an agent can skip under a tight context budget.

Use `templates/llms.txt` as the starting point. Adapt the sections to the real page set and do not leave placeholder links or invented pages.

For a single-page landing site, keep it short: project/business name, a one-line summary, and links to the page itself plus any real supporting pages (privacy notice, sitemap). Do not fabricate pages that do not exist just to fill sections.

## llms-full.txt

`llms-full.txt` is an optional companion some sites publish alongside `llms.txt`: instead of links, it inlines full canonical content (or a long-form version) in one Markdown document for deeper ingestion. Only add it for content-heavy, multi-page sites (docs, blogs, marketing sites with many pages) where a short link list is not enough. Do not add it for a simple one-page landing site — the page itself is already short enough for an agent to read directly.

## AI Crawler Access In robots.txt

AI crawlers fall into two groups:

- **Training crawlers** collect content to train future models: `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`.
- **Retrieval/citation crawlers** fetch content live to answer a specific prompt or power AI-search citations: `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`.

Ask the business/site owner which policy they want; this is a real exposure decision, not just a code style choice:

- Allow both groups: maximum AI visibility and possible AI-search citations, but content may also be used for model training.
- Allow retrieval/citation bots, block training bots: the common 2026 middle path — stay eligible for AI-search citations while opting out of training use.
- Block all AI bots: maximum content control, but the page becomes ineligible for AI Overviews, AI Mode, and assistant citations.

Example `robots.txt` block for the "allow citations, block training" policy:

```
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /
```

Notes:

- Major providers say their bots honor `robots.txt`, but this is a courtesy signal, not enforcement. For hard blocking, use server, CDN, or WAF rules.
- A CDN or WAF can silently block AI bots even when `robots.txt` allows them. If AI visibility matters to the business, check CDN/WAF bot-management settings too, not just `robots.txt`.
- Do not add AI-bot rules the user did not ask for or agree to.

## Google Search Console: Generative AI Performance

Search Console added a dedicated Generative AI performance report (rolling out from mid-2026) showing impressions across AI Overviews, AI Mode, and AI features in Discover, broken down by page, country, device, and date. There is also a site-level opt-out toggle to exclude a property from AI features without affecting normal organic ranking.

Known limits as of this writing:

- No click-through data.
- No prompt-level query data.
- No position/ranking data.

When reporting AI-search visibility, only state what the report actually shows (impressions, pages, countries, dates). Do not claim clicks, ranking, or citation frequency that the report does not provide, and do not claim to have checked this report unless it was actually available and viewed.

## FAQ And HowTo Rich Results Are Deprecated

Google removed the FAQ rich result from Search (May 2026) and no longer supports the HowTo rich result. `FAQPage` and `HowTo` remain valid schema.org types, and Google has said it still uses structured data to understand pages, but neither produces a Google Search rich snippet anymore.

Because of this:

- Keep `FAQPage` schema when the page has real, visible Q&A — it still helps AI assistants and answer engines parse the content, and Google may still use it for page understanding.
- Do not tell a client that FAQ schema will produce a rich result in Google Search; that feature is gone.
- Do not add `HowTo` schema expecting a rich result.
- The value of good FAQ content now sits in the visible, well-written Q&A itself (for AEO/GEO extraction), not in a schema-driven SERP feature.

## Honest Expectations

- `llms.txt` adoption is still low (roughly one in ten sites as of early 2026), and independent tracking has not found a measurable citation-rate lift from adding it. Present it as low-cost, forward-looking hygiene — not a guaranteed AI-visibility win.
- No special schema markup is required for AI Overviews or AI Mode; schema helps trust and understanding, not eligibility by itself.
- AI systems increasingly cross-check schema claims against live page content, so schema that drifts from what is visible on the page is a liability, not a shortcut.
- Do not promise AI Overview inclusion, AI citation, or assistant recommendation as the guaranteed outcome of any single change.
