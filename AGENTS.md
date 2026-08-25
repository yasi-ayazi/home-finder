# Repository Guidelines

## Project Structure & Module Organization

This is a React 19, TypeScript, and Vite single-page application. Application code lives in `src/`: route-level views are in `src/pages`, reusable UI is grouped by component under `src/components/<ComponentName>/`, and static listing content is in `src/data`. Keep a component's `.tsx` and `.css` files together. Shared global styles belong in `src/index.css` or `src/App.css`. Store imported, bundled assets in `src/assets`; use `public/` for files that must retain a stable URL, such as `/images/property-1.jpg`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts Vite with hot module replacement for local development.
- `npm run build` type-checks with project references and creates the production bundle in `dist/`.
- `npm run lint` runs ESLint across TypeScript and TSX files.
- `npm run preview` serves the built application locally for a production-like check.

Run `npm run lint` and `npm run build` before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript and functional React components. Follow the surrounding files: four-space indentation, double-quoted imports, semicolons, and explicit prop types. Name components and their directories in PascalCase (`PropertyCard/PropertyCard.tsx`), variables and functions in camelCase, and CSS classes with descriptive kebab-case/BEM-style names such as `property-card__image`. Keep page-specific behavior in `src/pages` and extract UI that is reusable or independently styled. ESLint enforces recommended TypeScript, React Hooks, and Vite React Refresh rules; the TypeScript configuration also rejects unused locals and parameters.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. For every change, lint and build the project, then exercise affected routes through `npm run dev`. Verify responsive layout, filter interactions, image loading, routing, and Leaflet map behavior where relevant. If tests are introduced, colocate them as `ComponentName.test.tsx` and add the corresponding test command to `package.json`.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit prefixes such as `feat:` and `refactor:`. Use an imperative, scoped summary—for example, `feat: add price range filter`—and keep each commit focused. Pull requests should explain the user-visible change, list validation performed, and link related issues. Include before/after screenshots for visual changes and call out new dependencies, configuration changes, or known limitations.
