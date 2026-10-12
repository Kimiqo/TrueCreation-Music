# TrueCreation website

Marketing website for TrueCreation: stem listening, musical analysis and sound investigation.

## Development

```sh
npm ci
npm run dev
```

## Checks and production build

```sh
npm run lint
npm run build
```

The website uses React, TypeScript, Vite, GSAP and a lazy-loaded Three.js scene. It is independent of the product app and does not require Python.

`public/concept.mp4` is the approved concept video. Private app recordings and captures in `public/local-preview/` are ignored by Git and excluded from production builds. Local demo dialogs use those review assets only in development; production shows a private-walkthrough availability message.

Internal handover documents, local environments, caches, credentials and model weights are excluded.
