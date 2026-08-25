# Session Summary and Draw Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an educational end-of-session flow that contrasts temporary point-based reward with a final knowledge ranking.

**Architecture:** Extend the game session with per-player correct-answer counts and a finished state. A summary dialog first ranks points, offers a deterministic loss-of-points draw for each player, then displays a legal-awareness dialog before revealing the final ranking by correct answers.

**Tech Stack:** Vanilla HTML, CSS animations, JavaScript, generated transparent image assets, Node assertion tests.

## Global Constraints

- Points are simulated and never represent money.
- The draw always reduces the selected player's current points to zero.
- Temporary ranking uses points; final ranking uses correct-answer count only.
- Legal copy must say the cited sanction applies when gambling involves money or property, not to this simulated game.
- Use Article 28, Clause 2(a), Decree 144/2021/NĐ-CP as the administrative-warning reference.

---

### Task 1: Session result data and summary controls

**Files:**
- Modify: `game.js`, `game.test.js`, `index.html`

- [ ] Write a failing test asserting that each correct quiz answer increments `player.correctAnswers`, and `endSession(session)` returns rankings by points and by correct answers.
- [ ] Run `node game.test.js`; expect failure because `correctAnswers` and `endSession` do not exist.
- [ ] Initialize `correctAnswers: 0` in `createSession`; increment it only in the correct branch of `submitBet`; add `endSession(session)` that returns `{ pointRanking, knowledgeRanking }` and locks further bets.
- [ ] Add a visible `#end-session` control and a `#session-summary` dialog with temporary point ranking and a continuation button.
- [ ] Run `node game.test.js`; expect pass.

### Task 2: Draw interaction and visual assets

**Files:**
- Create: `assets/generated/draw-box.png`, `assets/generated/draw-stick.png`
- Modify: `index.html`, `styles.css`, `animations.css`, `game.js`, `game.test.js`

- [ ] Generate a transparent Vietnamese-style lottery-stick box and a separate draw stick; preserve no text in either asset.
- [ ] Write a failing test that `drawPenalty(session, playerId)` returns the removed balance and leaves that player's balance at zero.
- [ ] Run `node game.test.js`; expect failure because `drawPenalty` does not exist.
- [ ] Add a draw dialog with drag-to-pull stick interaction, glittering ×2/×5/×10 bait badges around the box, and a result stating the player loses all simulated points; call `drawPenalty` only after the stick is pulled.
- [ ] Show an explicit `Xác nhận` button after the loss result. Its click must close the draw dialog, return to the temporary point ranking, and re-render its rank order and displayed balances before any final-ranking continuation is offered.
- [ ] Run `node game.test.js`; expect pass.

### Task 3: Legal-awareness dialog and final knowledge ranking

**Files:**
- Modify: `index.html`, `styles.css`, `game.js`, `game.test.js`

- [ ] Write a failing test that final knowledge ranking sorts `correctAnswers` descending independently of point balance.
- [ ] Run `node game.test.js`; expect failure if rankings are still point-based.
- [ ] Add a legal-awareness popup before the final board, with a top-left acknowledgement checkbox. State that illegal gambling involving money/property may be administratively sanctioned under point a, clause 2, Article 28 of Decree 144/2021/NĐ-CP; include financial, social-order, and dependency harms.
- [ ] Require acknowledgement to open the final board, then render player rank, correct-answer count, and knowledge-first message.
- [ ] Run `node game.test.js`; expect pass.

## Self-review

- Temporary points, forced point loss, bait badges, legal popup, acknowledgement, and knowledge ranking each have a task.
- Names are consistent: `correctAnswers`, `endSession`, and `drawPenalty`.
- The legal copy distinguishes the simulation from gambling involving money/property.
