# Bốc thăm theo hạng và xếp hạng tri thức Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restrict the end-of-session draw to ranks 2 and 3, add the 70%-reduction stick, and rank knowledge by correct hard questions before other tie-breakers.

**Architecture:** Keep draw eligibility as a pure engine helper derived from `pointRanking`, and make draw resolution a deterministic-in-tests engine operation using an optional random function. Persist hard-answer counts alongside existing player knowledge statistics; the UI only renders the engine's eligibility and resolution data.

**Tech Stack:** Vanilla JavaScript, HTML dialogs, CSS, Node.js built-in `assert` test runner.

## Global Constraints

- A draw may only be offered to existing point-ranking positions 2 and 3.
- Each eligible player may draw once only.
- `reduce-70` removes 70% of the current score and retains exactly 30%.
- Knowledge ranking order is hard correct answers (descending), total correct answers (descending), total correct-answer time (ascending), then player ID (ascending).
- Preserve current score settlement, questions, and ten-second answer deadline.

---

### Task 1: Extend the game engine and its regression coverage

**Files:**
- Modify: `game.test.js:22-170`
- Modify: `game.js:126-270`

**Interfaces:**
- Consumes: player score data, `pointRanking(session)`, `submitAnswer(session, answerIndex, responseTimeMs)`.
- Produces: `drawEligiblePlayerIds(session): number[]`, `drawPenalty(session, playerId, random): { outcome: 'lose-all' | 'reduce-70', previousScore: number, score: number, deducted: number } | null`, and player `hardCorrectAnswers: number`. `drawPenalty` returns `null` for ineligible ranks as well as invalid or already-used players.

- [ ] **Step 1: Write the failing engine tests**

  Add these tests after the current draw/ranking tests in `game.test.js`:

  ```js
  run("offers the draw only to second and third score ranks", () => {
    const session = game.createSession(["Nhất", "Nhì", "Ba", "Tư"]);
    [40, 30, 20, 10].forEach((score, id) => { session.players[id].score = score; });
    assert.deepEqual(game.drawEligiblePlayerIds(session), [1, 2]);
    assert.deepEqual(
      game.drawEligiblePlayerIds(game.createSession(["Nhất", "Nhì"])),
      [1],
    );
  });

  run("draw can remove every point and blocks a second draw", () => {
    const session = game.createSession(["Nhất", "An", "Ba", "Tư"]);
    [20, 10, 5, 1].forEach((score, id) => { session.players[id].score = score; });
    assert.deepEqual(game.drawPenalty(session, 1, () => 0), {
      outcome: "lose-all", previousScore: 10, score: 0, deducted: 10,
    });
    assert.equal(game.drawPenalty(session, 1, () => 0), null);
  });

  run("draw can reduce score by seventy percent", () => {
    const session = game.createSession(["Nhất", "An", "Ba"]);
    [20, 15, 5].forEach((score, id) => { session.players[id].score = score; });
    assert.deepEqual(game.drawPenalty(session, 1, () => 0.9), {
      outcome: "reduce-70", previousScore: 15, score: 4.5, deducted: 10.5,
    });
  });

  run("draw rejects a player outside second and third ranks", () => {
    const session = game.createSession(["Nhất", "Nhì", "Ba", "Tư"]);
    [40, 30, 20, 10].forEach((score, id) => { session.players[id].score = score; });
    assert.equal(game.drawPenalty(session, 0, () => 0), null);
    assert.equal(game.drawPenalty(session, 3, () => 0), null);
  });

  run("records hard correct answers separately", () => {
    const session = readySession();
    const question = game.chooseDifficulty(session, "hard");
    game.submitAnswer(session, question.correctIndex, 1200);
    assert.equal(session.players[0].correctAnswers, 1);
    assert.equal(session.players[0].hardCorrectAnswers, 1);
  });

  run("knowledge ranking prioritizes hard answers then totals and time", () => {
    const session = game.createSession(["Nhanh dễ", "Nhiều khó", "Chậm khó", "Ít câu"]);
    Object.assign(session.players[0], { hardCorrectAnswers: 1, correctAnswers: 9, correctAnswerTimeMs: 1000 });
    Object.assign(session.players[1], { hardCorrectAnswers: 2, correctAnswers: 2, correctAnswerTimeMs: 9000 });
    Object.assign(session.players[2], { hardCorrectAnswers: 2, correctAnswers: 2, correctAnswerTimeMs: 4000 });
    Object.assign(session.players[3], { hardCorrectAnswers: 1, correctAnswers: 3, correctAnswerTimeMs: 100 });
    assert.deepEqual(game.knowledgeRanking(session).map((player) => player.name), ["Chậm khó", "Nhiều khó", "Nhanh dễ", "Ít câu"]);
  });
  ```

- [ ] **Step 2: Run the engine test suite to verify RED**

  Run: `node game.test.js`

  Expected: FAIL because `drawEligiblePlayerIds` does not exist, the draw still returns a number, and hard-answer counts/ranking are absent.

