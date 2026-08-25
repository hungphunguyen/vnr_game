# Bầu Cua Cá Ngựa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Vietnamese Bầu Cua Cá Ngựa game with player setup, question-gated betting, pre-rolled dice, and a paid preview that changes betting order.

**Architecture:** `index.html` holds accessible screen, board, dialog, and result markup; `styles.css` supplies the responsive folk-game visual system; `game.js` owns configuration, game state, deterministic transitions, rendering, and DOM event handling. A small browser test page exercises game logic without dependencies.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES2020), browser-native dialogs/events, no dependencies or server.

## Global Constraints

- Vietnamese UI; no external libraries or server.
- Starting funds are exactly 25,000 and granted once when the session starts; balances persist between rounds.
- Each round rolls and locks three dice before betting begins; only the paid preview holder sees them early.
- Minimum bet is 5,000; preview fee is 15,000; values are centralized in `CONFIG`.
- Questions have four answers and must not repeat in a round.
- Correct answers record and deduct the bet; incorrect answers deduct it and consume the turn without a bet.
- Preview can be used once per round, moves the buyer to the final betting turn, and applies only to that round.

---

### Task 1: Create the game logic and configuration

**Files:**
- Create: `game.js`
- Test: `tests.html`

**Interfaces:**
- Produces: `CONFIG`, `createSession(names)`, `startRound(session, random)`, `buyPreview(session)`, `submitBet(session, selection, answerIndex)`, `settleRound(session)` exposed on `window.BauCuaGame`.
- Consumes: `random(): number` returning a number in `[0, 1)` to make tests predictable.

- [ ] **Step 1: Write failing browser assertions for lifecycle rules**

```js
const session = BauCuaGame.createSession(['An', 'Bình', 'Chi', 'Dũng']);
assert(session.players.every((player) => player.balance === 25000));
BauCuaGame.startRound(session, () => 0);
assert.deepEqual(session.round.dice, ['bau', 'bau', 'bau']);
BauCuaGame.buyPreview(session);
assert.deepEqual(session.round.order, [1, 2, 3, 0]);
```

- [ ] **Step 2: Open `tests.html` in a browser and verify assertions fail because the logic API is absent**

Run: open `tests.html` using a local browser.

Expected: assertion error that `BauCuaGame` is undefined.

- [ ] **Step 3: Implement pure session transitions with validation**

```js
const CONFIG = { startingBalance: 25000, minimumBet: 5000, previewCost: 15000 };
function buyPreview(session) {
  const player = currentPlayer(session);
  if (session.round.previewBuyerId !== null || player.balance < CONFIG.previewCost) return false;
  player.balance -= CONFIG.previewCost;
  session.round.previewBuyerId = player.id;
  session.round.order.splice(session.round.turnIndex, 1);
  session.round.order.push(player.id);
  return true;
}
```

- [ ] **Step 4: Extend assertions for answer handling, unique questions, and settlement**

```js
const questionId = session.round.currentQuestion.id;
assert(BauCuaGame.submitBet(session, { symbol: 'bau', amount: 5000 }, 0) === true);
assert(session.players[0].balance === 5000);
assert(session.round.usedQuestionIds.includes(questionId));
assert(BauCuaGame.settleRound(session).payouts[0] === 15000);
```

- [ ] **Step 5: Run assertions and verify all pass**

Run: open `tests.html` using a local browser.

Expected: every test row shows PASS.

### Task 2: Build semantic page structure and responsive visual design

**Files:**
- Modify: `index.html`
- Create: `styles.css`

**Interfaces:**
- Consumes: IDs used by `game.js`: `setup-screen`, `game-screen`, `player-list`, `start-game`, `bet-form`, `question-dialog`, and `result-dialog`.
- Produces: a setup form, game header, player rail, six symbol buttons, betting controls, accessible dialogs, live status region, and round controls.

- [ ] **Step 1: Add the page elements required for a rendered setup state**

```html
<main class="app-shell">
  <section id="setup-screen" aria-labelledby="setup-title">...</section>
  <section id="game-screen" hidden aria-live="polite">...</section>
  <dialog id="question-dialog" aria-labelledby="question-title">...</dialog>
  <dialog id="result-dialog" aria-labelledby="result-title">...</dialog>
</main>
```

- [ ] **Step 2: Open `index.html` and verify the empty initial document has no player controls**

Run: open `index.html` in a browser.

Expected: the existing blank page cannot add a player or start a game.

- [ ] **Step 3: Implement the folk-game CSS system**

```css
:root { --ink: #2d1910; --red: #b72d24; --gold: #f4c95d; --paper: #fff5db; }
.board { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 700px) { .board { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
```

- [ ] **Step 4: Verify structure and layout in desktop and 390px mobile widths**

Run: open `index.html`; inspect at normal width and 390px viewport.

Expected: setup inputs and game board are readable; six cells remain tappable with no horizontal overflow.

### Task 3: Connect the UI to gameplay transitions

**Files:**
- Modify: `game.js`
- Modify: `index.html`
- Test: `tests.html`

**Interfaces:**
- Consumes: DOM IDs and pure functions defined in Tasks 1–2.
- Produces: `initGame()` registered on `DOMContentLoaded`; it renders current state and advances only through user actions.

- [ ] **Step 1: Add a failing interaction assertion for the preview order change**

```js
click('#preview-button');
assert(text('#turn-label').includes('Bình'));
assert(text('#queue').includes('Bình: lượt cuối'));
```

- [ ] **Step 2: Run browser tests and verify the interaction assertion fails before DOM wiring exists**

Run: open `tests.html` in a browser.

Expected: interaction test fails because no preview button listener has been registered.

- [ ] **Step 3: Wire rendering and event handlers**

```js
previewButton.addEventListener('click', () => {
  if (buyPreview(session)) render();
});
betForm.addEventListener('submit', (event) => {
  event.preventDefault();
  openQuestionForPendingSelection();
});
```

- [ ] **Step 4: Add and run end-to-end browser assertions**

```js
assert(text('#question-dialog').includes('4 đáp án'));
assert(text('#status').includes('Trả lời đúng'));
assert(text('#result-dialog').includes('Kết quả xúc xắc'));
assert(text('#balance-0').includes('20.000'));
```

Run: open `tests.html` in a browser.

Expected: all logic and interaction rows pass.

- [ ] **Step 5: Manually test two and four-player rounds**

Run: open `index.html` in a browser.

Expected: player setup works; the preview buyer moves to the final turn; preview dice stay private until they bet; wrong answers charge but do not record bets; a new round retains balances.
