# freedaim

Turn ideas into reality — strategy, branding, websites, AI systems, and automation.

The site is "The Declaration": a founder's Declaration of Independence rendered in
paper and ink. See `roadmap.md` for what's built and what's open.

## Local development

```sh
npm install
npm run dev      # http://127.0.0.1:8080
npm run build    # production build → dist/
```

Built with Vite, React, TypeScript, Tailwind CSS, GSAP + Lenis, and rough.js.

## Deploys (Netlify)

Every push to this repo's production branch deploys automatically; pull requests
get deploy previews. Settings live in `netlify.toml`.

- **Whiteboard submissions** use Netlify Forms (form name `whiteboard`, declared
  statically in `index.html`). They appear in the Netlify dashboard under
  **Forms**; turn on email notifications there to get each idea in your inbox.
- **/250 portraits** are proxied from the previous host via a rewrite in
  `netlify.toml`. Copy them into `public/` before that host is retired.
- **Shop** pages call the Shopify Storefront API from the browser
  (`src/lib/shopify.ts`), so they work on any host.

## Where things live

- Copy and sections: `src/components/*Section.tsx`, `src/pages/`
- Declaration system (ink motion, wax seal, sketches): `src/components/declaration/`
- Design tokens: `src/index.css` (`.theme-paper`) and `tailwind.config.ts`
- Logo files: `public/brand/`
