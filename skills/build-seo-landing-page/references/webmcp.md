# WebMCP For Landing Pages

Use this when a project asks about WebMCP, agent-ready pages, or "getting found by AI agents".

## Contents

- What WebMCP Is
- What It Does Not Do
- When It Is Worth Adding
- Declarative API
- Imperative API
- Writing Good Tools
- Security
- Support And Limits
- Ecosystem

## What WebMCP Is

WebMCP lets a page register its own capabilities as structured tools that a browser-based AI agent can call directly, instead of the agent inferring actions from screenshots and the DOM.

Be precise about its status. It is a Draft Community Group Report published by the W3C Web Machine Learning Community Group, edited by engineers from Microsoft and Google, and it states of itself: "This specification was published by the Web Machine Learning Community Group. **It is not a W3C Standard nor is it on the W3C Standards Track.**" Chrome ships it as an origin trial. Do not describe it to a client as a web standard.

Two ways to define tools:

- **Declarative** — annotate an existing HTML form with attributes. No JavaScript.
- **Imperative** — register JavaScript functions with `document.modelContext.registerTool()`.

The agent sees a named list of callable tools with descriptions and a JSON Schema for inputs, rather than guessing which button to click.

## What It Does Not Do

**WebMCP is not an SEO, AEO, or GEO feature, and it does not improve visibility.** Adding it will not affect ranking, indexing, AI Overviews, or citation. This matters because it is being marketed as an AI-visibility play.

The reason is structural, and both implementers say so directly:

- Chrome: "Clients and browsers must visit a site directly to know if it has callable tools." There is no crawl-time signal.
- OpenAI: "The agent can discover them when it visits." A person opens the page in ChatGPT's built-in browser first.

Tools belong to the page that registers them, and navigating away makes them unavailable. So WebMCP affects what an agent can **do once it is already on the page** — it is a conversion and task-completion feature, not a discovery channel. Third-party WebMCP directories exist, but they are unofficial and are not a search surface.

If a client wants to be *found* by AI systems, the levers are the ordinary ones in `references/seo-aeo-geo-checklist.md`. If they want an agent to successfully *act* once it arrives, that is this document plus the agent readability section of `references/performance-accessibility.md`.

## When It Is Worth Adding

Ask what an agent would actually do on the page.

Worth considering:

- A booking, quote, or appointment flow.
- A contact or enquiry form that is the page's conversion action.
- Filtered search over a catalogue, menu, or service list.
- Checkout or cart operations.

Not worth it:

- A page whose conversion is a phone call or WhatsApp link. There is no multi-step task to expose, and a well-marked `tel:` link already works.
- A purely informational page. Readable content and semantic HTML are sufficient.

Always layer it on a working interface. It is a progressive enhancement, never a replacement for HTML that people and non-supporting browsers can use.

## Declarative API

The cheapest entry point for a landing page — but also the least settled part of WebMCP, so weigh that before recommending it. The specification's declarative section currently reads "This section is entirely a TODO", so the behaviour lives in Chrome's implementation and explainer rather than in the spec, and ChatGPT's browser does not support it at all. It degrades harmlessly, since the attributes are ignored where unsupported, but treat the attribute names as liable to change.

Two attributes on a form the site already has:

```html
<form toolname="requestServiceQuote"
      tooldescription="Requests a quote for an air conditioning service."
      action="/enquiry" method="post">
  <label for="name">Your name</label>
  <input id="name" type="text" name="name" />

  <label for="area">Service area</label>
  <select name="area" toolparamdescription="Determines which team handles the job.">
    <option value="Kuala Lumpur">Kuala Lumpur</option>
    <option value="Petaling Jaya">Petaling Jaya</option>
  </select>

  <button type="submit">Request a quote</button>
</form>
```

- `toolname` names the tool; `tooldescription` says what it does.
- Form fields become tool parameters automatically.
- `toolparamdescription` on a field improves accuracy. Without it the browser falls back to the field's `<label>`, then `aria-description` — another reason to label fields properly.
- Removing either `toolname` or `tooldescription` unregisters the tool.
- When called, the browser focuses and fills the form, and it stays visible to the user.

