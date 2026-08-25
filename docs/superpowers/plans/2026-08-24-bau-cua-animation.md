# Animated Bầu Cua Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Bầu Cua game with animated SVG dice/bowl stages, an animated result reveal, mandatory bets, and a player sidebar.

**Architecture:** Extend the existing game state with `intro`, `betting`, `revealing`, and `settled` phases plus an ephemeral preview payload. `game.js` will render inline SVG from data helpers and schedule visual phases; HTML supplies a reusable stage dialog; CSS handles every transition with keyframes.

**Tech Stack:** HTML5, CSS3 keyframes, inline SVG, vanilla JavaScript, Node built-in assertions.

## Global Constraints

- Do not add a library; all motion is CSS and browser-native timers.
- Dice are random and locked before the round intro starts.
- Betting begins only after the introductory stage completes.
- A player cannot skip; only a submitted answer advances the turn.
- Preview automatically opens once for its buyer at their final turn; closing it clears its payload and prevents reopening in that round.
- Settlement occurs only after the animated bowl reveal finishes.
- SVG replaces emoji for every game symbol and die.

---

### Task 1: Add tested animation and preview state transitions

**Files:**
- Modify: `game.js`
- Modify: `game.test.js`

**Interfaces:**
- Produces: `startRound(session)` with `phase: 'intro'`, `openBetting(session)`, `consumePreview(session)`, and `beginReveal(session)`.
- Consumes: existing `buyPreview(session)`, `submitBet(session, selection, answerIndex)`, and `settleRound(session)`.

- [ ] **Step 1: Add a failing state-transition test**

```js
game.startRound(session, () => 0);
assert.equal(session.round.phase, 'intro');
assert.equal(game.currentPlayer(session), null);
game.openBetting(session);
assert.equal(game.currentPlayer(session).name, 'An');
```

- [ ] **Step 2: Run `node game.test.js` and confirm the expected phase assertion fails**

Expected: current implementation reports `betting` rather than `intro`.

- [ ] **Step 3: Implement phase controls and remove skip API**

```js
function openBetting(session) { session.round.phase = 'betting'; }
function consumePreview(session) {
  const payload = session.round.previewPayload;
  session.round.previewPayload = null;
  return payload;
}
```

- [ ] **Step 4: Add tests for one-time preview payload and deferred settlement**

```js
assert.deepEqual(game.consumePreview(session), ['bau', 'cua', 'tom']);
assert.equal(game.consumePreview(session), null);
assert.throws(() => game.settleRound(session), /Chưa thể/);
game.beginReveal(session);
assert.equal(game.settleRound(session).payouts[0], 0);
```

- [ ] **Step 5: Run `node game.test.js` and verify all assertions pass**

### Task 2: Replace screen structure with stage and sidebar markup

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: IDs `player-sidebar`, `round-stage`, `stage-bowl`, `stage-dice`, `preview-dialog`, and `result-dialog` from `initGame()`.
- Produces: two-column game shell, an animation stage, a closeable preview dialog, and result settlement content.

- [ ] **Step 1: Add static markup for the sidebar and stage**

```html
<div class="game-layout">
  <aside id="player-sidebar" class="player-sidebar"></aside>
  <section class="game-main">...</section>
</div>
<section id="round-stage" class="round-stage" hidden>
  <div id="stage-dice"></div><div id="stage-bowl"></div>
</section>
```

- [ ] **Step 2: Verify current page lacks these elements before the change**

Run: open `index.html` in a browser.

Expected: no full-screen bowl stage and player list is beneath the board.

- [ ] **Step 3: Add responsive CSS and keyframes**

```css
.game-layout { display:grid; grid-template-columns: 260px minmax(0,1fr); gap:20px; }
.round-stage.is-shaking .stage-bowl { animation: shake .72s ease-in-out 3; }
.round-stage.is-revealing .stage-bowl { animation: lift .8s forwards; }
@media (max-width: 760px) { .game-layout { grid-template-columns: 1fr; } }
```

- [ ] **Step 4: Verify desktop and 390px mobile layouts**

Run: open `index.html`; inspect normal and 390px widths.

Expected: player sidebar is left on desktop, top on mobile, and the stage covers the game without overflow.

### Task 3: Render SVG assets and orchestrate animations

**Files:**
- Modify: `game.js`
- Modify: `styles.css`
- Test: `game.test.js`

**Interfaces:**
- Consumes: state transitions from Task 1 and markup from Task 2.
- Produces: `symbolSvg(id)`, `dieSvg(id)`, `bowlSvg()`, `playIntro()`, `showPreviewIfDue()`, and `playReveal()` in the browser integration.

- [ ] **Step 1: Add a failing assertion that symbols provide SVG markup**

```js
assert.match(game.symbolSvg('cua'), /<svg/);
assert.match(game.dieSvg('bau'), /<svg/);
```

- [ ] **Step 2: Run `node game.test.js` and verify `symbolSvg` is undefined**

- [ ] **Step 3: Implement SVG helpers and timer-driven stage flow**

```js
function playIntro() {
  stage.className = 'round-stage is-shaking'; stage.hidden = false;
  setTimeout(() => { stage.hidden = true; openBetting(session); render(); }, 3000);
}
function playReveal() {
  beginReveal(session); stage.className = 'round-stage is-revealing';
  setTimeout(() => { const settlement = settleRound(session); showSettlement(settlement); }, 1300);
}
```

- [ ] **Step 4: Run `node game.test.js` and `node --check game.js`**

Expected: assertions pass and syntax command exits 0.

### Task 4: Wire mandatory interaction and preview dialog

**Files:**
- Modify: `game.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `consumePreview`, animation methods, dialogs, and current bet form.
- Produces: no skip button or `skipTurn` reference; preview close listener that clears only preview content; result dialog opening after reveal animation.

- [ ] **Step 1: Remove the skip control and event handler**

```js
// No skip button is rendered or registered.
```

- [ ] **Step 2: Connect the preview auto-open condition**

```js
if (currentPlayer(session)?.id === round.previewBuyerId && round.previewPayload) {
  previewDialog.showModal();
}
previewClose.addEventListener('click', () => { consumePreview(session); previewDialog.close(); });
```

- [ ] **Step 3: Run full tests and manually exercise the 4-player preview flow**

Run: `node game.test.js`; then open `index.html`.

Expected: after player 2 buys preview, players 3 and 4 bet, player 2 sees one closeable preview popup, answers a question, then the bowl opens before settlement appears.
