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
  game.startRound(session, scriptedRandom([0, 0, 0]));
  game.startRound(session, scriptedRandom([0, 0, 0]));
  assert.deepEqual(session.players.map((player) => player.score), [0, 0]);
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

run("splits questions evenly and selects the requested difficulty", () => {
  assert.equal(game.CONFIG.questions.filter((question) => question.difficulty === "easy").length, 7);
  assert.equal(game.CONFIG.questions.filter((question) => question.difficulty === "hard").length, 7);
  const session = readySession();
  assert.equal(game.chooseDifficulty(session, "hard").difficulty, "hard");
});

run("a wrong answer creates no bet and allows ending the turn", () => {
  const session = readySession();
  const question = game.chooseDifficulty(session, "easy");
  const wrongIndex = question.correctIndex === 0 ? 1 : 0;
  const result = game.submitAnswer(session, wrongIndex);
  assert.equal(result.correct, false);
  assert.deepEqual(session.round.bets, []);
  assert.deepEqual(session.round.usedQuestionIds, [question.id]);
  assert.equal(game.endTurn(session), true);
});

run("treats an answer at the 5-second deadline as timed out", () => {
  const session = readySession();
  const question = game.chooseDifficulty(session, "easy");
  const result = game.submitAnswer(session, question.correctIndex, 5000);
  assert.equal(result.correct, false);
  assert.equal(session.players[0].correctAnswers, 0);
  assert.equal(game.endTurn(session), true);
  assert.deepEqual(session.round.bets, []);
});

run("easy requires one symbol and records only one bet", () => {
  const session = readySession();
  const question = game.chooseDifficulty(session, "easy");
  game.submitAnswer(session, question.correctIndex);
  assert.deepEqual(game.toggleBetSymbol(session, "bau"), ["bau"]);
  assert.throws(() => game.toggleBetSymbol(session, "cua"), /1 ô/);
  assert.equal(game.endTurn(session), true);
  assert.deepEqual(session.round.bets[0], {
    playerId: 0,
    difficulty: "easy",
    symbols: ["bau"],
    pointsPerMatch: 1,
  });
  assert.throws(() => game.submitAnswer(session, question.correctIndex), /lượt trả lời/);
});

run("hard requires exactly three distinct symbols", () => {
  const session = readySession();
  const question = game.chooseDifficulty(session, "hard");
  game.submitAnswer(session, question.correctIndex);
  assert.deepEqual(game.toggleBetSymbol(session, "bau"), ["bau"]);
  assert.deepEqual(game.toggleBetSymbol(session, "cua"), ["bau", "cua"]);
  assert.equal(game.endTurn(session), false);
  assert.deepEqual(game.toggleBetSymbol(session, "tom"), ["bau", "cua", "tom"]);
  assert.equal(game.endTurn(session), true);
  assert.deepEqual(session.round.bets[0], {
    playerId: 0,
    difficulty: "hard",
    symbols: ["bau", "cua", "tom"],
    pointsPerMatch: 1.5,
  });
});

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
  const session = completedBet("easy", ["bau"], [0, 0, 0, 0]);
  const settlement = revealAndSettle(session);
  assert.equal(settlement.awards[0], 3);
  assert.equal(session.players[0].score, 3);
});

run("hard awards 1.5 points for every matching die including repeats", () => {
  const session = completedBet("hard", ["bau", "cua", "tom"], [0, 0, 0.2, 0]);
  const settlement = revealAndSettle(session);
  assert.equal(settlement.awards[0], 4.5);
  assert.equal(session.players[0].score, 4.5);
});

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

run("records response time only for correct quiz answers", () => {
  const session = readySession();
  let question = game.chooseDifficulty(session, "easy");
  game.submitAnswer(session, question.correctIndex, 4200);
  assert.equal(session.players[0].correctAnswerTimeMs, 4200);
  const wrongSession = readySession();
  question = game.chooseDifficulty(wrongSession, "hard");
  game.submitAnswer(wrongSession, question.correctIndex === 0 ? 1 : 0, 1800);
  assert.equal(wrongSession.players[0].correctAnswerTimeMs, 0);
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

run("renders generated image assets and exposes no skip action", () => {
  assert.match(game.symbolSvg("cua"), /assets\/generated\/cua-v2\.png/);
  assert.match(game.dieSvg("bau"), /game-die/);
  assert.equal(game.skipTurn, undefined);
});

run("uses the selected YouTube track as game music", () => {
  const source = fs.readFileSync("game.js", "utf8");
  assert.match(source, /youtube\.com\/embed\/pa-cRsAxPXA\?autoplay=1&loop=1&playlist=pa-cRsAxPXA/);
});

run("shows difficulty choices and removes money wager controls", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /id="choose-easy"/);
  assert.match(html, /id="choose-hard"/);
  assert.match(html, /1 ô × 1 điểm/);
  assert.match(html, /3 ô × 1,5 điểm/);
  assert.doesNotMatch(html, /id="bet-amount"|id="preview-button"|id="preview-dialog"/);
});

