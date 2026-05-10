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
    partners: false,
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

## 2) Wedding Event Visibility

Wedding Itinerary event tabs are also configurable from `script.js`:

```js
const itineraryEventVisibilityConfig = Object.freeze({
    "Engagement Ceremony": true,
    "Sangeet Night": true,
    "Haldi Ceremony": true,
    "Wedding Ceremony": true,
    "Reception Evening": true
});
```

Set an event to `false` to hide it from the Wedding Itinerary tab row. The auto-rotating event preview and default selected event automatically use only visible events.

Example:

```js
"Reception Evening": false
```

## 3) Wedding Itinerary Data

Each wedding event is configured in `index.html` on its `.itinerary-item` button. Common fields:

- `data-event` - full event name used by the JS config
- `data-date`, `data-time`, `data-guest-time`
- `data-location`, `data-map-query`
- `data-details`
- `data-cover`
- `data-upload`, `data-rsvp`, `data-guest-list`
- `data-total`, `data-attending`
- `data-program`

Program format:

```html
data-program="category|time|title;category|time|title"
```

Supported categories include `performances`, `games`, and `food`.

## 4) Memory Playback Timing

Default memory card wait times are configured in `script.js`:

```js
const memoryPlaybackDurations = {
    defaultCard: 10000,
    videoCard: 10000
};
```

Values are milliseconds. `10000` means 10 seconds.

Per-card overrides can be added directly in `index.html`:

```html
data-duration="15000"
data-video-duration="25000"
```

## 5) Memory Music

Memory playback music is configured in `script.js`:

```js
const categoryMusicTracks = {
    guy: ["audio/calm.mp3"],
    girl: ["audio/warm.mp3"],
    couple: ["audio/romantic.mp4", "audio/romantic_1.mp3"],
    finale: ["audio/epic.mp3"]
};
```

Notes:

- Cards use `data-person` to choose a category.
- The final memory card uses the `finale` track.
- Milestone cards do not trigger `epic.mp3`.

## 6) Hero Auto Hide

The header hero automatically collapses after 15 seconds to give all tabs more screen space. This is configured in `script.js`:

```js
function setupHeroAutoHide() {
    window.setTimeout(() => {
        document.body.classList.add("hero-auto-hidden");
    }, 15000);
}
```

Change `15000` to adjust the delay.

## 7) Countdown + Share QR Block Placement

The `wish-share-panel` is placed in the Countdown card directly below the wedding counter area (as requested).

It includes:

- QR image (`#wishQrImage`)
- Dynamic wish page link (`#wishPageUrl`)
- Instruction title text

## 8) Dynamic Wish Page URL + QR Generation

In `script.js` (`setupWishShareLink` + `resolveWishPageUrl`):

- `file://` runs resolve to local `./wishes.html`
- GitHub Pages resolves to `/<repo>/wishes.html`
- Localhost/custom domains resolve to `/wishes.html`

QR rendering:

- Primary provider: `api.qrserver.com`
- Fallback provider on error: `quickchart.io`

This improves reliability if one provider is blocked/unavailable.

## 9) Separate Public Wishes Page

A dedicated page for guests:

- `wishes.html`
- Mobile-friendly card layout
- Decorative hero image
- Icon labels for fields
- Animated gradients and floating/glow effects
- Accessible reduced-motion fallback
- Shared favicon via `images/favicon.ico`

## 10) Wishes Submission Logic

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

## 11) Wishes Garden on Main Page

Main-page wishes section includes:

- Dreamy floating bubble rendering
- Pop interaction + pop particle effect
- Open/close wishes garden panel
- Status and counter messaging
- Cycle-based display behavior for many wishes

Note:

- Local bubble display uses browser `localStorage`
- Google Form submission is also sent in parallel from `wishes.html`

## 12) Background Music Playlist

Default background music list:

- `audio/romantic.mp4`
- `audio/romantic_1.mp3`

Behavior:

- Random track selected at setup
- Play/Pause toggle control
- Randomized safe start position within track

## 13) Styling Enhancements Added

- QR share card made compact and more attractive
- QR section animation upgrades:
  - shimmer pass animation
  - subtle float animation
  - hover lift glow
- Wishes page visual overhaul with animated decorative layers

## Local Development

This is a static site, but it should be opened through a local server rather than by double-clicking `index.html`.

Recommended VS Code setup:

1. Install the VS Code extension **Live Server** by Ritwick Dey.
2. Open this repo folder in VS Code.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.

Typical URLs:

- Main page: `http://127.0.0.1:5500/index.html`
- Wishes page: `http://127.0.0.1:5500/wishes.html`

Why Live Server matters:

- YouTube iframe embeds render more reliably.
- Local media/audio behavior is closer to deployment.
- QR URL generation can resolve a real local URL.
- Browser security restrictions are reduced compared with `file://`.

Alternative static server:

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
- Browser autoplay rules can block music until the user clicks a play control.
- YouTube videos and some iframe features may not behave correctly from `file://`; use Live Server.

## Recent Key Files Updated

- `index.html`
- `script.js`
- `style.css`
- `wishes.html`
- `wishes-submit.js`
- `README.md`
