# tovernet-nest Agent Guide

## Application Overview

**Name**: tovernet-nest (Tovernet Website)  
**URL**: `tovernet.online`  
**Tech Stack**: Next.js 14 (App Router) + TypeScript + next-intl  
**Purpose**: Public website for Tovernet company

**User Personas**:
- Prospective clients researching Tovernet services
- General public seeking company information
- International visitors (multi-language support)

---

## Critical Context

### This App is Authoritative For:
- ✅ Tovernet brand presence
- ✅ Public-facing company information
- ✅ Service descriptions and offerings
- ✅ Lead generation and contact forms
- ✅ Multi-language content (internationalization)

### Non-Negotiables:
- **SEO Optimized**: Every page must rank well
- **Performance**: Fast load times, static generation
- **Internationalization**: Support multiple languages via next-intl
- **Mobile-First**: Responsive design priority

---

## Project Structure

```
tovernet-nest/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   └── [locale]/                  # Internationalized routes (if using)
├── components/                    # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── public/                        # Static assets
│   ├── images/
│   └── ...
├── messages/                      # i18n translations (next-intl)
│   ├── en.json
│   ├── pl.json
│   └── ...
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## Routing Architecture

### Next.js App Router

**Pattern**: File-system based routing in `app/` directory

**Basic Structure**:
```
app/
├── page.tsx              → /
├── layout.tsx            → Root layout
├── about/page.tsx        → /about
├── services/page.tsx     → /services
└── contact/page.tsx      → /contact
```

### Internationalization (next-intl)

**Pattern**: Locale-based routing

```
app/
├── [locale]/
│   ├── layout.tsx        → Locale-specific layout
│   ├── page.tsx          → / (with locale)
│   └── about/page.tsx    → /[locale]/about
```

**Supported Locales**: Configured in `next.config.js`

**Usage**:
```typescript
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('HomePage');
  
  return (
    <h1>{t('title')}</h1>
  );
}
```

**Translation Files**: `messages/en.json`, `messages/pl.json`

```json
{
  "HomePage": {
    "title": "Welcome to Tovernet",
    "description": "Professional services..."
  }
}
```

---

## SEO Optimization

### Metadata Configuration

**Root Layout** (`app/layout.tsx`):
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tovernet - Professional Business Services',
  description: 'Expert services for your business...',
  keywords: 'business services, consulting, automation',
  openGraph: {
    title: 'Tovernet',
    description: '...',
    url: 'https://tovernet.online',
    siteName: 'Tovernet',
    images: [{ url: '/og-image.png' }],
  },
};
```

### Static Generation

**All pages statically generated** at build time:
- No runtime data fetching for content
- Fast page loads
- SEO-friendly

---

## Common Tasks

### Adding a New Page

1. Create `app/new-page/page.tsx`
2. Add metadata export
3. Implement page component
4. Add translations if using i18n

**Example**:
```typescript
// app/services/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - Tovernet',
  description: 'Our professional services...',
};

export default function ServicesPage() {
  return (
    <div>
      <h1>Our Services</h1>
      {/* Content */}
    </div>
  );
}
```

### Adding Translations

1. Add keys to `messages/en.json` and `messages/pl.json`
2. Use `useTranslations` hook in component
3. Reference translation keys

**Example**:
```json
// messages/en.json
{
  "Services": {
    "title": "Our Services",
    "description": "We offer..."
  }
}
```

```typescript
// Component
const t = useTranslations('Services');
<h1>{t('title')}</h1>
```

---

## Development Workflow

### Local Development

```bash
npm run dev  # Start Next.js dev server on http://localhost:3000
```

### Build

```bash
npm run build  # Production build
npm run start  # Start production server
```

---

## Integration Points

### With CRM (crm-tover)

**Lead Generation**:
- Contact forms submit to CRM
- Lead tracking
- No direct integration (API endpoint or form service)

### With Main Apps

**Minimal Integration**:
- Standalone website
- Links to app.ksiegai.pl or crm.tovernet.online
- No shared authentication

---

## Quick Reference

### Key Files
- **Root Layout**: `app/layout.tsx`
- **Homepage**: `app/page.tsx`
- **Translations**: `messages/*.json`

### Key Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Lint code
```

### Tech Stack
- **Framework**: Next.js 14
- **i18n**: next-intl
- **Styling**: Tailwind CSS (assumed)

---

**For system-wide architecture, see `@/ARCHITECTURE_OVERVIEW.md`**  
**For workspace rules, see `@/RULES.md`**