Because parameters come from labels, the accessibility work in `references/performance-accessibility.md` directly improves tool quality.

## Imperative API

For behaviour a form cannot express:

```js
if (typeof document.modelContext?.registerTool === "function") {
  await document.modelContext.registerTool({
    name: "get_opening_hours",
    description: "Returns opening hours for a given day.",
    inputSchema: {
      type: "object",
      properties: { day: { type: "string" } },
      required: ["day"]
    },
    annotations: { readOnlyHint: true },
    execute: async ({ day }) => getHours(day)
  });
}
```

Feature-detect before registering. Pass an `AbortSignal` in the options to unregister later. Reuse the application's existing logic, authentication, and validation rather than writing a parallel path for agents.

## Writing Good Tools

From Chrome's best-practice guidance:

- One function per tool, and avoid overlapping tools — the agent has to pick correctly, and every tool consumes context.
- Prefer static registration; register dynamically only when a tool is genuinely unavailable in the current page state.
- Name tools with verbs that distinguish doing from starting: `create-event` acts immediately, `start-event-creation-process` sends the user to a form.
- Write descriptions in positive terms. "This tool creates a calendar event for a specific date and time" beats "Don't use this for weather" — limits should be implicit in a good description.
- Accept raw user input. Take `"11:00 to 15:00"` as a string rather than asking the model to compute minutes.
- Declare specific parameter types, and prefer meaningful values over opaque IDs: `shipping="Express"`, not `shipping_id=1`.
- Explain *why* a choice exists, so the agent can choose well.
- Validate strictly in code and loosely in schema; schema constraints are not guaranteed. Return descriptive errors so the agent can self-correct.
- Update the interface state once a function completes, since agents read the interface to plan the next step.
- Fail gracefully on rate limits with a meaningful error or a suggestion to continue manually.

## Security

Agents are susceptible to indirect prompt injection, and Chrome is explicit that safety inside an LLM cannot be guaranteed. Treat tools as a public API surface.

- Add `readOnlyHint` to tools that change nothing, so the agent knows when to ask for confirmation.
- Add `untrustedContentHint` to any tool returning user-generated or externally sourced content, marking the payload as needing scrutiny.
- Tools are not visible to other origins by default. `exposedTo` can share them with named origins — only ever origins you would hand the same data or authority to directly.
- Keep the site's own authentication, authorization, and input validation in the execute path. Never trust tool input.
- Respect Chrome's character budgets: 500 per tool description, 150 per parameter description, 30 per tool or parameter name, 1.5K per tool output.

Never expose a destructive or irreversible action as a tool without a confirmation step in the interface.

## Support And Limits

- Chrome origin trial; the API is experimental and subject to change.
- Requires an origin-isolated document. Setting `Origin-Agent-Cluster: ?0` disables WebMCP.
- Gated by a `tools` permissions policy defaulting to `self`, so cross-origin iframes need `allow="tools"`.
- ChatGPT supports it in the desktop app's built-in browser for ChatGPT Work and Codex, but **not the declarative API** and **not tools inside iframes**, so a form-only implementation will not surface there today. Chrome's agent does support declarative tools.
- Designed for local browser workflows with a person in the loop, not headless crawling.

Because support differs per agent and is changing quickly, verify current behaviour before promising a client anything specific.

## Ecosystem

Investment is substantial and worth taking seriously even though the specification is early. In August 2026 OpenAI ran a ten-day WebMCP hackathon with Google Chrome, Cloudflare, Shopify, Vercel, Render, and Netlify, and said support was being added to the ChatGPT desktop app's built-in browser and ChatGPT Sites. Google separately points to emerging agentic-commerce work such as the Universal Commerce Protocol.

Take it seriously as a **capability** bet for sites with real transactional flows. Do not let that momentum get repackaged to a client as a ranking or visibility benefit, because no implementer claims that.
