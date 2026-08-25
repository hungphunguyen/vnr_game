# Fortune-stick Urn Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every fortune stick appear to originate inside the illustrated urn and retain its natural angle while the player pulls it upward.

**Architecture:** Use a single authoritative CSS layout for the draw scene: sticks occupy an absolute layer behind the urn artwork, whose opaque body masks their lower portions. Store each stick's resting rotation in a `data-resting-angle` attribute; JavaScript composes that angle with the drag offset instead of overwriting it.

**Tech Stack:** HTML, CSS, vanilla browser JavaScript, Node `assert` tests.

## Global Constraints

- Reuse the existing generated `fortune-box-empty.png` and `fortune-stick-thick.png` assets.
- Do not change draw penalties or any other game rules.
- Keep the draw interaction usable with pointer input.
- Ensure the layout remains within the modal on narrow viewports.

---

### Task 1: Layered urn layout and composited pull transform

**Files:**
- Modify: `index.html:146-149`
- Modify: `styles.css:14-29,119-122`
- Modify: `game.js:330,464`
- Test: `game.test.js`

**Interfaces:**
- Consumes: `.draw-stick` buttons and the existing pointer-drag interaction.
- Produces: `.draw-urn` whose stick layer is behind `.draw-box-art`, and `data-resting-angle` values read by the pointer interaction.

- [ ] **Step 1: Write the failing test**

  Add a real DOM-markup contract test that reads `index.html` and asserts the stick group occurs before the urn image, with each `.draw-stick` carrying a resting-angle value. This catches the regression where the artwork cannot mask the stick bodies or the script lacks the data it needs to preserve their rotation.

  ```js
  run("layers fortune sticks behind the urn and gives each a resting angle", () => {
    const html = fs.readFileSync("index.html", "utf8");
    const stickLayer = html.indexOf('class="draw-sticks"');
    const urnArtwork = html.indexOf('class="draw-box-art"');
    assert.ok(stickLayer >= 0 && urnArtwork > stickLayer);
    assert.equal((html.match(/class="draw-stick" data-resting-angle="-?\d+"/g) || []).length, 4);
  });
  ```

- [ ] **Step 2: Run the test to verify it fails**

  Run: `node game.test.js`

  Expected: the new test fails because the urn artwork currently precedes the sticks and no buttons contain `data-resting-angle`.

- [ ] **Step 3: Write minimal implementation**

  Move `.draw-sticks` before `.draw-box-art` in `index.html`, set the four `data-resting-angle` values to `-10`, `-3`, `4`, and `11`, consolidate the duplicate draw-scene CSS into one set of rules, and adjust the pointer-move assignment to compose `translateY(-lift)` with `rotate(${restingAngle}deg)`.

  ```js
  const restingAngle = Number(stick.dataset.restingAngle);
  stick.style.transform = `translateY(${-lift}px) rotate(${restingAngle}deg)`;
  ```

- [ ] **Step 4: Run the test suite to verify it passes**

  Run: `node game.test.js`

  Expected: exit code `0` and every test reports `PASS`.

- [ ] **Step 5: Commit**

  ```bash
  git add index.html styles.css game.js game.test.js docs/superpowers/plans/2026-08-25-fortune-stick-urn-alignment.md
  git commit -m "fix: align fortune sticks inside urn"
  ```

## Self-review

- Scope is limited to visual layering and the pull transform; scoring and draw consequences are untouched.
- The expected test values are hand-authored and fail if the masking order or per-stick transform data is removed.
- All names used by the JavaScript match the HTML `data-resting-angle` contract.
