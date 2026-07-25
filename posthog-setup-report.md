# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for the **DevEvent** event discovery platform (Next.js App Router, TypeScript). The integration adds client-side event tracking via `posthog-js`, initialised through a dedicated `PostHogInit` client component mounted in the root layout. Three custom events are captured across user-facing components, with useful metadata properties on each.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" hero button | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks a featured event card (includes slug, title, location, date) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the top navbar (includes nav label) | `components/Navbar.tsx` |

## Files changed

- **`components/PostHogInit.tsx`** *(new)* — Client component that calls `posthog.init()` via `useEffect`. Guards against missing env vars: throws in development, no-ops silently in production.
- **`app/layout.tsx`** — Added `import PostHogInit` and rendered `<PostHogInit />` inside `<body>`.
- **`components/ExploreBtn.tsx`** — Added `posthog.capture("explore_events_clicked")` in the button's `onClick` handler.
- **`components/EventCard.tsx`** — Converted to `"use client"`, added `posthog.capture("event_card_clicked", { event_slug, event_title, event_location, event_date })` in an `onClick` handler on the card link.
- **`components/Navbar.tsx`** — Converted to `"use client"`, added `posthog.capture("nav_link_clicked", { nav_label })` on each nav link.
- **`event-platform/.env.local`** *(new)* — Stores `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Next steps

We've built a dashboard and five insights in PostHog to monitor user behaviour from day one:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/527937/dashboard/1904430)
- **Insight:** [Explore Events clicks (wizard)](https://us.posthog.com/project/527937/insights/xJTEBrKJ)
- **Insight:** [Event card clicks over time (wizard)](https://us.posthog.com/project/527937/insights/tz1Wcqlw)
- **Insight:** [Most clicked events (wizard)](https://us.posthog.com/project/527937/insights/ELNoOkYH)
- **Insight:** [Navigation link clicks by label (wizard)](https://us.posthog.com/project/527937/insights/lGByjP2y)
- **Insight:** [Explore to event click funnel (wizard)](https://us.posthog.com/project/527937/insights/O5TFY9eL)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any team bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_web/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
