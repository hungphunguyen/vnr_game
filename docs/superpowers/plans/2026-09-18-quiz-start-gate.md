# Quiz Start Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let players read a quiz question before deliberately starting its 10-second answer countdown.

**Architecture:** Extend the existing question dialog with a start button and a local `questionStarted` UI flag. The dialog renders answers disabled until the button starts the existing timer; timeout and answer handling remain on the existing `answerQuestion` path.

**Tech Stack:** Browser HTML/CSS, vanilla JavaScript, Node.js built-in assertion test script.

## Global Constraints

- The countdown starts only after the player presses `Bắt đầu trả lời`.
- The countdown duration is exactly 10,000 ms and displays 10 giây before it starts.
- Answer options remain unavailable before countdown start.
- The first click starts the timer, enables answers, and hides the start button.
- The 5-second urgent style, timeout handling, Easy/Hard rules, score system, and manual end-turn behavior remain unchanged.

---

### Task 1: Add a gated 10-second quiz countdown

**Files:**
- Modify: `game.test.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `game.js`

**Interfaces:**
- Produces: `#question-start` button in the question dialog.
- Produces: local `questionStarted` boolean in `initGame`.
- Changes: `openQuestion(difficulty)` opens a paused question; `startQuestionTimer()` starts only from the `#question-start` click handler.

- [ ] **Step 1: Write the failing UI contract test**

Add a test that checks the playable document contains the dedicated start button, the 10-second initial label, and the source provides the start handler:

```js
run("waits for an explicit start before the 10-second quiz countdown", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const source = fs.readFileSync("game.js", "utf8");
  assert.match(html, /id="question-start"/);
  assert.match(html, /Bắt đầu trả lời/);
  assert.match(html, /Còn <strong>10 giây<\/strong>/);
  assert.match(source, /const questionDurationMs = 10000/);
  assert.match(source, /dom\.questionStart\.addEventListener\('click'/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node game.test.js`

Expected: FAIL because `#question-start` does not exist and the current duration is 20,000 ms.

- [ ] **Step 3: Implement the minimal gated UI**

Add this button after `#question-timer` in `index.html`:

```html
<button id="question-start" class="button button-primary question-start" type="button">
  Bắt đầu trả lời
</button>
```

Add a `.question-start` rule in `styles.css` that gives the control a small bottom margin and keeps its width automatic.

In `game.js`, add `questionStart: $('question-start')` to `dom`, set `questionDurationMs` to `10000`, and add `let questionStarted = false`. In `openQuestion`, create answer buttons disabled, show the start button, set `questionStarted = false`, and do not call `startQuestionTimer()`.

Add:

```js
dom.questionStart.addEventListener('click', () => {
  if (questionLocked || questionStarted) return;
  questionStarted = true;
  dom.questionStart.hidden = true;
  dom.answers.querySelectorAll('button').forEach((button) => { button.disabled = false; });
  startQuestionTimer();
});
```

Update `answerQuestion` to ignore calls until `questionStarted` is true, reset the flag after completion, and leave timeout invocation unchanged because it only occurs after `startQuestionTimer()` runs.

- [ ] **Step 4: Run the test suite and verify GREEN**

Run: `node game.test.js`

Expected: all current tests pass, including the new 10-second start-gate contract.

- [ ] **Step 5: Browser smoke test the interaction**

Verify in Chrome headless:

1. Choose Dễ and confirm the question dialog displays `10 giây`, the start button is visible, and all four answers are disabled.
2. Confirm the displayed timer remains 10 after one second without pressing start.
3. Press `Bắt đầu trả lời`; confirm the button disappears, all answers enable, and the timer falls below 10 after one second.
4. Answer correctly and complete the existing one-symbol Easy flow.
5. Start another question, press start, wait 10 seconds, and confirm the existing timeout flow blocks symbol selection but enables ending the turn.

- [ ] **Step 6: Commit the completed feature**

```bash
git add game.js game.test.js index.html styles.css
git commit -m "feat: gate quiz countdown behind start button"
```
