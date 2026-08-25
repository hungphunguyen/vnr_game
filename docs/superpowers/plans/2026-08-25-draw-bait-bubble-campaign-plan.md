# Draw Bait Bubble Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain ×2, ×5, ×10 labels with generated flash-sale-style content bubbles that tempt players to draw.

**Architecture:** Three transparent raster bubble assets are placed inside the existing draw box, retaining the existing spatial placement and animation. The HTML gives every promotion descriptive copy and image alt text; CSS sizes the image buttons without changing the urn/reveal scene.

**Tech Stack:** HTML, CSS, Node assertion tests, built-in image generation.

## Global Constraints

- Keep a single urn interaction and its existing reveal animation.
- Use Vietnamese copy: “NHÂN ĐÔI MAY MẮN”, “SIÊU THƯỞNG GIỚI HẠN”, and “JACKPOT CỰC ĐẠI”.
- Generate transparent, project-local PNG assets; do not overwrite prior generated assets.

---

### Task 1: Generate and wire campaign bubbles

**Files:**
- Create: `assets/generated/draw-bait-x2-bubble.png`
- Create: `assets/generated/draw-bait-x5-bubble.png`
- Create: `assets/generated/draw-bait-x10-bubble.png`
- Modify: `game.test.js:133-147`
- Modify: `index.html:148`
- Modify: `styles.css:108-109`

- [x] **Step 1: Write the failing test**

```js
assert.match(html, /assets\/generated\/draw-bait-x2-bubble\.png/);
assert.match(html, /assets\/generated\/draw-bait-x5-bubble\.png/);
assert.match(html, /assets\/generated\/draw-bait-x10-bubble\.png/);
```

- [x] **Step 2: Run test to verify it fails**

Run: `node game.test.js`
Expected: FAIL because the markup only contains plain `×2`, `×5`, and `×10` elements.

- [x] **Step 3: Write minimal implementation**

```html
<div class="draw-bait draw-bait-x2"><img src="assets/generated/draw-bait-x2-bubble.png" alt="Nhân đôi may mắn, x2"></div>
```

```css
.draw-bait { position: absolute; z-index: 4; animation: draw-bait 1.2s ease-in-out infinite alternate; }
.draw-bait img { display: block; width: 100%; }
```

- [x] **Step 4: Run test to verify it passes**

Run: `node game.test.js && git diff --check`
Expected: All tests pass and no whitespace errors.
