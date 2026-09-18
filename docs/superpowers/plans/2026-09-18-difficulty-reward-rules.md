# Difficulty Reward Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the star-based wagering economy with one Easy/Hard quiz choice and one fixed-size symbol selection per player turn.

**Architecture:** Keep the existing single-file game engine and DOM adapter, but give each round an explicit `turnState` that moves from difficulty selection to quiz completion to symbol selection. Store cumulative player scores separately from per-round bets, then settle each matching die at the chosen difficulty's fixed point multiplier.

**Tech Stack:** Browser HTML/CSS, vanilla JavaScript, Node.js built-in assertion test runner script.

## Global Constraints

- Easy uses an easy question, exactly 1 distinct symbol, and 1 point per matching die.
- Hard uses a hard question, exactly 3 distinct symbols, and 1.5 points per matching die.
- Repeated matching dice each award points independently.
- A player answers and records at most one bet per round, then manually presses `Kết thúc lượt`.
- A wrong or timed-out answer records no bet but still permits ending the turn.
- Temporarily classify the 100 current questions alternately into 50 Easy and 50 Hard questions.
- Remove balances, wager amounts, minimum bets, and the paid result-preview feature.
- Keep the 20-second quiz timer, knowledge ranking, and current draw penalty behavior.
- Add no dependencies and do not restructure the existing three-file application.

---

### Task 1: Replace the money model with difficulty-based turn state

**Files:**
- Modify: `game.test.js`
- Modify: `game.js`

**Interfaces:**
- Produces: `CONFIG.difficulties` with `{ easy: { selectionCount: 1, pointsPerMatch: 1 }, hard: { selectionCount: 3, pointsPerMatch: 1.5 } }`.
- Produces: `chooseDifficulty(session, difficulty) -> Question`.
- Produces: `submitAnswer(session, answerIndex, responseTimeMs = 0) -> { correct, question }`.
- Produces: `toggleBetSymbol(session, symbol) -> string[]`.
- Changes: `endTurn(session) -> boolean` validates the current `turnState`, records one bet after a correct answer, and advances.
- Changes: players contain `score` instead of `balance`; bets contain `{ playerId, difficulty, symbols, pointsPerMatch }`.

- [ ] **Step 1: Write failing engine tests**

Replace the obsolete balance, preview, wrong-answer charge, and amount-payout tests with tests equivalent to:

```js
function readySession(randomValues = [0, 0, 0, 0]) {
  const session = game.createSession(["An"]);
  game.startRound(session, scriptedRandom(randomValues));
  game.rollDice(session);
  game.openBetting(session);
  return session;
}

run("creates players with zero score", () => {
  const session = game.createSession(["An", "Bình"]);
  assert.deepEqual(session.players.map((player) => player.score), [0, 0]);
  assert.ok(session.players.every((player) => !("balance" in player)));
});

run("splits questions evenly and selects the requested difficulty", () => {
  assert.equal(game.CONFIG.questions.filter((q) => q.difficulty === "easy").length, 50);
  assert.equal(game.CONFIG.questions.filter((q) => q.difficulty === "hard").length, 50);
  const session = game.createSession(["An"]);
  game.startRound(session, scriptedRandom([0]));
  game.openBetting(session);
  assert.equal(game.chooseDifficulty(session, "hard").difficulty, "hard");
});

run("a wrong answer creates no bet and allows ending the turn", () => {
  const session = readySession([0, 0, 0, 0]);
  const question = game.chooseDifficulty(session, "easy");
  game.submitAnswer(session, question.correctIndex === 0 ? 1 : 0);
  assert.equal(game.endTurn(session), true);
  assert.deepEqual(session.round.bets, []);
});

run("easy requires one symbol and records only one bet", () => {
  const session = readySession([0, 0, 0, 0]);
  const question = game.chooseDifficulty(session, "easy");
  game.submitAnswer(session, question.correctIndex);
  assert.deepEqual(game.toggleBetSymbol(session, "bau"), ["bau"]);
  assert.throws(() => game.toggleBetSymbol(session, "cua"), /1 ô/);
  assert.equal(game.endTurn(session), true);
  assert.deepEqual(session.round.bets[0].symbols, ["bau"]);
  assert.throws(() => game.submitAnswer(session, question.correctIndex), /lượt trả lời/);
});

run("hard requires exactly three distinct symbols", () => {
  const session = readySession([0, 0, 0, 0]);
  const question = game.chooseDifficulty(session, "hard");
  game.submitAnswer(session, question.correctIndex);
  game.toggleBetSymbol(session, "bau");
  game.toggleBetSymbol(session, "cua");
  assert.equal(game.endTurn(session), false);
  game.toggleBetSymbol(session, "tom");
  assert.equal(game.endTurn(session), true);
  assert.deepEqual(session.round.bets[0], {
    playerId: 0,
    difficulty: "hard",
    symbols: ["bau", "cua", "tom"],
    pointsPerMatch: 1.5,
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node game.test.js`

