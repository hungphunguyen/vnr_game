const assert = require("node:assert/strict");
const fs = require("node:fs");
const game = require("./game.js");

function scriptedRandom(values) {
  let index = 0;
  return () => values[index++ % values.length];
}

function run(name, test) {
  try {
    test();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}: ${error.message}`);
    process.exitCode = 1;
  }
}

run("creates players with initial funds only once", () => {
  const session = game.createSession(["An", "Bình"]);
  assert.deepEqual(
    session.players.map((player) => player.balance),
    [25, 25],
  );
  game.startRound(session, scriptedRandom([0, 0, 0]));
  game.startRound(session, scriptedRandom([0, 0, 0]));
  assert.deepEqual(
    session.players.map((player) => player.balance),
    [25, 25],
  );
});

run(
  "locks dice during intro and opens betting only after the intro ends",
  () => {
    const session = game.createSession(["An"]);
    game.startRound(session, scriptedRandom([0, 0.2, 0.4]));
    assert.equal(session.round.phase, "intro");
    assert.equal(game.currentPlayer(session), null);
    game.rollDice(session);
    assert.deepEqual(session.round.dice, ["bau", "cua", "tom"]);
    game.rollDice(session);
    game.openBetting(session);
    assert.equal(game.currentPlayer(session).name, "An");
  },
);

run(
  "locks dice before betting and moves preview buyer to the final turn",
  () => {
    const session = game.createSession(["An", "Bình", "Chi", "Dũng"]);
    game.startRound(session, scriptedRandom([0, 0.2, 0.4]));
    game.openBetting(session);
    const question = game.getCurrentQuestion(session);
    game.submitBet(
      session,
      { symbol: "bau", amount: 5 },
      question.correctIndex === 0 ? 1 : 0,
    ); // Bình is now current player.
    game.endTurn(session);
    game.rollDice(session);
    assert.deepEqual(session.round.dice, ["cua", "tom", "bau"]);
    assert.equal(game.buyPreview(session), true);
    assert.deepEqual(session.round.order, [0, 2, 3, 1]);
    assert.equal(session.players[1].balance, 10);
    assert.equal(session.round.previewBuyerId, 1);
    assert.deepEqual(game.consumePreview(session), ["cua", "tom", "bau"]);
    assert.equal(game.consumePreview(session), null);
  },
);

run("charges a wrong answer without saving a bet", () => {
  const session = game.createSession(["An"]);
  game.startRound(session, scriptedRandom([0, 0, 0, 0]));
  game.rollDice(session);
  game.openBetting(session);
  const question = game.getCurrentQuestion(session);
  const wrongIndex = question.correctIndex === 0 ? 1 : 0;
  const result = game.submitBet(
    session,
    { symbol: "bau", amount: 5 },
    wrongIndex,
  );
  assert.equal(result.correct, false);
  assert.equal(session.players[0].balance, 20);
  assert.deepEqual(session.round.bets, []);
  assert.deepEqual(session.round.usedQuestionIds, [question.id]);
});

run("pays one bet per matching die after a correct answer", () => {
  const session = game.createSession(["An"]);
  game.startRound(session, scriptedRandom([0, 0, 0, 0]));
  game.rollDice(session);
  game.openBetting(session);
  const question = game.getCurrentQuestion(session);
  const result = game.submitBet(
    session,
    { symbol: "bau", amount: 5 },
    question.correctIndex,
  );
  assert.equal(result.correct, true);
  game.endTurn(session);
  assert.equal(session.players[0].balance, 20);
  assert.throws(() => game.settleRound(session), /Chưa thể/);
  game.beginReveal(session);
  const settlement = game.settleRound(session);
  assert.equal(settlement.payouts[0], 15);
  assert.equal(session.players[0].balance, 35);
});

run("records response time only for correct quiz answers", () => {
  const session = game.createSession(["An"]);
  game.startRound(session, scriptedRandom([0, 0, 0, 0]));
  game.rollDice(session);
  game.openBetting(session);
  let question = game.getCurrentQuestion(session);
  game.submitBet(session, { symbol: "bau", amount: 5 }, question.correctIndex, 4200);
  assert.equal(session.players[0].correctAnswerTimeMs, 4200);
  const wrongSession = game.createSession(["Bình"]);
  game.startRound(wrongSession, scriptedRandom([0, 0, 0, 0]));
  game.rollDice(wrongSession);
  game.openBetting(wrongSession);
  question = game.getCurrentQuestion(wrongSession);
  game.submitBet(wrongSession, { symbol: "bau", amount: 5 }, question.correctIndex === 0 ? 1 : 0, 1800);
  assert.equal(wrongSession.players[0].correctAnswerTimeMs, 0);
});

run("ranks equal correct totals by the fastest accumulated response time", () => {
  const session = game.createSession(["Chậm", "Nhanh", "Ít câu"]);
  session.players[0].correctAnswers = 5;
  session.players[0].correctAnswerTimeMs = 8500;
  session.players[1].correctAnswers = 5;
  session.players[1].correctAnswerTimeMs = 4200;
  session.players[2].correctAnswers = 4;
  session.players[2].correctAnswerTimeMs = 100;
  assert.deepEqual(game.knowledgeRanking(session).map((player) => player.name), ["Nhanh", "Chậm", "Ít câu"]);
});

run("renders generated image assets and exposes no skip action", () => {
  assert.match(game.symbolSvg("cua"), /assets\/generated\/cua-v2\.png/);
  assert.match(game.dieSvg("bau"), /game-die/);
  assert.equal(game.skipTurn, undefined);
});

run("uses the selected YouTube track as game music", () => {
  const source = fs.readFileSync("game.js", "utf8");
  assert.match(source, /youtube\.com\/embed\/pa-cRsAxPXA\?autoplay=1&loop=1&playlist=pa-cRsAxPXA/);
});

run("keeps the game screen hidden during player setup", () => {
  const css = fs.readFileSync("animations.css", "utf8");
  assert.match(css, /#game-screen\[hidden\]\s*\{\s*display\s*:\s*none\s*!important/);
});

run("uses one clickable urn scene and no draggable fortune sticks", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const source = fs.readFileSync("game.js", "utf8");
  assert.match(html, /id="draw-urn-button"/);
  assert.match(html, /fortune-urn-five-sticks\.png/);
  assert.match(html, /id="draw-reveal"/);
  assert.match(source, /dom\.drawUrn\.addEventListener\('click'/);
  assert.doesNotMatch(source, /querySelectorAll\('\.draw-stick'\)/);
});

run("styles the draw as a large single-scene promotion", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(css, /#draw-dialog[^}]*max-width: 960px/);
  assert.match(css, /@keyframes fortune-urn-shake/);
  assert.match(css, /@keyframes fortune-urn-fade-out/);
  assert.match(css, /@keyframes fortune-stick-materialize/);
  assert.match(css, /\.draw-reveal \{[^}]*position: absolute/);
  assert.match(css, /animation: fortune-stick-materialize 1\.1s/);
  assert.doesNotMatch(css, /fortune-stick-materialize \{[^}]*translateY/);
  assert.match(css, /\.draw-scene\.is-revealed \.draw-urn-button[^}]*display: none/);
  assert.match(css, /#draw-reveal\[hidden\] \{ display: none; \}/);
  assert.match(html, /assets\/generated\/fortune-result-stick-engraved\.png/);
  assert.match(html, /assets\/generated\/draw-bait-x2-bubble\.png/);
  assert.match(html, /assets\/generated\/draw-bait-x5-bubble\.png/);
  assert.match(html, /assets\/generated\/draw-bait-x10-bubble\.png/);
  assert.doesNotMatch(html, /fortune-stick-long\.png/);
});

run("provides a 20-second countdown in the quiz dialog", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /id="question-timer"/);
  assert.match(html, /20 giây/);
  assert.match(css, /\.question-timer/);
  assert.match(css, /\.question-timer\.is-urgent/);
});

run("provides 100 questions limited to the corruption causes and impacts lesson", () => {
  assert.equal(game.CONFIG.questions.length, 100);
  assert.ok(game.CONFIG.questions.every((question) => question.id.startsWith("pctn-")));
  assert.ok(game.CONFIG.questions.every((question) => question.answers.length === 4));
  assert.ok(game.CONFIG.questions.every((question) => Number.isInteger(question.correctIndex)));
  assert.deepEqual(
    [0, 1, 2, 3].map((index) => game.CONFIG.questions.filter((question) => question.correctIndex === index).length),
    [25, 25, 25, 25],
  );
  assert.notDeepEqual(
    game.CONFIG.questions.slice(0, 8).map((question) => question.correctIndex),
    [1, 2, 3, 0, 1, 2, 3, 0],
  );
  const correctIsUniqueShortest = game.CONFIG.questions.filter((question) => {
    const correct = question.answers[question.correctIndex];
    const answerLengths = question.answers.map((answer) => answer.length);
    return correct.length === Math.min(...answerLengths) && answerLengths.filter((length) => length === correct.length).length === 1;
  });
  assert.ok(correctIsUniqueShortest.length < 30, 'Đáp án đúng không được thường xuyên là đáp án ngắn nhất một mình.');
  assert.ok(game.CONFIG.questions.flatMap((question) => question.answers).every((answer) => !/thời tiết|khí hậu|thể thao|lễ hội|địa hình/i.test(answer)));
});
