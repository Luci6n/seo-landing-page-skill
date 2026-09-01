# AI Crawlers, llms.txt, And AI Search Reporting

Use this when a project needs an `llms.txt` file, an AI-crawler access decision in `robots.txt`, or a check on AI-search visibility after launch.

## Contents

- llms.txt
- llms-full.txt
- AI Crawler Access In robots.txt
- Chinese AI Platforms And Crawlers
- Google Search Console: Generative AI Performance
- FAQ And HowTo Rich Results Are Deprecated
- Honest Expectations

## llms.txt

`llms.txt` is a community-drafted convention (proposed 2024) published at the site root as `/llms.txt`. Formalization has been discussed — there is an open W3C strategy issue and related IETF crawler work — but as of 2026 nothing is ratified, so treat it as a convention, not a standard. It gives AI agents and assistants a short, curated Markdown map of a site instead of raw HTML. Some coding-agent tools (Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Aider) already fetch `/llms.txt` automatically when pointed at a docs-style site.

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

AI crawlers fall into three groups. Tokens below are as documented by each provider:

- **Training crawlers** collect content that may train future models: `GPTBot` (OpenAI), `ClaudeBot` (Anthropic), `CCBot` (Common Crawl). `Google-Extended` belongs here too, but note its exact scope: it controls use of content for training Gemini models *and* for grounding in Gemini Apps / Vertex AI — it is not a general Google AI switch.
- **Search/citation crawlers** index content so it can be surfaced and cited in AI search: `OAI-SearchBot` (ChatGPT search), `Claude-SearchBot`, `PerplexityBot`.
- **User-initiated fetchers** load a page because a person asked a specific question right now: `ChatGPT-User`, `Claude-User`, `Perplexity-User`. OpenAI and Perplexity both document that these agents may not follow `robots.txt`, since a user — not a crawler — initiated the request. Listing them is still fine as a statement of intent, but do not rely on a `robots.txt` rule to control them.

**Google AI Overviews and AI Mode are not governed by any of these tokens.** They are part of Google Search, so they follow normal `Googlebot` access plus the Search generative AI control in Search Console (see below). Google states explicitly that `Google-Extended` does not affect inclusion in Google Search and is not a ranking signal. Blocking `GPTBot`, `ClaudeBot`, `Google-Extended`, or `CCBot` therefore has no effect on AI Overviews eligibility — it affects model training and assistant answers, not Google's own AI surfaces.

`templates/robots.txt` ships permissive (`Allow: /` for all agents) with no AI-bot rules baked in — add the block below to the project's actual `robots.txt` only after the site owner picks a policy; this is a real exposure decision, not just a code style choice:

