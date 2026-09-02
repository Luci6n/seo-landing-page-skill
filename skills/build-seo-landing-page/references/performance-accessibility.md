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

## Agent Readability

Accessibility now has a second audience. Browser-based AI agents complete tasks on a user's behalf by reading a page three ways at once: a screenshot interpreted by a vision model, the raw DOM, and the **accessibility tree** — which they treat as the page's semantic map because it strips visual noise down to roles, names, and states.

This matters commercially on a landing page: if an agent cannot identify the call to action, it cannot convert. Google's guidance is that everything making a site agent-ready also makes it better for people, so treat this as a reason to do the fundamentals properly rather than as separate "agent optimization".

The specifics worth applying:

- Use real `<button>` and `<a>` elements for actions and navigation. Agents recognise them. Where a `<div>` or `<span>` is unavoidable, give it the right `role` and a `tabindex`.
- Set `cursor: pointer` on interactive elements; it is a strong actionability signal.
- Link every label to its input with `for`, so the agent can tell what a field is for.
- Keep interactive elements visibly larger than about 8 square pixels, or visual analysis may filter them out.
- Keep layouts stable. An agent working from screenshots is thrown by a CTA that moves position between pages or categories — the same discipline as the CLS rules above, for a different reason.
- Avoid transparent overlays and "ghost" elements over interactive controls. A covered node can be discarded during visual analysis even when it looks transparent.
- Make sure every action a person needs is actually represented in the interface, not implied by hover or gesture alone.

### WebMCP

WebMCP lets a page register its own JavaScript functions or annotated forms as tools an agent can call directly, instead of the agent inferring actions from the DOM and screenshots. It is a Chrome origin trial, so it is experimental, browser-specific, and subject to change.

It is not relevant to most landing pages, and it is not an SEO/AEO/GEO lever — see `references/seo-aeo-geo-checklist.md`. Consider it only when a site has a genuine multi-step task an agent would complete on the user's behalf: a booking flow, a checkout, a filtered product search. A page whose conversion is a phone call, a WhatsApp message, or a short contact form gains nothing from it, because the agent-readability fundamentals above already make that action reachable.

If a site does qualify, treat it as a progressive enhancement layered on working HTML, never as a replacement for it. Chrome notes the API is designed for local browser workflows with a person in the loop, and that complex interfaces may need refactoring to expose clean state.
