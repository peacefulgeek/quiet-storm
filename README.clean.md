# The Quiet Storm

Evidence-based anxiety guidance through somatic approaches, Vedantic philosophy, and modern neuroscience.

## Stack

- **Frontend:** React 19 + Tailwind CSS 4 + Vite
- **Backend:** Express (Node.js)
- **CDN:** Bunny CDN (images, fonts, email storage)
- **Deploy:** Render Web Service

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Production

```bash
# Standard
NODE_ENV=production node dist/index.js

# With auto-gen cron worker
NODE_ENV=production node scripts/start-with-cron.mjs
```

## Environment Variables (Render Dashboard)

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key for auto-gen pipeline |
| `FAL_KEY` | FAL.ai key for image generation |
| `GH_PAT` | GitHub PAT for auto-gen commits |
| `NODE_ENV` | `production` |

Bunny CDN credentials are in code per spec.

## Content

- 300 articles across 5 categories
- 30 live at launch, 270 drip-scheduled at 5/day
- Auto-gen pipeline (disabled by default): `AUTO_GEN_ENABLED = false`
