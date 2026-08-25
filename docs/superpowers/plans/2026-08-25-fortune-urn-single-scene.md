# Fortune Urn Single-scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fortune-stick drag UI with one large, promotional draw scene that shakes an urn and reveals one animated result stick.

**Architecture:** A generated PNG provides the resting urn with five sticks. The existing draw dialog holds two mutually exclusive scene states: the clickable urn and the revealed result stick; CSS animations control shake, sparkle, and reveal while JavaScript transitions state and applies the existing `drawPenalty` only after the reveal begins.

**Tech Stack:** Generated PNG assets, HTML, CSS animations, vanilla JavaScript, Node `assert` tests.

## Global Constraints

- The resting urn asset contains exactly five sticks and has no text.
- The draw dialog uses only one visible animated scene at a time.
- Clicking the urn, not dragging a stick, starts the draw.
- The revealed stick displays `MẤT TOÀN BỘ ĐIỂM` and the actual simulated-point loss remains determined by `drawPenalty`.
- Existing score, ranking and confirmation behaviour remains unchanged.

---

### Task 1: Generate the static urn asset

**Files:**
- Create: `assets/generated/fortune-urn-five-sticks.png`

**Interfaces:**
- Produces: one transparent PNG referenced by the draw dialog as `fortune-urn-five-sticks.png`.

- [ ] **Step 1: Generate the asset**

  Use image generation with this request: a vertical ornate Vietnamese red-and-gold fortune urn, five red fortune sticks visibly inside its mouth, centered front view, transparent background, polished game UI illustration, no people, no text, no badges, no watermark.

- [ ] **Step 2: Inspect the generated image**

  Confirm the asset has exactly five visible sticks, a transparent background, no text, and enough clear space above the urn for the shake animation.

- [ ] **Step 3: Move the selected image into the project**

  Save the selected asset as `assets/generated/fortune-urn-five-sticks.png` without replacing any existing asset.

- [ ] **Step 4: Commit**

  ```bash
  git add assets/generated/fortune-urn-five-sticks.png
  git commit -m "feat: add five-stick fortune urn asset"
  ```

### Task 2: Single-scene dialog markup and interaction

**Files:**
- Modify: `index.html:146-149`
- Modify: `game.js:330,339,464`
- Modify: `game.test.js:123-145`

**Interfaces:**
- Consumes: `drawPenalty(session, playerId)` and the generated urn asset.
- Produces: `#draw-urn-button`, `#draw-reveal`, and a click-only transition from urn to revealed stick.

- [ ] **Step 1: Write the failing test**

  Replace the old individual-stick test with the following contract test:

  ```js
  run("uses one clickable urn scene and no draggable fortune sticks", () => {
    const html = fs.readFileSync("index.html", "utf8");
    const source = fs.readFileSync("game.js", "utf8");
    assert.match(html, /id="draw-urn-button"/);
    assert.match(html, /fortune-urn-five-sticks\.png/);
    assert.match(html, /id="draw-reveal"/);
    assert.match(source, /dom\.drawUrn\.addEventListener\('click'/);
    assert.doesNotMatch(source, /querySelectorAll\('\.draw-stick'\)/);
  });
  ```

- [ ] **Step 2: Run the test to verify it fails**

  Run: `node game.test.js`

  Expected: FAIL because the page still renders four `.draw-stick` buttons and JavaScript still collects `drawSticks`.

- [ ] **Step 3: Implement the click-only scene transition**

  Replace the stick-button markup with one `#draw-urn-button` containing the generated asset, a hidden `#draw-reveal` result scene, and an accessible instruction. Replace the `drawSticks` DOM binding and all stick handlers with a `drawUrn` click handler that adds the shaking class, waits for the CSS animation duration, hides the urn state, shows the result state, then calls `drawPenalty` and exposes confirmation.

  ```js
  dom.drawUrn.addEventListener('click', () => {
    if (dom.drawUrn.disabled) return;
    dom.drawUrn.disabled = true;
    dom.drawScene.classList.add('is-shaking');
    global.setTimeout(revealDraw, 700);
  });
  ```

- [ ] **Step 4: Run the test suite to verify it passes**

  Run: `node game.test.js`

  Expected: exit code `0` and every test reports `PASS`.

- [ ] **Step 5: Commit**

  ```bash
  git add index.html game.js game.test.js
  git commit -m "feat: reveal fortune draw from urn click"
  ```

### Task 3: Large promotional styling and result animation

**Files:**
- Modify: `styles.css:103-119`

**Interfaces:**
- Consumes: `#draw-scene`, `#draw-urn-button`, and `#draw-reveal` from Task 2.
- Produces: a 960px promotional draw dialog, an urn shake animation, sparkles, a stick rise animation, and one visible scene at a time.

- [ ] **Step 1: Write the failing test**

  Add a CSS contract test:

  ```js
  run("styles the draw as a large single-scene promotion", () => {
    const css = fs.readFileSync("styles.css", "utf8");
    assert.match(css, /#draw-dialog[^}]*max-width: 960px/);
    assert.match(css, /@keyframes fortune-urn-shake/);
    assert.match(css, /@keyframes fortune-stick-rise/);
    assert.match(css, /\.draw-scene\.is-revealed \.draw-urn-button[^}]*display: none/);
  });
  ```

- [ ] **Step 2: Run the test to verify it fails**

  Run: `node game.test.js`

  Expected: FAIL because the dialog has no 960px scene layout or named animations.

- [ ] **Step 3: Implement the promotional scene**

  Give `#draw-dialog` a 960px max width, larger padding and an overflow-safe viewport. Build the red-gold sale card with animated badges and sparkles. Add `fortune-urn-shake` to the urn state and `fortune-stick-rise` to the result state. Ensure `.draw-scene.is-revealed .draw-urn-button { display: none; }` hides the old scene before the result appears.

- [ ] **Step 4: Run the test suite to verify it passes**

  Run: `node game.test.js`

  Expected: exit code `0` and every test reports `PASS`.

- [ ] **Step 5: Commit**

  ```bash
  git add styles.css game.test.js
  git commit -m "style: expand promotional fortune draw scene"
  ```

## Self-review

- The three tasks cover the requested asset, click flow, single visible animation, full-stick result, actual loss text and larger promotional popup.
- The image asset is isolated from runtime logic; runtime state depends only on the stable DOM IDs named in Task 2.
- Drag and separate-stick selectors are explicitly removed by the regression test.