Expected: FAIL because players do not have `score` and `chooseDifficulty`, `submitAnswer`, and `toggleBetSymbol` do not exist.

- [ ] **Step 3: Implement the minimal engine state machine**

In `game.js`:

```js
const DIFFICULTIES = {
  easy: { label: 'Dễ', selectionCount: 1, pointsPerMatch: 1 },
  hard: { label: 'Khó', selectionCount: 3, pointsPerMatch: 1.5 },
};

const createTurnState = () => ({
  difficulty: null,
  answered: false,
  correct: false,
  symbols: [],
});
```

Add `difficulty: index % 2 === 0 ? 'easy' : 'hard'` to every generated question. Initialize players with `score: 0`, remove money and preview configuration, and initialize/reset `round.turnState` for every player turn.

Implement the public functions with these validations:

```js
function chooseDifficulty(session, difficulty) {
  const turn = session?.round?.turnState;
  if (!currentPlayer(session) || !DIFFICULTIES[difficulty] || turn.difficulty) {
    throw new Error('Không thể chọn mức câu hỏi cho lượt này.');
  }
  turn.difficulty = difficulty;
  return getCurrentQuestion(session);
}

function submitAnswer(session, answerIndex, responseTimeMs = 0) {
  const turn = session?.round?.turnState;
  if (!turn?.difficulty || turn.answered) throw new Error('Không có lượt trả lời hợp lệ.');
  const question = getCurrentQuestion(session);
  turn.answered = true;
  turn.correct = Number(answerIndex) === question.correctIndex;
  session.round.usedQuestionIds.push(question.id);
  if (turn.correct) {
    const player = currentPlayer(session);
    player.correctAnswers += 1;
    player.correctAnswerTimeMs += Math.min(20000, Math.max(0, Number(responseTimeMs) || 0));
  }
  return { correct: turn.correct, question };
}
```

`getCurrentQuestion` must filter unused questions by `round.turnState.difficulty`. `toggleBetSymbol` must require a correct answer, toggle an already selected symbol off, and reject selections above the configured limit. `endTurn` must reject unanswered turns and correct answers without the exact symbol count; for valid correct turns it pushes exactly one copied bet before advancing.

- [ ] **Step 4: Run engine tests and verify GREEN**

Run: `node game.test.js`

Expected: all engine tests through Task 1 pass; later settlement/UI cleanup assertions may still be absent.

- [ ] **Step 5: Commit the engine model**

```bash
git add game.js game.test.js
git commit -m "feat: add difficulty based betting turns"
```

---

### Task 2: Settle matching dice as fixed score awards

**Files:**
- Modify: `game.test.js`
- Modify: `game.js`

**Interfaces:**
- Changes: `settleRound(session) -> { counts, awards }`, where `awards[playerId]` is the score earned in that round.
- Changes: `pointRanking(session)` sorts descending by `score`.
- Changes: `drawPenalty(session, playerId)` resets `score` to zero and returns the removed score.

- [ ] **Step 1: Write failing settlement tests**

Add tests equivalent to:

