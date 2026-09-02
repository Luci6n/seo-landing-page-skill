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
- Favicon and site-name hints. Google Search supports BMP, GIF, ICO, PNG, JPEG, PPM and TIFF — **not SVG** — so a site whose only icon is an SVG gets no favicon in results. Keep a PNG or ICO alongside it. The icon must be square, larger than 48x48px is recommended, its URL should stay stable, and `Googlebot-Image` must be able to crawl it while `Googlebot` can reach the home page. Google uses one favicon per hostname, so a subdirectory cannot have its own.
- Skip legacy `geo.region`/`geo.placename` meta tags as a local signal; Google does not use them (Bing still references them). Visible NAP, `LocalBusiness` schema, and a Google Business Profile are what carry location.

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
- The page answers its main question in the opening lines, before supporting detail.
- Services are explained in plain language.
- Contact, hours, location, and availability are easy to extract.
- Avoid vague marketing-only copy.
- `FAQPage` schema is worth keeping for AI/answer-engine parsing even though it no longer produces a Google rich result (FAQ removed May 7, 2026; HowTo removed 2023) — see `references/ai-crawlers-and-llms-txt.md`.

## GEO

- Clear entity identity.
- Clear relationship between business, services, locations, and contact methods.
- Structured data uses stable IDs and URLs, and matches what is visibly on the page.
- Avoid unsupported claims.
- Avoid fake ratings or reviews.
- Include external profile links with `sameAs` only when official.
- Visible last-updated or freshness signal on content that changes (hours, pricing notes, service list) — AI systems weigh recency when choosing sources to cite.
- AI crawlers (training and citation bots) are not accidentally blocked by `robots.txt` or the CDN/WAF, unless the site owner deliberately chose to block them.
- `llms.txt` exists at the site root with real links, not placeholders.

## What Google Says To Ignore

Google publishes a mythbusting list for AEO/GEO. These are its words on what does **not** help in Google Search, and they override the folk advice circulating online:

- **`llms.txt` and other "special" markup.** "Google Search itself doesn't use them" and maintaining one "will neither harm nor help your site's visibility or rankings in Google Search."
- **Chunking content.** No requirement to break content into small pieces; "there's no ideal page length."
- **Rewriting content just for AI systems.** AI understands synonyms and intent, so chasing long-tail keyword variations is wasted effort.
- **Seeking inauthentic mentions.** Manufactured mentions across the web are not the lever they are sold as.
- **Overfocusing on structured data.** It "isn't required for generative AI search", though it remains worth doing for ordinary rich-result eligibility.

Google also warns to "be wary of third-party tools that promise ranking success or claim to use 'internal' Google metrics", since no third-party tool can see its ranking or AI systems. Quote a tool's number as that tool's estimate, never as Google's.

**WebMCP is not an SEO, AEO, or GEO feature.** It lets a page expose its own functions to a browser agent as callable tools. Both implementers say discovery happens on arrival: Chrome documents that "clients and browsers must visit a site directly to know if it has callable tools", and OpenAI that "the agent can discover them when it visits". Nothing about it is crawl-discoverable, and neither documentation makes any claim about search, ranking, or indexing. It can genuinely improve what an agent accomplishes on a page, which is a conversion benefit worth having — but it will not help anyone find the page. See `references/webmcp.md`.

Do not sell any of the above to a client as an AI-visibility win. The things that do matter are the ordinary ones: crawlable content, useful text, accurate structured data that matches the page, and real business facts.

## AI Crawlers And llms.txt

For AI-crawler `robots.txt` policy, `llms.txt`/`llms-full.txt` structure, and reading the Search Console Generative AI performance report, see `references/ai-crawlers-and-llms-txt.md`.

## Things Not To Overdo

- Do not keyword-stuff.
- Do not create fake location pages.
- Do not add fake review schema.
- Do not use Product schema for services unless real product offer data exists.
- Do not promise ranking or indexing.

