# Quiz Countdown and Knowledge Ranking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Time each quiz for 20 seconds and break knowledge-ranking ties by the lowest total time spent on correct answers.

**Architecture:** The game model holds accumulated correct-answer milliseconds per player and accepts a response duration when placing a bet. The browser owns countdown interval lifecycle and passes elapsed time to the model. The knowledge panel renders a formatted aggregate time.

**Tech Stack:** Vanilla JavaScript, HTML, CSS, Node assertion tests.

## Global Constraints

- Correct-answer count is always the primary ranking criterion.
- Only correct answers accumulate response time.
- Every question has 20 seconds; expiry is scored as a wrong answer.
- Clear active browser timers after answer, expiry, and dialog transitions.

---

### Task 1: Persist response time and rank ties

**Files:**
- Modify: `game.test.js:73-110`
- Modify: `game.js:178-305`

- [x] **Step 1: Write the failing test**

```js
const result = game.submitBet(session, { symbol: 'bau', amount: 5 }, question.correctIndex, 4200);
assert.equal(result.correct, true);
assert.equal(session.players[0].correctAnswerTimeMs, 4200);
assert.deepEqual(game.knowledgeRanking(session).map((player) => player.name), ['Nhanh', 'Chậm']);
```

- [x] **Step 2: Run test to verify it fails**

Run: `node game.test.js`
Expected: FAIL because players do not store timing data and `submitBet` does not accept it.

- [x] **Step 3: Write minimal implementation**

```js
players: cleanNames.map((name, id) => ({ id, name, balance: CONFIG.startingBalance, correctAnswers: 0, correctAnswerTimeMs: 0, drawUsed: false }))
```

```js
if (correct) {
  player.correctAnswers += 1;
  player.correctAnswerTimeMs += Math.max(0, Number(responseTimeMs) || 0);
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `node game.test.js`
Expected: PASS.

### Task 2: Render and operate the 20-second timer

**Files:**
- Modify: `index.html:142-150`
- Modify: `styles.css`
- Modify: `game.js:325-430,468`
- Test: `game.test.js`

- [x] **Step 1: Write the failing markup test**

```js
assert.match(html, /id="question-timer"/);
assert.match(css, /\.question-timer/);
```

- [x] **Step 2: Run test to verify it fails**

Run: `node game.test.js`
Expected: FAIL because the timer element and timer styling are absent.

- [x] **Step 3: Implement timer lifecycle**

```js
const openQuestionTimer = () => { /* reset 20-second display and start interval */ };
const clearQuestionTimer = () => { /* clear interval and reset state */ };
```

The expiry callback calls the same `answerQuestion` path with an incorrect answer index. The answer path clears the timer before submitting the bet and sends elapsed milliseconds.

- [x] **Step 4: Run test and whitespace verification**

Run: `node game.test.js && git diff --check`
Expected: PASS with no whitespace errors.