run("removes legacy star economy and preview actions", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.doesNotMatch(html, /Số dư|Cược tối thiểu|Trả 15|Xem trước kết quả|điểm mô phỏng|⭐/i);
  assert.equal(game.buyPreview, undefined);
  assert.equal(game.consumePreview, undefined);
  assert.ok(!("startingBalance" in game.CONFIG));
  assert.ok(!("minimumBet" in game.CONFIG));
  assert.ok(!("previewCost" in game.CONFIG));
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

run("summary derives draw controls from eligible ranks", () => {
  const source = fs.readFileSync("game.js", "utf8");
  assert.match(source, /drawEligiblePlayerIds\(session\)/);
  assert.match(source, /eligibleDrawIds\.has\(p\.id\)/);
});

run("draw dialog and knowledge dialog describe both new rules", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const source = fs.readFileSync("game.js", "utf8");
  assert.match(html, /giảm 70% điểm/i);
  assert.match(source, /result\.outcome === 'reduce-70'/);
  assert.match(source, /p\.hardCorrectAnswers/);
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

run("provides a 5-second countdown in the quiz dialog", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /id="question-timer"/);
  assert.match(html, /5 giây/);
  assert.match(css, /\.question-timer/);
  assert.match(css, /\.question-timer\.is-urgent/);
});

run("waits for an explicit start before the 5-second quiz countdown", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const source = fs.readFileSync("game.js", "utf8");
  assert.match(html, /id="question-start"/);
  assert.match(html, /Bắt đầu trả lời/);
  assert.match(html, /Còn <strong>5 giây<\/strong>/);
  assert.match(source, /questionDurationMs:\s*5000/);
  assert.match(source, /dom\.questionStart\.addEventListener\('click'/);
});

run("provides 14 balanced questions about democracy and socialist democracy", () => {
  assert.equal(game.CONFIG.questions.length, 14);
  assert.ok(game.CONFIG.questions.every((question) => question.id.startsWith("democracy-")));
  assert.ok(game.CONFIG.questions.every((question) => question.answers.length === 4));
  assert.ok(game.CONFIG.questions.every((question) => [0, 1, 2, 3].includes(question.correctIndex)));
  assert.deepEqual(
    [0, 1, 2, 3].map((slot) => game.CONFIG.questions.filter((question) => question.correctIndex === slot).length),
    [4, 4, 3, 3],
  );
  assert.ok(game.CONFIG.questions.every((question) => new Set(question.answers).size === 4));
  assert.ok(game.CONFIG.questions.every((question) => {
    const lengths = question.answers.map((answer) => answer.length);
    return Math.max(...lengths) - Math.min(...lengths) <= 45;
  }));
  const uniqueLongestCorrect = game.CONFIG.questions.filter((question) => {
    const lengths = question.answers.map((answer) => answer.length);
    const correctLength = lengths[question.correctIndex];
    return correctLength === Math.max(...lengths) && lengths.filter((length) => length === correctLength).length === 1;
  });
  const uniqueShortestCorrect = game.CONFIG.questions.filter((question) => {
    const lengths = question.answers.map((answer) => answer.length);
    const correctLength = lengths[question.correctIndex];
    return correctLength === Math.min(...lengths) && lengths.filter((length) => length === correctLength).length === 1;
  });
  assert.ok(uniqueLongestCorrect.length <= 3, 'Đáp án đúng không được thường xuyên là phương án dài nhất duy nhất.');
  assert.ok(uniqueShortestCorrect.length <= 3, 'Đáp án đúng không được thường xuyên là phương án ngắn nhất duy nhất.');
  assert.ok(game.CONFIG.questions.every((question) => question.answers.every((answer, index) => (
    index === question.correctIndex || !/\bmọi\b|tuyệt đối|không cần|không thừa nhận|xóa bỏ ngay/i.test(answer)
  ))), 'Phương án nhiễu không được dùng từ tuyệt đối để tự lộ là phương án sai.');
  assert.ok(game.CONFIG.questions.every((question) => !/tham nhũng|phòng, chống tham nhũng/i.test(`${question.text} ${question.answers.join(" ")}`)));
});
