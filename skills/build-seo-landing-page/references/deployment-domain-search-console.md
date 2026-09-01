# Deployment, Domain, And Search Console

## Deployment Options

- Cloudflare Pages: static sites, Git deploy, SSL, custom domains.
- Netlify: static sites, forms, previews.
- Vercel: framework apps, especially Next.js.
- GitHub Pages: simple static sites.
- Shared hosting/cPanel: useful when the business already owns hosting/email there.

Framework-aware guidance:

- Static HTML/CSS/JS: Cloudflare Pages, Netlify, GitHub Pages, Vercel, or shared hosting can all work.
- React/Vite: Cloudflare Pages, Netlify, or Vercel are usually straightforward.
- Next.js: Vercel is the smoothest default, but Cloudflare Pages, Netlify, and other platforms can work depending on features used.
- Astro: Cloudflare Pages, Netlify, and Vercel are good fits for static output.
- WordPress or CMS sites: use the CMS host or a managed provider that supports the required plugins, backups, and updates.

## Domain Questions

Ask:

- Do you already own a domain?
- What market should the domain signal?
- Is this a business, personal brand, SaaS, or content site?
- Do you need domain email?
- Do you prefer brand name, service keyword, or location in the domain?
- Does the business need a country-code domain for local trust?
- Are there country-specific eligibility rules for the desired extension?

## Domain Extension Guidance

Do not assume every user should use `.my` or `.com.my`. Choose based on market, trust, and availability.

General guidance:

- `.com`: broad commercial trust and good for global or regional sites.
- Country-code domains such as `.my`, `.sg`, `.id`, `.au`, `.uk`, `.ca`, or `.de`: useful when the business mainly serves that country.
- Second-level country domains such as `.com.my`, `.com.sg`, `.co.uk`, or `.com.au`: can feel more formal or business-oriented in some markets.
- `.org`: nonprofit or community-oriented.
- `.io`, `.ai`, `.dev`, `.app`: useful for tech products when they match the brand and audience.
- Service/location domains can be clear, but exact brand domains are usually cleaner long term.

Ask the user before recommending a specific domain extension.

Examples:

- For a Malaysian local business, `.com.my` may be a strong fit.
- For a Singapore business, `.com.sg` or `.sg` may be a stronger local signal.
- For a global SaaS, `.com` may be preferable.

## Domain Launch Checklist

- Add domain to host.
- Configure DNS.
- Wait for SSL.
- Update canonical.
- Update sitemap.
- Update robots sitemap URL.
- Update structured data URLs.
- Update Open Graph/Twitter image URLs.
- Update `llms.txt` links to the new domain.
- Decide and configure AI-crawler access in `robots.txt` (see `references/ai-crawlers-and-llms-txt.md`).
- Add Search Console property.
- Submit sitemap.
- Add website to Google Business Profile.

## Search Console

Scripts can:

- list verified properties
- submit sitemap
- inspect indexed URL status
- fetch search performance data

Scripts should not claim:

- guaranteed indexing
- guaranteed ranking
- automatic request indexing for normal landing pages

For ordinary pages, the safe flow is:

1. Submit sitemap.
2. Inspect URL.
3. Tell the user if manual URL Inspection / Request Indexing is recommended.

## Generative AI Performance Report

Search Console has a Generative AI performance report (worldwide as of August 31, 2026) covering AI Overviews and AI Mode impressions by page/country/device/date, plus a Settings > Search generative AI include/exclude control that does not affect normal organic ranking. It has no click, prompt-level, or ranking data. Only report what this view actually shows; see `references/ai-crawlers-and-llms-txt.md` for detail and honesty limits.
