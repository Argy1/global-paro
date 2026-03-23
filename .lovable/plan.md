

## Plan: Fix Mobile/Tablet Responsiveness for 3 Pages

### Page 1 — Mission (`src/pages/AboutMission.tsx`)

**Problem:** The `mission-cards.png` is a wide landscape image — on mobile it renders at full width but is very short/small because `object-contain` shrinks it to fit the natural aspect ratio. It needs a minimum height so the cards are readable.

**Fix:**
- Add `style={{ minHeight: "200px" }}` on mobile and use responsive min-height with clamp
- Wrap the image in a container div with `min-h-[220px] sm:min-h-[300px]` so the image always renders tall enough to be legible
- The image will auto-scale upward on larger screens

---

### Page 2 — Homepage Hero (`src/pages/Index.tsx`)

**Problem:** Buttons at hardcoded `left: "33%"` — on mobile the banner image content is centered/full-bleed so this offset is wrong. The buttons end up in an awkward position.

**Fix:**
- On mobile (`< md`): center the buttons horizontally at the bottom, `justify-center left-0 right-0`
- On desktop (`md+`): keep `left: 33%` to align under the "Global PARO" text in the banner
- Use a CSS approach with a responsive wrapper class + inline style only for desktop:

```text
Mobile:  absolute bottom-6 left-0 right-0  →  flex justify-center gap-4
Desktop: absolute bottom-8 left-[33%]       →  flex gap-4
```

This is achieved with `className="absolute bottom-6 md:bottom-8 left-0 right-0 md:left-[33%] md:right-auto flex justify-center md:justify-start gap-4 px-4"`

---

### Page 3 — Batch Program (`src/pages/programs/BatchProgram.tsx`)

**Problem:** The hero section uses `position: absolute` for the nurse image which fills `w-full lg:w-1/2`. On mobile this means the image is hidden behind the full-width white card. Also the "50 NURSES ONLY" red ribbon is placed at a fixed offset that cuts into the card title on mobile.

**Fix:** Switch to a **stacked layout on mobile, split panel on desktop**:

```text
Mobile layout:
┌──────────────────────────┐
│  nurse image (top, 220px)│  ← standard img, not absolute
│  with teal gradient over │
├──────────────────────────┤
│  white info card (below) │  ← normal flow, no overlap
└──────────────────────────┘

Desktop layout (lg+):
┌─────────────────┬────────────────┐
│  nurse image    │  white card    │  ← absolute bg + card on right
│  (absolute bg)  │                │
└─────────────────┴────────────────┘
```

Implementation:
- Hide the absolute nurse image on mobile (`hidden lg:block`)
- Add a new mobile-only `<div>` with the nurse image as a standard `<img>` with `h-56 object-cover` and teal gradient overlay
- On mobile, position the ribbon outside/above the card so it doesn't overlap the "Nurse in Singapore" title — move it to top of the card section, or shrink it
- Remove `justify-end` from the card container on mobile so the card fills the full screen width naturally

---

### Files to Edit

1. `src/pages/AboutMission.tsx` — add min-height to mission cards image
2. `src/pages/Index.tsx` — fix hero button positioning with responsive classes
3. `src/pages/programs/BatchProgram.tsx` — refactor hero to stacked mobile / split desktop layout

