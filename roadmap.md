# Roadmap

## Done
- Hero motion rebuild: single disciplined entrance, messaging/logo/branding unchanged, gimmick overlays removed.
- New logo system in `public/brand/` (mark, lockups, wordmark with the star-dotted "i", favicon).
- Dark "premium" homepage pass (`redesign` branch) — reviewed and rejected as too generic; superseded below.
- **The Declaration** (`declaration` branch) — homepage + Whiteboard rebuilt on one idea: a founder's
  Declaration of Independence. All original copy kept; section order now reads like the document.
  - Paper & Ink system scoped to `.theme-paper` (homepage + Whiteboard), so dark pages are untouched.
    Caslon + Bebas wood type + Mrs Saint Delafield signatures + Courier Prime chart labels.
  - Hero broadside: wood type presses in, "Dream." writes in red ink, the wax seal stamps, the signature signs itself.
  - The Grievances (Why): the three reasons are struck through in red ink, scrubbed to scroll; "Resolved." stamp.
  - The Articles (Services): Articles I–IV with stamped numerals.
  - The Exhibits (What We Build): ink sketches wipe into the real build screenshots on scroll; draggable and
    keyboard-operable. Homepage uses WebP copies in `src/assets/builds/web/` (39–64KB vs 1.3–2MB).
  - The Flight Plan (Process): trajectory plotted in ink on engineering paper, pinned on desktop, stage stamps,
    the star rides the line.
  - The Signatories (Who It's For), "In Witness Whereof" CTA, printer's-colophon footer.
  - Whiteboard → "Sign the Declaration": marker whiteboard, printed form, typed name becomes a signature,
    wax-seal confirmation. Form controls are never hidden by scroll reveals (keyboard-safe).
  - Removed AI-site clichés: custom cursor, magnetic buttons, marquee, dark WebGL hero.
  - Share image redone as a broadside (`public/og.jpg`, 70KB), hosted on our own domain.
  - Verified at 1440px and 458px, with reduced motion; tsc + eslint clean; all routes render.

## Open
- Copy the 252 /250 portraits into `public/` and drop the `/__l5e/*` proxy in `netlify.toml`.
- Bring What We Build, Merch, product, /250 and /rocker onto the Paper & Ink system (still on the dark theme).
- Point freedaim.com's DNS at Netlify once the Netlify build is approved.

## Done — hosting
- Moved to Netlify: builds from this repo on every push; `netlify.toml` holds build, SPA fallback and the
  /250 asset proxy. Builder tooling removed (lovable-tagger, bun lockfiles); fresh npm lockfile + `.npmrc`.
- Whiteboard submissions now save to Netlify Forms (form `whiteboard`), with an error state if a post fails.
- Site weight cut from 11MB to 2MB: unused hero video/poster removed, all build screenshots served as WebP.
