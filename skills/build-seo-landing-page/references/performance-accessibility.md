# Performance And Accessibility

## Performance

- Keep the site lightweight.
- Avoid heavy frameworks unless needed, but do not treat frameworks as automatically bad.
- Defer non-critical JavaScript.
- Lazy-load non-critical images.
- Use image width and height attributes.
- Use a high-priority hero image only when it is the LCP candidate.
- Avoid excessive third-party scripts.
- Use cache-busting versions for static assets when needed.

Framework notes:

- Static HTML usually has the lowest overhead for simple landing pages.
- React/Vite can be fine when component reuse or richer UI is useful.
- Next.js can be fine when the project benefits from routing, metadata APIs, image tooling, or server features.
- Astro is a good fit for content-first pages that should ship minimal JavaScript.
- Whatever the stack, measure the output instead of assuming it is fast or slow.

## Core Web Vitals

The three metrics and their "good" thresholds, measured at the 75th percentile across mobile and desktop:

- LCP, 2.5s or less: hero image/text loading.
- INP, 200ms or less: expensive JavaScript or slow interactions.
- CLS, 0.1 or less: layout shifts from images, ads, embeds, fonts, and late class changes.

Lab vs field matters when reporting these:

- Lighthouse and PageSpeed lab runs **cannot measure INP** — they load the page without interacting with it. Total Blocking Time is a rough proxy, not a substitute. Never report an INP figure from a Lighthouse run.
- Lab LCP and CLS are estimates from a single simulated run, not the field values Google actually uses.
- Real Core Web Vitals come from field data: CrUX, the PageSpeed "real-world" section, or the Search Console Core Web Vitals report. A new site has no field data yet, and that is not the same as passing.

Report which one a number came from, and do not present a lab score as the site's Core Web Vitals.

## CLS-Safe Motion

Safe:

- opacity fade
- transform on user hover/focus
- fixed-position toast movement

Risky:

- entrance animation that moves document content after first paint
- changing element height automatically on load
- loading images without dimensions
- injecting banners above content

## Accessibility

- Use semantic HTML.
- Use buttons for actions.
- Use links for navigation.
- Keep focus states visible.
- Add skip link.
- Add alt text for meaningful images.
- Use empty alt text for decorative images.
- Keep language attributes accurate.
- Support reduced motion.
- Ensure mobile menu state uses `aria-expanded`.

Accessibility now has a second audience. Google notes that browser-based AI agents inspect a page by analysing its visual rendering, DOM structure, and **accessibility tree** to complete tasks. Semantic HTML, real button and link elements, labelled form fields, and accurate ARIA state therefore make a page legible to agents for the same reasons they make it usable with a screen reader. This is a reason to do accessibility properly, not a separate "agent optimization" task.