```js
function completedBet(difficulty, symbols, randomValues) {
  const session = readySession(randomValues);
  const question = game.chooseDifficulty(session, difficulty);
  game.submitAnswer(session, question.correctIndex);
  symbols.forEach((symbol) => game.toggleBetSymbol(session, symbol));
  game.endTurn(session);
  return session;
}

function revealAndSettle(session) {
  game.beginReveal(session);
  return game.settleRound(session);
}

run("easy awards one point for every matching die", () => {
  const session = completedBet("easy", ["bau"], [0, 0, 0]);
  const settlement = revealAndSettle(session);
  assert.equal(settlement.awards[0], 3);
  assert.equal(session.players[0].score, 3);
});

run("hard awards 1.5 points for every matching die including repeats", () => {
  const session = completedBet("hard", ["bau", "cua", "tom"], [0, 0, 0.2]);
  const settlement = revealAndSettle(session);
  assert.equal(settlement.awards[0], 4.5);
  assert.equal(session.players[0].score, 4.5);
});

run("point ranking and draw penalty use score", () => {
  const session = game.createSession(["An", "Bình"]);
  session.players[0].score = 1.5;
  session.players[1].score = 3;
  assert.deepEqual(game.pointRanking(session).map((p) => p.name), ["Bình", "An"]);
  assert.equal(game.drawPenalty(session, 1), 3);
  assert.equal(session.players[1].score, 0);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node game.test.js`

Expected: FAIL because `settleRound` still computes amount-based payouts and player balances.

- [ ] **Step 3: Implement fixed score settlement**

Replace payout calculation with:

```js
const awards = Object.fromEntries(session.players.map((player) => [player.id, 0]));
session.round.bets.forEach((bet) => {
  const matches = session.round.dice.filter((symbol) => bet.symbols.includes(symbol)).length;
  awards[bet.playerId] += matches * bet.pointsPerMatch;
});
session.players.forEach((player) => { player.score += awards[player.id]; });
```

Return `{ counts, awards }`, update `pointRanking` to use `score`, and update `drawPenalty` to reset `score` while preserving its one-use guard.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node game.test.js`

Expected: all engine and settlement tests pass.

- [ ] **Step 5: Commit score settlement**

```bash
git add game.js game.test.js
git commit -m "feat: award points by difficulty multiplier"
```

---

### Task 3: Replace the wager controls with Easy and Hard controls

**Files:**
- Modify: `game.test.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `game.js`

**Interfaces:**
- Consumes: `chooseDifficulty`, `submitAnswer`, `toggleBetSymbol`, `CONFIG.difficulties`, and `round.turnState` from Task 1.
- Consumes: `settlement.awards`, player `score`, and score ranking from Task 2.
- Produces: DOM buttons `#choose-easy` and `#choose-hard`, instruction text `#board-instruction`, and score-only status/result copy.

- [ ] **Step 1: Write failing static UI tests**

Add assertions equivalent to:

```js
run("shows difficulty choices and removes money wager controls", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /id="choose-easy"/);
  assert.match(html, /id="choose-hard"/);
  assert.match(html, /1 ô × 1 điểm/);
  assert.match(html, /3 ô × 1,5 điểm/);
  assert.doesNotMatch(html, /id="bet-amount"|id="preview-button"|id="preview-dialog"/);
});

run("source no longer contains the star economy or preview flow", () => {
  const source = fs.readFileSync("game.js", "utf8");
  assert.doesNotMatch(source, /startingBalance|minimumBet|previewCost|buyPreview|consumePreview|\.balance/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node game.test.js`

Expected: FAIL because the old amount input and paid preview controls still exist.

- [ ] **Step 3: Update HTML and CSS**

In `index.html`, replace the amount form and preview button with two button cards:

```html
<section class="bet-panel panel" aria-labelledby="difficulty-title">
  <h3 id="difficulty-title">Chọn mức câu hỏi</h3>
  <div class="difficulty-options">
    <button id="choose-easy" class="difficulty-option" type="button">
      <strong>Dễ</strong><span>Chọn 1 ô × 1 điểm</span>
    </button>
    <button id="choose-hard" class="difficulty-option" type="button">
      <strong>Khó</strong><span>Chọn 3 ô × 1,5 điểm</span>
    </button>
  </div>
  <p id="bet-error" class="form-note error" role="alert"></p>
</section>
```