- [ ] **Step 3: Implement the smallest engine changes**

  In `createSession`, initialize each player as:

  ```js
  { id, name, score: 0, correctAnswers: 0, hardCorrectAnswers: 0, correctAnswerTimeMs: 0, drawUsed: false }
  ```

  In the successful-answer branch of `submitAnswer`, increment the hard count only for a hard question:

  ```js
  if (question.difficulty === 'hard') player.hardCorrectAnswers += 1;
  ```

  Replace the old one-line ranking/draw functions with:

  ```js
  function drawEligiblePlayerIds(session) {
    return pointRanking(session).slice(1, 3).map((player) => player.id);
  }

  function knowledgeRanking(session) {
    return [...session.players].sort((a, b) =>
      b.hardCorrectAnswers - a.hardCorrectAnswers
      || b.correctAnswers - a.correctAnswers
      || a.correctAnswerTimeMs - b.correctAnswerTimeMs
      || a.id - b.id,
    );
  }

  function drawPenalty(session, playerId, random = Math.random) {
    const player = session.players.find((item) => item.id === Number(playerId));
    if (!player || player.drawUsed || !drawEligiblePlayerIds(session).includes(player.id)) return null;
    const previousScore = player.score;
    const outcome = random() < 0.5 ? 'lose-all' : 'reduce-70';
    player.score = outcome === 'lose-all' ? 0 : previousScore * 0.3;
    player.drawUsed = true;
    return { outcome, previousScore, score: player.score, deducted: previousScore - player.score };
  }
  ```

  Export `drawEligiblePlayerIds` in the final `api` object.

- [ ] **Step 4: Run the engine test suite to verify GREEN**

  Run: `node game.test.js`

  Expected: every engine test passes, including both deterministic draw outcomes and all knowledge tie-breakers.

- [ ] **Step 5: Commit the engine change**

  ```bash
  git add game.js game.test.js
  git commit -m "feat: add ranked draw penalties and hard-answer ranking"
  ```

### Task 2: Render draw eligibility, both results, and knowledge evidence

**Files:**
- Modify: `game.test.js:172-235`
- Modify: `game.js:285-485`
- Modify: `index.html:157-211`
- Modify: `styles.css` (draw-result presentation rules)

**Interfaces:**
- Consumes: `drawEligiblePlayerIds(session)`, `drawPenalty(session, playerId)`, `knowledgeRanking(session)`, player `hardCorrectAnswers`.
- Produces: rank-restricted `.draw-player` controls, an outcome-specific draw reveal, and a knowledge ranking that explains all comparison factors.

- [ ] **Step 1: Write failing static UI regression tests**

  Add these assertions to `game.test.js`:

  ```js
  run("summary derives draw controls from eligible ranks", () => {
    const source = fs.readFileSync("game.js", "utf8");
    assert.match(source, /drawEligiblePlayerIds\(session\)/);
    assert.match(source, /eligibleDrawIds\.has\(p\.id\)/);
  });

  run("draw dialog and knowledge dialog describe both new rules", () => {
    const html = fs.readFileSync("index.html", "utf8");
    const source = fs.readFileSync("game.js", "utf8");
    assert.match(html, /Giảm 70% điểm/);
    assert.match(source, /result\.outcome === 'reduce-70'/);
    assert.match(source, /p\.hardCorrectAnswers/);
  });
  ```

- [ ] **Step 2: Run the UI regression suite to verify RED**

  Run: `node game.test.js`

  Expected: FAIL because the summary currently renders a draw button for every unused player and UI copy has no reduction outcome or hard-answer evidence.

- [ ] **Step 3: Update the draw-dialog markup and presentation**

  In `index.html`, make the result stick's static image decorative (`alt=""`) and add an initially hidden semantic result title directly below it:

  ```html
  <p id="draw-outcome-title" class="draw-outcome-title" hidden></p>
  ```

  Add a visibly prominent `.draw-outcome-title` style in `styles.css` using the existing draw panel typography and colors. It must remain readable over the draw-scene, and does not require a new bitmap asset.

- [ ] **Step 4: Wire eligibility and outcome-specific copy**

  Replace `showSummary` with a named function that computes `const eligibleDrawIds = new Set(drawEligiblePlayerIds(session));` once and includes the bốc thăm button only when `eligibleDrawIds.has(p.id) && !p.drawUsed`.

  During setup of a draw dialog, reset `drawOutcomeTitle.hidden = true`. In `revealDraw`, receive the result object and set both title and explanation:

  ```js
  const result = drawPenalty(session, dom.drawUrn.dataset.id);
  if (!result) return;
  const isReduction = result.outcome === 'reduce-70';
  dom.drawOutcomeTitle.hidden = false;
  dom.drawOutcomeTitle.textContent = isReduction ? 'Thăm giảm 70% điểm' : 'Thăm mất toàn bộ điểm';
  dom.drawResult.textContent = isReduction
    ? `Bạn bị giảm ${formatPoints(result.deducted)}, còn ${formatPoints(result.score)}.`
    : `Bạn mất toàn bộ ${formatPoints(result.previousScore)}.`;
  ```

  In the knowledge dialog, replace the existing sentence with:

  ```js
  `${p.hardCorrectAnswers} câu khó đúng · ${p.correctAnswers} câu đúng · ${formatQuizTime(p.correctAnswerTimeMs)}`
  ```

- [ ] **Step 5: Run the complete test suite to verify GREEN**

  Run: `node game.test.js`

  Expected: all existing and new engine/static UI tests print `PASS`.

- [ ] **Step 6: Run final integrity checks and commit**

  Run:

  ```bash
  node game.test.js
  git diff --check
  ```

  Expected: test process exits with code 0 and `git diff --check` produces no output.

  Commit:

  ```bash
  git add game.js game.test.js index.html styles.css
  git commit -m "feat: limit draw UI and show penalty outcomes"
  ```