- Allow everything: maximum AI visibility, but content may also be used for model training.
- Allow search/citation bots, block training bots: the common 2026 middle path — stay citable in ChatGPT search, Claude, and Perplexity while opting out of training use.
- Block all AI bots: maximum content control, and the site loses eligibility for assistant citations in ChatGPT/Claude/Perplexity. Google AI Overviews and AI Mode are unaffected by this choice — opt out of those separately in Search Console.

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

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# User-initiated agents; these may fetch regardless of robots.txt.
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Perplexity-User
Allow: /
```

## Chinese AI Platforms And Crawlers

Relevant when the business serves China, or a market where Chinese assistants and search engines are used. These do **not** work like the Western four above, so do not assume the same `robots.txt` contract applies.

Chinese search engines publish long-established crawler tokens that generally honor `robots.txt`. If the audience is in China, these matter more than any AI-bot rule:

- `Baiduspider` (Baidu)
- `Sogou web spider` (Sogou)
- `360Spider` (360)
- `YisouSpider` (Shenma)
- `PetalBot` (Huawei Petal Search)

`Bytespider` is ByteDance's crawler and feeds its AI products, including the Doubao assistant. It is real, widely seen in logs, and identifies itself. ByteDance states it follows the robots exclusion protocol, but independent reporting has repeatedly documented it fetching disallowed paths — including a first-half-2026 study finding it reached disallowed pages on close to half the sites naming it. Treat `robots.txt` as a statement of intent here and use server/CDN/WAF rules if the block must actually hold.

For **DeepSeek, Qwen, Kimi, and GLM specifically: no first-party crawler user agent is published** that could be verified against vendor documentation. DeepSeek's own repo describes self-collected data "respecting robots.txt", but it publishes no user-agent token, and its fetches have been reported to look like ordinary browser traffic. Third-party bot directories circulate names like `DeepSeekBot`, `QwenBot`, `KimiBot`, and `ChatGLM-Spider`; these are **not vendor-documented**. Do not add them to a client's `robots.txt` and imply they will work — an unrecognized token is an inert line that creates false confidence.

Two practical consequences:

- For blocking: `robots.txt` is not a reliable lever against these platforms. Server, CDN, or WAF rules are the real control, and identifying the traffic may require rate/behavior analysis rather than a user-agent match.
- For visibility: many Chinese assistants answer using a search backend rather than their own crawler, so being findable in them tracks ordinary indexability in the search engines they ground on — plus crawlable, server-rendered content. There is no allow-rule that buys inclusion.

## Notes

- Major providers say their bots honor `robots.txt`, but this is a courtesy signal, not enforcement. For hard blocking, use server, CDN, or WAF rules.
- A CDN or WAF can silently block AI bots even when `robots.txt` allows them. If AI visibility matters to the business, check CDN/WAF bot-management settings too, not just `robots.txt`.
- Do not add AI-bot rules the user did not ask for or agree to.

## Google Search Console: Generative AI Performance

Search Console has a Generative AI performance report, available worldwide as of August 31, 2026, covering AI Overviews and AI Mode on Search (a separate version covers Discover). Per Google's own help documentation:

- Metric: impressions only — how often a link to the site was shown in a generative AI feature.
- Dimensions: pages (final URL after redirects), countries, dates, devices.
- Not included: clicks, query/prompt text, or ranking position.
- Subject to the standard Search Console 1,000-row limit; the newest data points can be incomplete (shown as dotted lines) until they finalize.

Controls Google documents for its own AI surfaces (these, not the AI-bot tokens above, are what govern AI Overviews and AI Mode):

- `robots.txt` rules for `Googlebot` — blocking Googlebot removes the page from Search entirely, AI features included.
- `noindex` to drop the page from Search.
- `nosnippet`, `data-nosnippet`, and `max-snippet` to limit how much text may be shown — useful when a site wants to stay indexed but restrict how much of its content AI features can quote.
- The Search Console Search generative AI control described below.

Under Settings > Search generative AI, a site can choose Include / Exclude / Inherit for whether its content is eligible for these AI features. Google states this control does not act as a ranking or inclusion signal for the rest of Search — excluding a site from AI features does not change its normal organic ranking, and included content may still be used to help Google understand queries generally.

When reporting AI-search visibility, only state what the report actually shows (impressions by page/country/device/date). Do not claim clicks, ranking, or citation frequency that the report does not provide, and do not claim to have checked this report unless it was actually available and viewed.

## FAQ And HowTo Rich Results Are Deprecated

Google stopped showing the HowTo rich result back in 2023. The FAQ rich result stopped appearing starting May 7, 2026, per Google's own structured-data documentation. `FAQPage` and `HowTo` remain valid schema.org types, and Google has said it still uses structured data to understand pages, but neither produces a Google Search rich snippet anymore.

Because of this:

- Keep `FAQPage` schema when the page has real, visible Q&A — it still helps AI assistants and answer engines parse the content, and Google may still use it for page understanding.
- Do not tell a client that FAQ schema will produce a rich result in Google Search; that feature is gone.
- Do not add `HowTo` schema expecting a rich result.
- The value of good FAQ content now sits in the visible, well-written Q&A itself (for AEO/GEO extraction), not in a schema-driven SERP feature.

## Honest Expectations

- Google's AI-features documentation states directly that no special files or markup are needed: "You don't need to create new machine readable files, AI text files, or markup to appear in these features. There's also no special schema.org structured data that you need to add." An `llms.txt` file does nothing for Google AI Overviews or AI Mode. Its value, if any, is with assistants and agent tooling that actually fetch it.
- `llms.txt` adoption is still low (roughly one in ten sites in a ~300,000-domain survey, concentrated in tech), and independent tracking has not found a measurable citation-rate lift from adding it. Present it as low-cost, forward-looking hygiene — not a guaranteed AI-visibility win. If a client expects ranking or citation gains from it, correct that expectation.
- Per Google, eligibility for AI Overviews/AI Mode is simply being indexed and eligible to show with a snippet — normal SEO fundamentals, not a separate discipline.
- Structured data must match what is visible on the page — see `references/structured-data.md`. Treat this as a standing rule, not a hedge against a specific predicted AI behavior.
- Do not promise AI Overview inclusion, AI citation, or assistant recommendation as the guaranteed outcome of any single change.
