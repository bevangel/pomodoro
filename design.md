# Pomodoro 90 — Design Refresh

## Inspiration:
Clean, calming, minimal. White space is a feature, not empty space.

---

## Design Principles
1. **Breathable** — Generous whitespace, nothing cramped
2. **Calm confidence** — Few colors, used with intention
3. **Illustration-driven** — Small line-art visuals add warmth without clutter
4. **Card-based** — Content lives in soft, rounded containers

---

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background | Off-white | `#F7F7F5` |
| Card surface | Pure white | `#FFFFFF` |
| Primary accent | Teal | `#2EC4B6` |
| Primary hover | Deep teal | `#1AAB9E` |
| Text primary | Near black | `#1A1A2E` |
| Text secondary | Muted gray | `#6B7280` |
| Done/muted | Soft gray | `#C4C8D0` |
| Danger (delete) | Soft red | `#E85D75` |
| Highlight card | Light teal wash | `#E8FAF8` |

**Dark mode (toggle):** Swap background to `#1A1A2E`, cards to `#1F2937`, keep teal accent.

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| App title | Inter / system sans | 14px | 600, letter-spacing 0.25em |
| Timer digits | SF Mono / Fira Code | 72px | 700 |
| Timer label | Sans-serif | 13px | 400, uppercase, muted |
| Section heading | Sans-serif | 16px | 600 |
| Task text | Sans-serif | 15px | 400 |
| Button label | Sans-serif | 14px | 600 |

---

## Layout (Revised)

```
┌──────────────────────────────────────┐
│          POMODORO 90                 │  ← minimal header, spaced lettering
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │     ☁ (line-art illustration)  │  │  ← small calm SVG
│  │                                │  │
│  │          90:00                 │  │  ← large monospace timer
│  │        FOCUS TIME              │  │  ← subtle label
│  │                                │  │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━   │  │  ← thin rounded progress bar
│  │                                │  │
│  │   [ ▶ Play ]  ⏸  ↺            │  │  ← pill button + icon buttons
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  Tasks                          2/5  │  ← section header + count
│                                      │
│  ┌────────────────────────────────┐  │
│  │  ○  Design landing page     🗑 │  │  ← white card, generous padding
│  ├────────────────────────────────┤  │
│  │  ●  Write API docs      ✓  🗑 │  │  ← checked = teal dot + strikethrough
│  ├────────────────────────────────┤  │
│  │  ○  Review PR               🗑 │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌──────────────────────────┐ ┌───┐  │
│  │  Add a task...           │ │ + │  │  ← input + round add button
│  └──────────────────────────┘ └───┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## Component Specs

### Timer Card
- White card, `border-radius: 20px`
- `box-shadow: 0 2px 20px rgba(0,0,0,0.04)`
- Padding: `2.5rem`
- Center-aligned content
- Small line-art illustration above the digits (meditating figure or a leaf, drawn in teal + dark strokes, CSS/SVG)

### Play Button (Primary CTA)
- Pill shape: `border-radius: 50px`
- Background: teal `#2EC4B6`
- White text/icon
- Padding: `12px 32px`
- Subtle shadow: `0 4px 12px rgba(46,196,182,0.3)`

### Pause & Reset (Secondary)
- Icon-only circular buttons (40px)
- Light gray background `#F0F0EE`
- Dark icon
- No shadow

### Progress Bar
- Height: `4px`
- Track: `#ECECEA`
- Fill: teal `#2EC4B6`
- `border-radius: 2px`
- Smooth `transition: width 1s linear`

### Task Items
- White card with thin `1px solid #ECECEA` dividers between items
- Padding: `14px 16px` per row
- Custom radio-style circles instead of checkboxes:
  - Unchecked: `20px` circle, `2px` teal border
  - Checked: filled teal circle with white checkmark
- Done state: text becomes `#C4C8D0` with `line-through`
- Delete button: hidden by default, appears on hover (desktop) or always visible (mobile), soft red

### Task Input
- Full-width with rounded corners (`border-radius: 12px`)
- `2px solid #ECECEA`, focus state: `2px solid #2EC4B6`
- Add button: square-ish with rounded corners or circular, teal background, white `+` icon

---

## Illustrations (Inline SVG)

Add a small calming line-art illustration inside the timer card — similar to the Balance style:
- Simple strokes, 2-3 colors (teal `#2EC4B6`, dark `#1A1A2E`, optional peach `#F4B9A0`)
- A person meditating, a plant, or an abstract "focus" motif
- ~80px tall, centered above the timer
- Drawn as inline SVG so no external assets needed

---

## Micro-interactions

| Action | Effect |
|--------|--------|
| Play pressed | Button pulses briefly, progress bar begins |
| Task checked | Circle fills with teal, smooth 200ms transition |
| Task deleted | Row slides out left (150ms ease-out) |
| Task added | Row slides in from bottom (150ms ease-out) |
| Timer ends | Gentle pulse animation on the timer card |
| Hover on delete | Icon turns soft red |

---

## Dark Mode (Optional Toggle)

| Element | Dark Value |
|---------|-----------|
| Background | `#1A1A2E` |
| Card | `#1F2937` |
| Text primary | `#E8E8E8` |
| Text secondary | `#9CA3AF` |
| Dividers | `#2D3748` |
| Accent | `#2EC4B6` (unchanged) |

Toggle via a small sun/moon icon in the header.

---

## Summary of Changes from Current Design

| Current | New |
|---------|-----|
| Dark-only (`#1a1a2e` bg) | Light-first with optional dark toggle |
| Purple accent `#7f5af0` | Teal accent `#2EC4B6` (calmer, Balance-inspired) |
| Compact layout | Spacious with generous padding |
| Flat cards | White cards with subtle shadows |
| Standard checkboxes | Custom teal circle checkmarks |
| No illustrations | Inline SVG line-art in timer card |
| No animations | Subtle micro-interactions |
| Boxy buttons | Pill-shaped primary, circular secondary |
| No dark mode toggle | Theme toggle in header |
