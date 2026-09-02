# AI Crawlers, llms.txt, And AI Search Reporting

Use this when a project needs an `llms.txt` file, an AI-crawler access decision in `robots.txt`, or a check on AI-search visibility after launch.

## Contents

- llms.txt
- llms-full.txt
- AI Crawler Access In robots.txt
- Cloudflare's Managed robots.txt And Content Signals
- Chinese AI Platforms And Crawlers
- Verifying A Bot Is Who It Claims
- Notes
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

- **Training crawlers** collect content that may train future models: `GPTBot` (OpenAI), `ClaudeBot` (Anthropic), `CCBot` (Common Crawl), `Amazonbot` (Amazon — "may be used to train Amazon AI models"), `Applebot-Extended` (Apple — opts out of Apple's foundation-model training while ordinary `Applebot` search crawling continues), `Meta-ExternalAgent` (Meta — "training foundation AI models or improving products by indexing content directly"). `Google-Extended` belongs here too, but note its exact scope: it controls use of content for training Gemini models *and* for grounding in Gemini Apps / Vertex AI — it is not a general Google AI switch.
- **Search/citation crawlers** index content so it can be surfaced and cited in AI search: `OAI-SearchBot` (ChatGPT search), `Claude-SearchBot`, `PerplexityBot`, `Amzn-SearchBot` (Amazon/Alexa — Amazon states this one "does not crawl content for generative AI model training").
- **User-initiated fetchers** load a page because a person asked a specific question right now: `ChatGPT-User`, `Claude-User`, `Perplexity-User`, `Amzn-User`, `Meta-ExternalFetcher` (Meta — "may bypass robots.txt rules"). Google runs its own set too — `Google-NotebookLM`, `Google-GeminiNotebook`, `Google-CWS`, `Google-Pinpoint`, `Google-Read-Aloud`, `Google-Site-Verifier` — and states plainly that "because the fetch was requested by a user, these fetchers generally ignore robots.txt rules." OpenAI, Perplexity, and Amazon document the same behaviour for theirs. Listing these agents is fine as a statement of intent, but never rely on a `robots.txt` rule to control them.

Two related tokens that are not AI crawlers at all: `Meta-ExternalAds` crawls for advertising products, not AI training, so grouping it with `Meta-ExternalAgent` is a mistake. `CloudflareBrowserRenderingCrawler`, seen in Cloudflare's managed robots.txt block below, is Cloudflare's own rendering infrastructure, not a third-party AI vendor's bot.

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

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Amzn-SearchBot
Allow: /

# User-initiated agents; these may fetch regardless of robots.txt.
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Amzn-User
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /
```

## Cloudflare's Managed robots.txt And Content Signals

Sites behind Cloudflare may have AI-crawler rules that were never written into the project's own files at all. Cloudflare's managed robots.txt is an opt-in zone setting that injects a block of AI-bot rules at the edge — prepended in front of the origin's own `robots.txt` if one exists, or served alone if it does not. `curl`ing a live `/robots.txt` on such a site shows the combined result, not necessarily anything the site's codebase or CMS contains. Editing the origin project's `robots.txt` file will not remove or change this block; that requires the site owner's Cloudflare dashboard (Bots settings). Check for a comment block starting `# BEGIN Cloudflare Managed content` to recognize it.

The injected block also carries a `Content-Signal` directive — Cloudflare's own Content Signals Policy format for machine-readable AI-use preferences, not a ratified standard. (The IETF does have an AI Preferences working group, `aipref`, working in this space, but Cloudflare's own documentation does not describe Content-Signal as an implementation of it, so do not present the two as the same thing.) For example:

```
Content-Signal: search=yes,ai-train=no,use=reference
```

The defined categories are `search` (search indexing), `ai-input` (real-time use such as grounding or RAG), and `ai-train` (training/fine-tuning); `use` further qualifies how content already permitted may be consumed (`immediate`, `reference`, or `full`). Unlike a plain `Disallow`, this directive is written to double as a formal reservation of rights under Article 4 of the EU Copyright in the Digital Single Market Directive (2019/790) — the legal mechanism for opting out of the EU's text-and-data-mining exception. It is still voluntary as far as crawler compliance goes, exactly like the rest of `robots.txt`, but it carries more legal weight for an EU-facing business than an ordinary comment would. Note this when a client's business operates in or serves the EU.

## Chinese AI Platforms And Crawlers

Relevant when the business serves China, or a market where Chinese assistants and search engines are used. These do **not** work like the vendors above, so do not assume the same `robots.txt` contract applies.

**Read this section as a method, not as a token list.** OpenAI, Anthropic, Google, Perplexity, Amazon, Apple, and Meta each publish a crawler page you can cite. The Chinese platforms have no comparably discoverable first-party documentation, and the bot-directory sites that fill that gap contradict each other. Verify before writing any of these into a client's file.

