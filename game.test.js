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

run("renders generated image assets and exposes no skip action", () => {
  assert.match(game.symbolSvg("cua"), /assets\/generated\/cua-v2\.png/);
  assert.match(game.dieSvg("bau"), /game-die/);
  assert.equal(game.skipTurn, undefined);
});

run("keeps the game screen hidden during player setup", () => {
  const css = fs.readFileSync("animations.css", "utf8");
  assert.match(css, /#game-screen\[hidden\]\s*\{\s*display\s*:\s*none\s*!important/);
});
