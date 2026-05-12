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

Watch:

- LCP: hero image/text loading.
- CLS: layout shifts from images, ads, embeds, fonts, and late class changes.
- INP: expensive JavaScript or slow interactions.

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
