# TOVERNET Website Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd tovernet-website
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to http://localhost:3000

## What's Included

### ✅ SEO Optimization
- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for social media sharing
- Twitter Card support
- Semantic HTML structure
- robots.txt for search engine crawling

### ✅ Design Features
- **Magical purplish-blue theme** - TOVERNET brand colors
- **KsięgaI showcase** - Purple/blue gradient with accounting icons
- **Global Pet showcase** - Green gradient with paw prints and transport icons
- Responsive design (mobile-first)
- Smooth animations and hover effects
- Magical glow effects on key elements

### ✅ Sections
1. **Hero Section** - Core positioning and value proposition
2. **What We Architect** - Four key service areas
3. **Live Operating Verticals** - KsięgaI and Global Pet showcases
4. **Why Custom** - Positioning statement
5. **Engagement Model** - 4-step process
6. **Contact Section** - CTA for infrastructure review
7. **Footer** - Links and copyright

## Color Scheme

```css
TOVERNET:    #6b5fff → #8b5cf6 → #a78bfa (purplish-blue)
KsięgaI:     #7c3aed → #8b5cf6 → #a78bfa (purple tones)
Global Pet:  #22c55e → #4ade80 → #86efac (green tones)
```

## Key Features

### Navigation
- Smooth scroll to sections
- Responsive mobile menu (ready for implementation)
- Prominent CTA button

### KsięgaI Vertical (Purple/Blue)
- Calculator and Receipt icons
- "KSeF-Ready Systems" badge
- Link to ksiegai.pl
- Document reconciliation messaging
- Verified business network highlight

### Global Pet Vertical (Green)
- Paw Print, Plane, and Heart icons
- "EU Pet Transport" badge
- "Coming Soon" status
- Multi-jurisdiction compliance messaging
- Licensed operations highlight

## Production Build

```bash
npm run build
npm start
```

## Deployment

The website is ready for deployment to:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

### Environment Variables
None required for basic setup.

## Customization

### Update Contact Email
Edit `app/page.tsx` line 387:
```tsx
href="mailto:contact@tovernet.online"
```

### Update Links
- KsięgaI: Line 245 (currently https://ksiegai.pl)
- Add Global Pet link when ready

### Add Google Analytics
Add to `app/layout.tsx` in the metadata export.

## File Structure

```
tovernet-website/
├── app/
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Homepage with all sections
│   ├── globals.css         # Global styles + custom effects
│   ├── favicon.ico         # Favicon (placeholder)
│   └── robots.txt          # SEO robots file
├── tailwind.config.ts      # Tailwind + custom colors
├── package.json            # Dependencies
└── README.md              # Documentation
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Run dev server**: `npm run dev`
3. **Replace favicon**: Add your TOVERNET logo as favicon.ico
4. **Add images**: Create `/public` folder for any images
5. **Test responsiveness**: Check mobile, tablet, desktop
6. **Deploy**: Push to Vercel or your hosting platform

## SEO Checklist

- ✅ Meta title and description
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Semantic HTML (h1, h2, sections)
- ✅ robots.txt
- ⏳ Sitemap.xml (add when deployed)
- ⏳ Google Search Console verification
- ⏳ Google Analytics (optional)

## Support

For questions or issues, refer to:
- Next.js docs: https://nextjs.org/docs
- Tailwind CSS docs: https://tailwindcss.com/docs
- Lucide icons: https://lucide.dev/icons

---

**Built systems scale. Tools don't.** 🚀
