# Home Finder

Home Finder is a small full-stack property-search application for homes in Denmark. It includes a responsive React interface with searching, filtering, sorting, property cards, and a Leaflet map, backed by an Express API that serves property listing data.

## Project structure

```text
home-finder/
├── server/   Express and TypeScript property API
└── ui/       React 19, TypeScript, Vite, and Leaflet frontend
```

The two folders are independent Node.js projects. Install dependencies and run commands inside each folder.

## Requirements

- Node.js 20.19 or newer (Node.js 22.12+ is also supported)
- npm 10 or newer

## Run locally

Open two terminals from the repository root.

Terminal 1 — start the API on `http://localhost:3000`:

```powershell
cd server
npm install
npm run dev
```

Terminal 2 — start the UI on `http://localhost:5173`:

```powershell
cd ui
npm install
npm run dev
```

Then open `http://localhost:5173`. During development, Vite proxies requests under `/api` to the server on port 3000.

## Environment variables

The server supports:

- `PORT`: API port; defaults to `3000`.
- `UI_ORIGIN`: allowed browser origin for cross-origin API requests; defaults to `http://localhost:5173`.

The UI supports:

- `VITE_API_URL`: optional API origin used by production builds, for example `https://api.example.com`. Leave it unset for local development so the Vite proxy is used.

If the deployed UI and API use different origins, set `VITE_API_URL` to the API origin and `UI_ORIGIN` to the UI origin. A same-origin deployment can route `/api` to the server without setting either variable.

## Build and run production locally

Build and start the server:

```powershell
cd server
npm run build
npm start
```

Build and preview the UI:

```powershell
cd ui
npm run build
npm run preview
```

`npm run preview` is intended only for checking the production UI bundle locally. Deploy the contents of `ui/dist` with a static web host for production.

## Validation

Run these checks before submitting changes:

```powershell
cd server
npm run typecheck
npm run build

cd ../ui
npm run lint
npm run build
```

## API

`GET /api/properties` returns all available property listings as JSON.
