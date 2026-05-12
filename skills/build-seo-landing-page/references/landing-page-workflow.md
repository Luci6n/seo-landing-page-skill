# Landing Page Workflow

Use this workflow when creating or improving a landing page.

## Contents

- 1. Understand The Page
- 2. Inspect The Existing Project
- 2A. Choose Or Respect The Project Structure
- 2B. Framework Guidance
- 3. Build The Page Structure
- 4. Add Conversion Paths
- 5. Add SEO/AEO/GEO Signals
- 6. Verify

## 1. Understand The Page

Identify:

- Business or entity name
- Audience
- Primary service or offer
- Location or target market
- Main conversion action
- Trust signals available
- Deployment target

For local businesses, collect:

- Exact business name
- Address
- Phone or WhatsApp
- Opening hours
- Service areas
- Google Maps or Google Business Profile URL
- Real photos, if available
- Supported languages

## 2. Inspect The Existing Project

Check:

- Framework or static structure
- Current HTML head metadata
- Existing components and design style
- CSS variables and responsive patterns
- JavaScript behavior and dependencies
- Asset folder structure
- Sitemap and robots files
- Existing deployment assumptions

## 2A. Choose Or Respect The Project Structure

If the project already exists, keep its established structure unless there is a clear reason to change it.

If creating a new simple static landing page, a practical structure is:

```text
project/
+-- index.html
+-- styles.css
+-- script.js
+-- robots.txt
+-- sitemap.xml
+-- site.webmanifest
+-- favicon.ico
+-- favicon.png
+-- apple-touch-icon.png
+-- assets/
    +-- images/
    +-- brand/
    +-- icons/
```

For a React/Vite landing page:

```text
project/
+-- index.html
+-- package.json
+-- src/
|   +-- App.jsx
|   +-- main.jsx
|   +-- components/
|   +-- data/
|   +-- styles/
+-- public/
    +-- robots.txt
    +-- sitemap.xml
    +-- site.webmanifest
    +-- favicon.ico
    +-- assets/
```

For a Next.js App Router landing page:

```text
project/
+-- app/
|   +-- layout.tsx
|   +-- page.tsx
|   +-- globals.css
|   +-- sitemap.ts
|   +-- robots.ts
+-- components/
+-- public/
    +-- favicon.ico
    +-- apple-touch-icon.png
    +-- assets/
```

For Astro or other content-oriented static frameworks:

```text
project/
+-- src/
|   +-- pages/
|   +-- components/
|   +-- layouts/
|   +-- data/
|   +-- styles/
+-- public/
    +-- robots.txt
    +-- sitemap.xml
    +-- assets/
```

## 2B. Framework Guidance

Frameworks are not bad by default. The right choice depends on the project.

Prefer static HTML/CSS/JS when:

- The page is a small single landing page.
- There is no app state beyond simple interactions.
- The user wants minimal maintenance.
- Performance and deployment simplicity matter most.

Use React/Vite when:

- The project already uses React.
- Components will be reused across pages.
- The page needs richer interactive UI.
- The team is comfortable with a build step.

Use Next.js when:

- The project is already Next.js.
- There are multiple pages, dynamic routes, CMS content, or server-side needs.
- Built-in metadata, sitemap, image, and routing features are useful.

Use Astro when:

- The project is content-heavy but should ship little JavaScript.
- The user wants static output with component authoring.

Regardless of stack:

- Keep critical content crawlable.
- Do not hide important business facts behind client-only rendering.
- Use the framework's native metadata APIs when available.
- Generate or maintain `sitemap.xml` and `robots.txt`.
- Keep JavaScript proportional to the actual experience.

## 3. Build The Page Structure

Recommended sections:

- Hero with business/entity identity and CTA
- Service or offer summary
- Trust or reasons-to-choose section
- Brands/products/service categories, if relevant
- Opening hours or availability
- Location/map/contact section
- FAQ/answers section
- Business facts or summary section
- Footer with repeated NAP details

## 4. Add Conversion Paths

Use clear actions:

- Call
- WhatsApp
- Email
- Book
- Get quote
- Open map
- Copy address

Avoid vague CTAs such as "Learn more" when the user should contact the business.

## 5. Add SEO/AEO/GEO Signals

Include:

- Specific title
- Natural meta description
- Canonical URL
- Open Graph and Twitter metadata
- Favicon and manifest
- Structured data
- FAQ answers
- Visible business facts
- Sitemap and robots

## 6. Verify

Check:

- Mobile layout
- Text overflow
- CTA usability
- Image loading
- Structured data validity
- Lighthouse/PageSpeed where possible
- Search Console after deployment
