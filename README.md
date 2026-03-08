# Sneha & Subhadip - A Love Written In Time

A romantic single-page wedding and memories site with tabbed sections, interactive itinerary, countdowns, a wishes experience, and a separate public wish-submission page.

## Project Structure

- `index.html` - Main website (tabs, countdown, itinerary, memories, letter, wishes garden, QR section)
- `script.js` - Main behavior (tabs, timers, reveal animations, lightboxes, itinerary, wishes, music, QR/url generation)
- `style.css` - Main styling and animations
- `wishes.html` - Standalone guest wish submission page
- `wishes-submit.js` - Wishes page logic (local save + Google Form background submission)
- `audio/` - Background music tracks
- `images/` - Site images and favicon

## Implemented Features

## 1) Tab System (Single Source Config)

Tabs are controlled from one place in `script.js`:

```js
const tabVisibilityConfig = Object.freeze({
    home: true,
    countdown: true,
    memories: true,
    letter: false
});
```

What this does:

- Shows/hides nav tabs based on config
- Shows/hides matching tab panels
- Prevents hidden tabs from becoming active
- Falls back to first visible tab on initial load

Important CSS safeguard in `style.css`:

```css
.tab-btn[hidden],
.tab-panel[hidden] {
    display: none !important;
}
```

This prevents hidden tabs from reappearing due to `display` rules.

## 2) Countdown + Share QR Block Placement

The `wish-share-panel` is placed in the Countdown card directly below the wedding counter area (as requested).

It includes:

- QR image (`#wishQrImage`)
- Dynamic wish page link (`#wishPageUrl`)
- Instruction title text

## 3) Dynamic Wish Page URL + QR Generation

In `script.js` (`setupWishShareLink` + `resolveWishPageUrl`):

- `file://` runs resolve to local `./wishes.html`
- GitHub Pages resolves to `/<repo>/wishes.html`
- Localhost/custom domains resolve to `/wishes.html`

QR rendering:

- Primary provider: `api.qrserver.com`
- Fallback provider on error: `quickchart.io`

This improves reliability if one provider is blocked/unavailable.

## 4) Separate Public Wishes Page

A dedicated page for guests:

- `wishes.html`
- Mobile-friendly card layout
- Decorative hero image
- Icon labels for fields
- Animated gradients and floating/glow effects
- Accessible reduced-motion fallback
- Shared favicon via `images/favicon.ico`

## 5) Wishes Submission Logic

`wishes-submit.js` handles:

- Input sanitization
- Timestamp formatting in IST
- Local persistence to `localStorage` (`wedding_wishes_v1`)
- Background Google Form submission

### Google Form Backend Mapping

Configured endpoint:

- `https://docs.google.com/forms/d/e/1FAIpQLSfio5R8I7jqTdmQsqLD2_V05ZWoNqmCHZGnFe_jGzXWt6rztw/formResponse`

Mapped fields:

- Name -> `entry.1388511805`
- Wish -> `entry.636900861`

Submission method:

- `fetch(..., { method: "POST", mode: "no-cors" })`
- Keeps UX smooth without redirecting users away from `wishes.html`

## 6) Wishes Garden on Main Page

Main-page wishes section includes:

- Dreamy floating bubble rendering
- Pop interaction + pop particle effect
- Open/close wishes garden panel
- Status and counter messaging
- Cycle-based display behavior for many wishes

Note:

- Local bubble display uses browser `localStorage`
- Google Form submission is also sent in parallel from `wishes.html`

## 7) Background Music Playlist

Music list updated to include all current tracks:

- `audio/romantic.mp4`
- `audio/romantic_1.mp3`

Behavior:

- Random track selected at setup
- Play/Pause toggle control
- Randomized safe start position within track

## 8) Styling Enhancements Added

- QR share card made compact and more attractive
- QR section animation upgrades:
  - shimmer pass animation
  - subtle float animation
  - hover lift glow
- Wishes page visual overhaul with animated decorative layers

## Local Development

This is a static site.

Run with any static server, for example:

```powershell
# From repo root
python -m http.server 5500
```

Then open:

- Main page: `http://localhost:5500/index.html`
- Wishes page: `http://localhost:5500/wishes.html`

## Deployment Notes

For GitHub Pages:

- Keep both `index.html` and `wishes.html` at the published root
- Dynamic QR URL logic will preserve repo path automatically

## Known Behavior Notes

- If browser cache is stale, UI changes may not appear immediately. Use hard refresh (`Ctrl+F5`).
- `no-cors` Google Form requests cannot expose detailed response data to JavaScript, so success is inferred from request completion.

## Recent Key Files Updated

- `index.html`
- `script.js`
- `style.css`
- `wishes.html`
- `wishes-submit.js`
- `README.md`