Change the board heading to `<span id="board-instruction">Hãy chọn mức câu hỏi trước</span>` and remove the entire preview dialog. Add `.difficulty-options` and `.difficulty-option` styles using the existing colors, borders, focus states, and responsive panel conventions; remove styles used only by `.amount-row`, `.preview-button`, and the preview dialog.

- [ ] **Step 4: Wire the new DOM flow**

In `initGame`:

- Bind the two difficulty buttons to `chooseDifficulty(session, 'easy')` and `chooseDifficulty(session, 'hard')`, populate the existing question dialog, and start the timer.
- Make `answerQuestion` call `submitAnswer`; after success, close the dialog and instruct the player to choose exactly 1 or 3 symbols. After failure or timeout, close the dialog and instruct the player to end the turn.
- Make board buttons call `toggleBetSymbol`; mark every symbol in `round.turnState.symbols` with `selected`.
- Disable board buttons unless the current turn has a correct answer.
- Disable difficulty buttons after a difficulty has been chosen.
- Disable `Kết thúc lượt` unless the turn is answered and either wrong or has the exact required number of symbols.
- Render player totals with `formatPoints(value)`, using `Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })`.
- Render settlement copy as `${player.name}: +${formatPoints(awards[player.id])} · tổng ${formatPoints(player.score)}`.
- Remove all preview DOM references, listeners, state, and copy.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `node game.test.js`

Expected: all tests pass with no references to removed DOM elements.

- [ ] **Step 6: Commit the UI migration**

```bash
git add index.html styles.css game.js game.test.js
git commit -m "feat: add easy and hard game controls"
```

---

### Task 4: Clean up legacy copy and verify the complete game

**Files:**
- Modify: `game.test.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `game.js`

**Interfaces:**
- Consumes all interfaces from Tasks 1–3.
- Produces a complete score-based game with no runtime dependency on the removed money/preview model.

- [ ] **Step 1: Add a failing legacy-removal regression test**

Add:

```js
run("removes legacy money and preview copy from the playable interface", () => {
  const files = ["index.html", "game.js"].map((file) => fs.readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(files, /Số dư|Cược tối thiểu|Trả 15|Xem trước kết quả|điểm mô phỏng|⭐/i);
});
```

- [ ] **Step 2: Run tests and verify RED if any legacy copy remains**

Run: `node game.test.js`

Expected: FAIL listing any remaining user-facing star-economy text.

- [ ] **Step 3: Remove remaining legacy code and copy**

Use `rg -n "startingBalance|minimumBet|previewCost|balance|bet-amount|preview-button|preview-dialog|Số dư|Cược tối thiểu|Trả 15|Xem trước kết quả|⭐" game.js index.html styles.css game.test.js` and remove or replace every hit. Keep the Vietnamese term `cược` where it means selecting Bầu Cua symbols rather than spending currency. Update the draw-result sentence to refer to `điểm` rather than `điểm mô phỏng`.

- [ ] **Step 4: Run full automated verification**

Run:

```bash
node game.test.js
git diff --check
```

Expected: every test prints `PASS`, the process exits 0, and `git diff --check` has no output.

- [ ] **Step 5: Perform a browser smoke-test checklist**

Open `index.html` and verify:

1. Start a two-player game; both totals show 0 điểm.
2. Choose Dễ, answer correctly, select one symbol, and confirm a second symbol is rejected.
3. End the turn manually.
4. Choose Khó for the second player, answer correctly, select three different symbols, and end the turn.
5. Reveal the bowl and confirm per-player round awards and cumulative totals are displayed.
6. Start a new round and confirm scores persist while turn choices reset.
7. End the session and confirm score ranking, knowledge ranking, and the retained draw penalty still open without console errors.

- [ ] **Step 6: Commit final cleanup**

```bash
git add game.js game.test.js index.html styles.css
git commit -m "refactor: remove legacy star wagering flow"
```
