# Download-button before/after — Amp task cmvjoc9di0aou122mfaf8fjfp

All four images captured **22 Oct 2026 (UTC)** of `/download` on branch `daniel/dead-download-fix` (after) and the live site (before).

| File | State | Width x height | Meaning |
|------|-------|----------------|---------|
| before-390px-2026-10-22.png | live site, pre-change | 390 x 6500 | "Download for Desktop" button + "Stay focused with a full learning workspace on your computer" present; button is `href="#"` (dead) |
| after-390px-2026-10-22.png | branch render, post-change | 390 x 3241 | button and promise copy removed; section heading and preview image kept (brief lists headings out of scope) |
| before-desktop-1440px-2026-10-22.png | live site, pre-change | 1440 x 4500 | same dead button visible at desktop width |
| after-desktop-1440px-2026-10-22.png | branch render, post-change | 1440 x 3368 | same fix at desktop width |

Capture method and honest notes:

- Chrome headless, `--screenshot`. Headless enforces a 500 px minimum window, so the **390 px shots render the page inside a 390 px-wide iframe**, then are cropped to exactly 390 px wide (true CSS px, not zoom).
- **After shots are local renders of branch `daniel/dead-download-fix`** (fresh from `origin/dev`, `pnpm dev`) — not the production site; the live page changes only after merge/deploy.
- The dynamically-fetched site footer did not render in any capture (before shots too) — unrelated to this change, identical in both states.
- Store badges render in the black `origin/dev` styling in the after shots vs. white pills on production — a restyle already present on `origin/dev`, unrelated to this task's diff.
- Before shots are trimmed at their fixed capture heights (6500 / 4500, including a white tail); after shots are trimmed to content + 60 px. Content coverage is the same full page in all four.
