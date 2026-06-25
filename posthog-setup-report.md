<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the TOVERNET landing page. The project is a static-export Next.js 14.2.18 App Router site with i18n support (EN/PL). Since the site uses `output: "export"`, all tracking is client-side only — no server-side events or reverse proxy rewrites were added. PostHog is initialised via a `PostHogProvider` client component wrapped around the locale layout. Key CTA and link interactions are tracked through a `TrackedAnchor` client component that wraps HTML anchor elements in the server-component page. Language switching is tracked directly in the existing `LanguageSwitcher` client component.

**Files created:**
- `components/PostHogProvider.tsx` — initialises `posthog-js` client-side with session recording and error tracking
- `components/TrackedAnchor.tsx` — minimal client wrapper for tracked `<a>` elements

**Files modified:**
- `app/[locale]/layout.tsx` — wrapped children with `PostHogProvider`
- `app/[locale]/page.tsx` — replaced 7 key anchor tags with `TrackedAnchor` components
- `components/LanguageSwitcher.tsx` — added `posthog.capture('language_switched', ...)` call
- `.env.local` — added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks the primary 'Get in Touch' CTA button in the hero section. | `app/[locale]/page.tsx` |
| `hero_secondary_cta_clicked` | User clicks the secondary 'See Our Products' CTA button in the hero section. | `app/[locale]/page.tsx` |
| `nav_contact_clicked` | User clicks the contact button in the navigation bar. | `app/[locale]/page.tsx` |
| `ksiegai_cta_clicked` | User clicks the KsięgaI product CTA to visit the external KsięgaI website. | `app/[locale]/page.tsx` |
| `contact_email_clicked` | User clicks the email contact link in the main contact section. | `app/[locale]/page.tsx` |
| `footer_email_clicked` | User clicks the email link in the footer. | `app/[locale]/page.tsx` |
| `footer_ksiegai_clicked` | User clicks the KsięgaI link in the footer. | `app/[locale]/page.tsx` |
| `language_switched` | User switches the interface language between English and Polish. | `components/LanguageSwitcher.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://eu.posthog.com/project/209811/dashboard/774365)
- **Contact CTA Clicks**: [HR4nrsND](https://eu.posthog.com/project/209811/insights/HR4nrsND) — daily trend of hero and nav contact CTA clicks
- **KsięgaI Product Interest**: [ka0hrytc](https://eu.posthog.com/project/209811/insights/ka0hrytc) — clicks on the KsięgaI product card CTA
- **Language Switching**: [8Tw9MKIk](https://eu.posthog.com/project/209811/insights/8Tw9MKIk) — language switch events broken down by target locale
- **Email Contact Clicks Total**: [Tba286sR](https://eu.posthog.com/project/209811/insights/Tba286sR) — stacked bar of contact section + footer email clicks
- **All CTA Events Comparison**: [dUpyiKb6](https://eu.posthog.com/project/209811/insights/dUpyiKb6) — bar chart comparing all tracked CTAs side-by-side

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/CD secrets so collaborators and deployment pipelines know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
