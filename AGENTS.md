<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MentorLagbe

Bare App Router UI scaffold: Next.js 16.4.5, React 19, Tailwind v4, shadcn/ui (`base-nova`). No backend, tests, or CI yet.

## Commands

- `npm run dev` — dev server. `next dev` rewrites the auto block above, so keep it in diffs.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run lint` — ESLint 9 flat config. Single file: `npx eslint app/page.tsx`.
- `npm run format` — Prettier for `.ts`/`.tsx` only: no semicolons, double quotes, LF, Tailwind class sorting.
- `npm run build` — production build. There is no test script; don't assume or add a test runner.

Verify with `npm run typecheck && npm run lint` (add `npm run build` for structural changes).

## Layout and conventions

- `app/` is the App Router root; there is no `src/`. Root layout: `app/layout.tsx`.
- `@/*` maps to the repo root: `@/components/ui/button`, `@/lib/utils`.
- Tailwind v4 is CSS-first: no `tailwind.config.*`. Theme tokens live in `app/globals.css` (`@import "tailwindcss"`, `@theme inline`, `:root`/`.dark` variables).
- Add shadcn components with `npx shadcn@latest add <name>`. `components.json` pins `style: base-nova`, RSC, lucide icons, and aliases; generated primitives use `@base-ui/react`, not Radix.
- `cn` comes from the `cn` package (a clsx + tailwind-merge replacement), re-exported by `lib/utils.ts`; generated components may import it from `"cn"` directly. Don't add `clsx`/`tailwind-merge` or a local `cn` implementation.
- Theme uses `next-themes` class strategy. Pressing `d` toggles dark mode (ignored while typing) via `components/theme-provider.tsx`; preserve this when editing providers.
- Use npm (`package-lock.json`). Node 22+ is required by `cn`; the repo currently runs on Node 24.

## Gotchas

- `README.md` has a UTF-16LE tail after UTF-8 content, so readers may reject it as binary. On Windows use `Get-Content README.md -Raw`.
