# Structured Data Guidance

Prefer JSON-LD in the document head.

Structured data should match visible page content. Do not use schema to make claims that the page does not support.

## Contents

- Recommended Types
- Stable IDs
- LocalBusiness Essentials
- Service vs Product
- WebSite Site Name
- FAQPage
- Multilingual Structured Data
- Validation

## Recommended Types

For local business landing pages:

- `LocalBusiness` or a more specific subtype
- `WebSite`
- `FAQPage`
- `OfferCatalog` with `Service` items

For other page types, consider:

- `Organization` for companies without a public local storefront.
- `Person` for personal portfolio pages.
- `Service` for service pages.
- `Product` only for real products with offer data.
- `BreadcrumbList` for multi-page sites with hierarchy.
- `Article` or `BlogPosting` for editorial content.

## Stable IDs

Use stable `@id` values:

```json
"@id": "https://example.com/#business"
```

and:

```json
"@id": "https://example.com/#website"
```

Reference IDs consistently:

```json
"publisher": {
  "@id": "https://example.com/#business"
}
```

## LocalBusiness Essentials

For a local business, include:

- `name`
- `url`
- `logo`
- `image`
- `telephone`
- `address`
- `geo` when a public location exists
- `openingHoursSpecification`
- `areaServed`
- `hasMap`
- `contactPoint`
- `sameAs` for official profiles only

## Service vs Product

Use `Service` for service-like offerings:

- installation
- repair
- servicing
- washing
- consultation
- support

Use `Product` only when the page has real product data, such as:

- price
- availability
- offer URL
- review or aggregate rating if legitimate

Do not add fake reviews or fake aggregate ratings.

## WebSite Site Name

Use `WebSite` schema to suggest a concise site name:

```json
{
  "@type": "WebSite",
  "@id": "https://example.com/#website",
  "name": "Example Brand",
  "alternateName": ["Example"],
  "url": "https://example.com/"
}
```

Google may still choose another site name until it trusts the brand/domain.

Add `SearchAction` only when the website has real site search. For simple one-page landing pages, do not include search action markup.

## FAQPage

Only add FAQ schema when the questions and answers are visible on the page.

Good FAQ answers:

- direct
- factual
- short
- useful before contact

Avoid FAQ schema for content that is not written as real questions and answers.

## Multilingual Structured Data

When the page supports multiple languages:

- Keep entity facts consistent across languages.
- Use language-specific visible copy and metadata.
- Use `inLanguage` where helpful.
- Do not create conflicting names, addresses, or phone numbers unless the business truly has separate entities.

## Validation

Use the local checker first:

```bash
node <skill-dir>/scripts/check-structured-data.mjs index.html
```

For deployed pages, also use:

- Google Rich Results Test
- Schema.org validator
- Search Console enhancement reports

Validation tools can lag behind deployed code. Check the crawl date before assuming the current code is wrong.
