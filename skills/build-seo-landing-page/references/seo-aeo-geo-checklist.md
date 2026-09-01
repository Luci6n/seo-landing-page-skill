# SEO, AEO, And GEO Checklist

SEO improves search crawling and ranking signals.

AEO improves direct-answer readiness for search answer boxes and assistant responses.

GEO improves generative engine understanding of the entity, offer, and facts.

## SEO

- One specific title per page.
- Natural meta description.
- Canonical URL.
- Crawlable important content in HTML.
- One clear H1.
- Logical H2/H3 hierarchy.
- Descriptive internal anchors.
- Sitemap and robots.
- Image alt text and dimensions.
- Social preview metadata.
- Favicon and site-name hints.

## Local SEO

- Exact business name visible.
- Address visible.
- Phone visible and clickable.
- Opening hours visible.
- Service areas visible.
- Map link and/or embedded map.
- LocalBusiness schema.
- Google Business Profile alignment.
- Consistent NAP across profiles and citations.

## AEO

- FAQ questions written like real customer questions.
- Answers are short, direct, and factual.
- A direct 40-60 word answer to the page's main question appears near the top, before supporting detail.
- Services are explained in plain language.
- Contact, hours, location, and availability are easy to extract.
- Avoid vague marketing-only copy.
- `FAQPage` schema is worth keeping for AI/answer-engine parsing even though it no longer produces a Google rich result (deprecated May 2026) — see `references/ai-crawlers-and-llms-txt.md`.

## GEO

- Clear entity identity.
- Clear relationship between business, services, locations, and contact methods.
- Structured data uses stable IDs and URLs, and matches what is visibly on the page (AI systems cross-check schema against live content).
- Avoid unsupported claims.
- Avoid fake ratings or reviews.
- Include external profile links with `sameAs` only when official.
- Visible last-updated or freshness signal on content that changes (hours, pricing notes, service list) — AI systems weigh recency when choosing sources to cite.
- AI crawlers (training and citation bots) are not accidentally blocked by `robots.txt` or the CDN/WAF, unless the site owner deliberately chose to block them.
- `llms.txt` exists at the site root with real links, not placeholders.

## AI Crawlers And llms.txt

For AI-crawler `robots.txt` policy, `llms.txt`/`llms-full.txt` structure, and reading the Search Console Generative AI performance report, see `references/ai-crawlers-and-llms-txt.md`.

## Things Not To Overdo

- Do not keyword-stuff.
- Do not create fake location pages.
- Do not add fake review schema.
- Do not use Product schema for services unless real product offer data exists.
- Do not promise ranking or indexing.