Reasonably well established:

- `Baiduspider` is Baidu's crawler; its user-agent string self-identifies with a `baidu.com/search/spider.html` URL, and Baidu runs a webmaster platform (ziyuan.baidu.com) with its own sitemap and indexing tools. Baidu also runs suffixed variants (`-image`, `-video`, `-news`, `-mobile`, `-render`). If the audience is in China, this and Baidu's webmaster tools matter far more than any AI-bot rule.
- `Bytespider` is ByteDance's crawler, widely seen in real server logs, and feeds ByteDance AI products. ByteDance states it follows the robots exclusion protocol; reporting and third-party crawler research have repeatedly documented it fetching disallowed paths anyway.
- Other Chinese search crawlers commonly cited include `Sogou web spider`, `360Spider`, `YisouSpider` (Shenma), and `PetalBot` (Huawei). Confirm the exact token against the operator's own webmaster documentation or your own access logs before relying on it — several of these operate multiple named variants.

Not established, and where care is needed:

- For **DeepSeek, Qwen, Kimi, and GLM**, no first-party crawler documentation could be found. Bot-directory sites assert tokens such as `DeepSeekBot`, `QwenBot`, `TongyiBot`, `AliyunBot`, `Qwen-User`, `KimiBot`, and `ChatGLM-Spider`, but these are aggregator claims, they disagree with each other, and none was traceable to a vendor page. DeepSeek's own repository describes collecting data "respecting robots.txt" while publishing no token to target.
- Treat any such name as unverified. Writing an unrecognized user-agent into `robots.txt` is an inert line that reads like protection and provides none. If a client needs these blocked, confirm the string from your own access logs first.

Two practical consequences:

- For blocking: `robots.txt` is not a reliable lever across these platforms. Server, CDN, or WAF rules are the real control, and identifying the traffic usually means rate and behavior analysis rather than a user-agent match.
- For visibility: many Chinese assistants answer using a search backend rather than their own crawler, so being findable in them tracks ordinary indexability in the search engines they ground on — plus crawlable, server-rendered content. There is no allow-rule that buys inclusion.

## Verifying A Bot Is Who It Claims

A user-agent string is self-reported and trivially spoofed, so never treat one as proof. This matters in both directions: unwanted scrapers impersonate reputable crawlers, and a WAF rule keyed on a spoofable string blocks the honest bots while missing the dishonest ones.

Established verification, in order of reliability:

- Reverse DNS lookup on the requesting IP, then a forward lookup to confirm it resolves back — the long-standing method for Googlebot and most major crawlers.
- Published IP range lists. Google publishes JSON range files for its crawlers and user-triggered fetchers; several other operators do the same.
- Behavioural signals (request rate, path patterns) when no token or range list exists — the only option for the Chinese platforms discussed above.

Emerging: **Web Bot Auth**, an IETF draft protocol that has bots cryptographically sign their requests rather than relying on headers and IP addresses. Google is testing it experimentally with some AI agents on its infrastructure and explicitly warns that not every request from a given agent is signed, so fall back to the established methods. Treat it as worth watching, not as something to build a client's access policy on yet.

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
- Search Labs experiments are excluded, and Discover has its own separate report.

Google's help page says the report reached all sites worldwide on August 31, 2026, while a troubleshooting note on the same page still says not all properties have access yet. If a property has no report, the likely causes are that stale rollout gap, too few impressions to show, or the site having excluded itself from AI features. Report it as unavailable rather than reporting zero visibility — absent data is not evidence of no impressions.

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

- Google has addressed `llms.txt` by name, in its AI optimization guide's mythbusting section: "Google Search itself doesn't use them", and maintaining one "will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them." It also says it is "completely fine" to keep one for other services that do use it. So for Google it is neither a win nor a risk. Its value, if any, is with assistants and agent tooling that actually fetch it.
- The same applies to markup generally: "You don't need to create new machine readable files, AI text files, or markup to appear in these features. There's also no special schema.org structured data that you need to add."
- `llms.txt` adoption is still low (roughly one in ten sites in a ~300,000-domain survey, concentrated in tech), and independent tracking has not found a measurable citation-rate lift from adding it. Present it as low-cost, forward-looking hygiene — not a guaranteed AI-visibility win. If a client expects ranking or citation gains from it, correct that expectation.
- Per Google, eligibility for AI Overviews/AI Mode is simply being indexed and eligible to show with a snippet — normal SEO fundamentals, not a separate discipline.
- Structured data must match what is visible on the page — see `references/structured-data.md`. Treat this as a standing rule, not a hedge against a specific predicted AI behavior.
- Do not promise AI Overview inclusion, AI citation, or assistant recommendation as the guaranteed outcome of any single change.
