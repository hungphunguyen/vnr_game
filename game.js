(function attachGameApi(global) {
  'use strict';

  const DEMOCRACY_QUESTIONS = [
    {
      id: 'democracy-easy-1',
      text: '[DỄ] Hai thành tố Hy Lạp cổ đại “demos” và “kratos” lần lượt có nghĩa là gì?',
      answers: ['Công dân và pháp luật', 'Nhân dân và quyền lực cai trị', 'Cộng đồng xã hội và sự bình đẳng', 'Nhà nước và quyền tự do'],
      correctIndex: 1,
      difficulty: 'easy',
    },
    {
      id: 'democracy-easy-2',
      text: '[DỄ] Theo quan điểm Mác – Lênin, dân chủ được nhìn nhận trên ba phương diện nào?',
      answers: ['Một mô hình kinh tế, một hệ tư tưởng chính trị và một truyền thống văn hóa xã hội chung', 'Một quyền cá nhân, một phương thức sản xuất và một thiết chế pháp lý', 'Một giá trị đạo đức, một chế độ sở hữu và một phương thức bầu cử', 'Quyền lực thuộc về nhân dân, một thể chế nhà nước và một nguyên tắc tổ chức xã hội'],
      correctIndex: 3,
      difficulty: 'easy',
    },
    {
      id: 'democracy-easy-3',
      text: '[DỄ] Mốc nào đánh dấu nền dân chủ xã hội chủ nghĩa chính thức được xác lập?',
      answers: ['Cách mạng Tháng Mười Nga thắng lợi năm 1917', 'Công xã Paris được thành lập vào năm 1871', 'Dân chủ tư sản xuất hiện cuối thế kỷ XIV–XV', 'Xã hội công xã nguyên thủy hình thành dân chủ quân sự'],
      correctIndex: 0,
      difficulty: 'easy',
    },
    {
      id: 'democracy-easy-4',
      text: '[DỄ] Vì sao dân chủ, xét như một hình thức nhà nước, là một phạm trù lịch sử?',
      answers: ['Vì nội dung dân chủ thay đổi theo nhận thức chính trị của từng cộng đồng', 'Vì các kiểu dân chủ duy trì nội dung tương đối ổn định dù cơ cấu giai cấp biến đổi', 'Vì dân chủ gắn với sự tồn tại của nhà nước và biến đổi theo điều kiện lịch sử', 'Vì dân chủ xuất hiện trước nhà nước và hoàn thiện khi xã hội hình thành sự phân chia giai cấp'],
      correctIndex: 2,
      difficulty: 'easy',
    },
    {
      id: 'democracy-easy-5',
      text: '[DỄ] Bản chất chính trị của nền dân chủ xã hội chủ nghĩa được khái quát đúng nhất thế nào?',
      answers: ['Quyền lực thuộc giai cấp tư sản và được thực hiện thông qua nhà nước tư sản', 'Mang bản chất giai cấp công nhân, do Đảng Cộng sản lãnh đạo và phục vụ nhân dân', 'Quyền lực mang tính trung lập giai cấp và ưu tiên sự ổn định của các thiết chế xã hội', 'Nhân dân chủ yếu thực hiện quyền lực trực tiếp, còn thiết chế đại diện giữ vai trò hỗ trợ'],
      correctIndex: 1,
      difficulty: 'easy',
    },
    {
      id: 'democracy-easy-6',
      text: '[DỄ] Cơ sở kinh tế chủ yếu của nền dân chủ xã hội chủ nghĩa là gì?',
      answers: ['Sở hữu xã hội đối với những tư liệu sản xuất chủ yếu', 'Sở hữu tư nhân đối với phần lớn tư liệu sản xuất chủ yếu', 'Sở hữu hỗn hợp với khu vực tư nhân giữ vai trò chi phối nền kinh tế', 'Sở hữu nhà nước đối với tư liệu sản xuất chủ yếu và phân phối bình quân'],
      correctIndex: 0,
      difficulty: 'easy',
    },
    {
      id: 'democracy-easy-7',
      text: '[DỄ] Theo nội dung về Luật Thực hiện dân chủ ở cơ sở năm 2022, việc nào người dân có thể bàn và quyết định trực tiếp?',
      answers: ['Phương án quy hoạch đất đai thuộc thẩm quyền phê duyệt của cấp tỉnh', 'Dự toán thu chi ngân sách thuộc thẩm quyền quyết định của Hội đồng nhân dân', 'Kế hoạch đầu tư công thuộc thẩm quyền quyết định của cơ quan nhà nước', 'Mức đóng góp xây dựng cơ sở hạ tầng do cộng đồng dân cư thống nhất'],
      correctIndex: 3,
      difficulty: 'easy',
    },
    {
      id: 'democracy-hard-1',
      text: '[CỰC KHÓ] Chuỗi lập luận nào tái hiện đầy đủ nhất lý do dân chủ là một phạm trù lịch sử?',
      answers: ['Điều kiện lịch sử đổi thay → quyền con người mở rộng → các kiểu nhà nước dần tương đồng → nội dung dân chủ ổn định', 'Lực lượng sản xuất phát triển → văn hóa nâng cao → vai trò giai cấp suy giảm → dân chủ biến đổi chủ yếu về kỹ thuật', 'Điều kiện lịch sử đổi thay → cơ cấu giai cấp và nhà nước biến đổi → chủ thể, phạm vi, cách thực hiện dân chủ đổi theo', 'Hình thức nhà nước thay đổi → bầu cử mở rộng → quan hệ sở hữu điều chỉnh → dân chủ phát triển độc lập với cơ cấu giai cấp'],
      correctIndex: 2,
      difficulty: 'hard',
    },
    {
      id: 'democracy-hard-2',
      text: '[CỰC KHÓ] Mệnh đề “dân chủ sẽ mất đi khi nhà nước tiêu vong” chỉ trực tiếp đúng với phương diện nào của dân chủ?',
      answers: ['Dân chủ với tư cách một hình thức hoặc thể chế nhà nước', 'Dân chủ với tư cách giá trị phản ánh các quyền cơ bản của con người', 'Dân chủ với tư cách nguyên tắc tổ chức và quản lý đời sống xã hội', 'Dân chủ với tư cách thành quả văn hóa được nhân loại kế thừa'],
      correctIndex: 0,
      difficulty: 'hard',
    },
    {
      id: 'democracy-hard-3',
      text: '[CỰC KHÓ] Một mô hình nhấn mạnh công hữu tư liệu sản xuất chủ yếu, phân phối theo kết quả lao động và bảo đảm lợi ích người lao động. Tổ hợp này trực tiếp chứng minh mặt bản chất nào?',
      answers: ['Bản chất chính trị, vì xác định lực lượng lãnh đạo và chủ thể quyền lực nhà nước', 'Bản chất xã hội, vì dung hòa lợi ích cá nhân, tập thể và lợi ích toàn xã hội', 'Bản chất tư tưởng, vì xác định nền tảng Mác – Lênin và các giá trị được kế thừa', 'Bản chất kinh tế, vì liên kết chế độ sở hữu, nguyên tắc phân phối và lợi ích lao động'],
      correctIndex: 3,
      difficulty: 'hard',
    },
    {
      id: 'democracy-hard-4',
      text: '[CỰC KHÓ] Chính quyền công khai quỹ đóng góp, cộng đồng biểu quyết mức đóng và Ban Giám sát đầu tư theo dõi công trình. Chuỗi quyền nào được thể hiện đúng thứ tự?',
      answers: ['Được biết → tham gia ý kiến → thụ hưởng kết quả', 'Được biết → quyết định trực tiếp → kiểm tra, giám sát', 'Tham gia ý kiến → ủy quyền quyết định → yêu cầu giải trình', 'Quyết định trực tiếp → được thông tin → phản biện xã hội'],
      correctIndex: 1,
      difficulty: 'hard',
    },
    {
      id: 'democracy-hard-5',
      text: '[CỰC KHÓ] Nhận định nào so sánh đầy đủ nhất bản chất dân chủ xã hội chủ nghĩa và dân chủ tư sản theo nội dung thuyết trình?',
      answers: ['Hai mô hình khác nhau về bản chất giai cấp, cơ sở sở hữu và lợi ích hướng tới, dù đều tổ chức quyền lực bằng thiết chế nhà nước', 'Hai mô hình cùng xác định nhân dân là chủ thể theo một nghĩa tương đồng; khác biệt chủ yếu nằm ở cơ chế đại diện và bầu cử', 'Hai mô hình khác nhau về lực lượng lãnh đạo, còn cơ sở sở hữu và lợi ích hướng tới không phải tiêu chí quyết định bản chất', 'Dân chủ tư sản gắn với tư hữu, dân chủ xã hội chủ nghĩa gắn với công hữu; do đó khác biệt tập trung ở cơ sở kinh tế'],
      correctIndex: 0,
      difficulty: 'hard',
    },
    {
      id: 'democracy-hard-6',
      text: '[CỰC KHÓ] Cách kết luận nào thận trọng và chính xác nhất khi đối chiếu ví dụ dân chủ cơ sở ở Việt Nam với vụ Citizens United tại Hoa Kỳ?',
      answers: ['Hai ví dụ có thể dùng để xếp hạng mức độ dân chủ của hai mô hình mà chưa cần thêm dữ kiện về cấu trúc quyền lực', 'Hai ví dụ cho thấy khác biệt cốt lõi nằm ở chủ thể tham gia, nên cơ sở kinh tế không ảnh hưởng đến kết luận về bản chất', 'Hai ví dụ minh họa cách tham gia quyền lực khác nhau, nhưng phải đặt trong toàn bộ cơ cấu giai cấp, kinh tế và nhà nước để kết luận về bản chất', 'Hai ví dụ cho thấy cơ chế pháp lý khác nhau nhưng bản chất tương đồng vì cả hai đều mở rộng sự tham gia chính trị'],
      correctIndex: 2,
      difficulty: 'hard',
    },
    {
      id: 'democracy-hard-7',
      text: '[CỰC KHÓ] Một sinh viên phát hiện vấn đề chung nhưng thông tin chưa được kiểm chứng. Cách xử lý nào thể hiện đầy đủ nhất việc thực hành dân chủ có trách nhiệm?',
      answers: ['Công bố thông tin kèm cảnh báo chưa kiểm chứng để huy động thảo luận, rồi bổ sung chứng cứ sau', 'Kiểm chứng thông tin, góp ý qua kênh phù hợp, đối thoại trên căn cứ pháp luật và chịu trách nhiệm về phát ngôn', 'Gửi phản ánh nặc danh đến nhiều cơ quan để giảm trách nhiệm cá nhân và tăng khả năng được xử lý', 'Chờ cơ quan quản lý công bố kết luận chính thức rồi mới tham gia góp ý, nhằm tránh phát ngôn gây tranh luận trong cộng đồng'],
      correctIndex: 1,
      difficulty: 'hard',
    },
  ];

  const DIFFICULTIES = {
    easy: { label: 'Dễ', selectionCount: 1, pointsPerMatch: 1 },
    hard: { label: 'Khó', selectionCount: 3, pointsPerMatch: 1.5 },
  };

  const createTurnState = () => ({ difficulty: null, answered: false, correct: false, symbols: [] });

  const CONFIG = {
    difficulties: DIFFICULTIES,
    questionDurationMs: 10000,
    symbols: [
      { id: 'bau', label: 'Bầu' },
      { id: 'cua', label: 'Cua' },
      { id: 'tom', label: 'Tôm' },
      { id: 'ca', label: 'Cá' },
      { id: 'ga', label: 'Gà' },
      { id: 'nai', label: 'Nai' },
    ],
    questions: DEMOCRACY_QUESTIONS,
  };

  function createSession(names) {
    const cleanNames = names.map((name) => String(name).trim()).filter(Boolean);
    if (cleanNames.length < 1) throw new Error('Cần có ít nhất một người chơi.');
    const questionLimit = Math.min(...Object.keys(DIFFICULTIES).map((difficulty) => CONFIG.questions.filter((question) => question.difficulty === difficulty).length));
    if (cleanNames.length > questionLimit) throw new Error('Số người chơi vượt quá số câu hỏi của một mức.');
    return {
      players: cleanNames.map((name, id) => ({ id, name, score: 0, correctAnswers: 0, hardCorrectAnswers: 0, correctAnswerTimeMs: 0, drawUsed: false })),
      round: null,
      nextRoundNumber: 1,
    };
  }

  function startRound(session, random = Math.random) {
    if (!session || !session.players) throw new Error('Phiên chơi không hợp lệ.');
    session.round = {
      number: session.nextRoundNumber++,
      dice: null,
      order: session.players.map((player) => player.id),
      turnIndex: 0,
      usedQuestionIds: [],
      question: null,
      turnState: createTurnState(),
      bets: [],
      phase: 'intro',
      random,
    };
    return session.round;
  }

  function rollDice(session) {
    if (!session?.round || session.round.dice) return session?.round?.dice || null;
    session.round.dice = Array.from({ length: 3 }, () => CONFIG.symbols[Math.floor(session.round.random() * CONFIG.symbols.length)].id);
    return session.round.dice;
  }

  function currentPlayer(session) {
    if (!session?.round || session.round.phase !== 'betting') return null;
    const id = session.round.order[session.round.turnIndex];
    return session.players.find((player) => player.id === id) || null;
  }

  function openBetting(session) {
    if (!session?.round || session.round.phase !== 'intro') return false;
    session.round.phase = 'betting';
    return true;
  }

  function getCurrentQuestion(session) {
    const round = session?.round;
    if (!round || round.phase !== 'betting') return null;
    if (round.question) return round.question;
    const difficulty = round.turnState.difficulty;
    if (!difficulty) return null;
    const choices = CONFIG.questions.filter((question) => question.difficulty === difficulty && !round.usedQuestionIds.includes(question.id));
    if (!choices.length) throw new Error('Đã dùng hết câu hỏi cho vòng này.');
    round.question = choices[Math.floor(round.random() * choices.length)];
    return round.question;
  }

  function chooseDifficulty(session, difficulty) {
    const turn = session?.round?.turnState;
    if (!currentPlayer(session) || !DIFFICULTIES[difficulty] || turn.difficulty) throw new Error('Không thể chọn mức câu hỏi cho lượt này.');
    turn.difficulty = difficulty;
    return getCurrentQuestion(session);
  }

  function advanceTurn(session) {
    if (!session?.round || session.round.phase !== 'betting') return false;
    session.round.question = null;
    session.round.turnState = createTurnState();
    session.round.turnIndex += 1;
    if (session.round.turnIndex >= session.round.order.length) session.round.phase = 'revealing';
    return true;
  }

  function submitAnswer(session, answerIndex, responseTimeMs = 0) {
    const turn = session?.round?.turnState;
    if (!currentPlayer(session) || !turn?.difficulty || turn.answered) throw new Error('Không có lượt trả lời hợp lệ.');
    const question = getCurrentQuestion(session);
    session.round.usedQuestionIds.push(question.id);
    const timedOut = Number(responseTimeMs) >= CONFIG.questionDurationMs;
    const correct = !timedOut && Number(answerIndex) === question.correctIndex;
    turn.answered = true;
    turn.correct = correct;
    if (correct) {
      const player = currentPlayer(session);
      player.correctAnswers += 1;
      if (question.difficulty === 'hard') player.hardCorrectAnswers += 1;
      player.correctAnswerTimeMs += Math.min(CONFIG.questionDurationMs, Math.max(0, Number(responseTimeMs) || 0));
    }
    return { correct, question };
  }

  function toggleBetSymbol(session, symbol) {
    const turn = session?.round?.turnState;
    if (!currentPlayer(session) || !turn?.answered || !turn.correct) throw new Error('Bạn chưa trả lời đúng để chọn ô cược.');
    if (!CONFIG.symbols.some((item) => item.id === symbol)) throw new Error('Ô cược không hợp lệ.');
    const selectedIndex = turn.symbols.indexOf(symbol);
    if (selectedIndex >= 0) turn.symbols.splice(selectedIndex, 1);
    else {
      const limit = DIFFICULTIES[turn.difficulty].selectionCount;
      if (turn.symbols.length >= limit) throw new Error(`Mức ${DIFFICULTIES[turn.difficulty].label} chỉ được chọn ${limit} ô.`);
      turn.symbols.push(symbol);
    }
    return [...turn.symbols];
  }

  function endTurn(session) {
    const player = currentPlayer(session);
    const turn = session?.round?.turnState;
    if (!player || !turn?.answered) return false;
    if (turn.correct) {
      const rule = DIFFICULTIES[turn.difficulty];
      if (turn.symbols.length !== rule.selectionCount) return false;
      session.round.bets.push({ playerId: player.id, difficulty: turn.difficulty, symbols: [...turn.symbols], pointsPerMatch: rule.pointsPerMatch });
    }
    return advanceTurn(session);
  }

  function beginReveal(session) {
    if (!session?.round || session.round.phase !== 'revealing') return false;
    session.round.phase = 'revealing-animation';
    return true;
  }

  function settleRound(session) {
    if (!session?.round || session.round.phase !== 'revealing-animation') throw new Error('Chưa thể công bố kết quả.');
    const counts = Object.fromEntries(CONFIG.symbols.map((symbol) => [symbol.id, 0]));
    session.round.dice.forEach((symbol) => { counts[symbol] += 1; });
    const awards = Object.fromEntries(session.players.map((player) => [player.id, 0]));
    session.round.bets.forEach((bet) => {
      const matches = session.round.dice.filter((symbol) => bet.symbols.includes(symbol)).length;
      awards[bet.playerId] += matches * bet.pointsPerMatch;
    });
    session.players.forEach((player) => { player.score += awards[player.id]; });
    session.round.phase = 'settled';
    return { counts, awards };
  }

  function pointRanking(session) { return [...session.players].sort((a, b) => b.score - a.score || a.id - b.id); }
  function drawEligiblePlayerIds(session) { return pointRanking(session).slice(1, 3).map((player) => player.id); }
  function knowledgeRanking(session) {
    return [...session.players].sort((a, b) => b.hardCorrectAnswers - a.hardCorrectAnswers || b.correctAnswers - a.correctAnswers || a.correctAnswerTimeMs - b.correctAnswerTimeMs || a.id - b.id);
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

  function symbolSvg(id, className = '') {
    return `<img class="folk-image ${className}" src="assets/generated/${id}-v2.png" alt="" aria-hidden="true">`;
  }

  function dieSvg(id, className = '') {
    return `<span class="game-die ${className}" aria-label="${symbolByIdForSvg(id).label}">${symbolSvg(id)}</span>`;
  }

  function symbolByIdForSvg(id) { return CONFIG.symbols.find((symbol) => symbol.id === id) || CONFIG.symbols[0]; }

  function initGame() {
    if (!global.document) return;
    const $ = (id) => document.getElementById(id);
    const dom = {
      setup: $('setup-screen'), game: $('game-screen'), playerList: $('player-list'), addPlayer: $('add-player'), start: $('start-game'), setupError: $('setup-error'), music: $('game-music'),
      round: $('round-number'), turn: $('turn-label'), score: $('current-score'), queue: $('queue'),
      grid: $('symbol-grid'), boardInstruction: $('board-instruction'), selectionProgress: $('selection-progress'), easy: $('choose-easy'), hard: $('choose-hard'), betError: $('bet-error'), endTurn: $('end-turn'), reveal: $('reveal-button'), statuses: $('player-statuses'), status: $('status'), newRound: $('new-round'),
      questionDialog: $('question-dialog'), questionText: $('question-text'), questionTimer: $('question-timer'), questionStart: $('question-start'), answers: $('answer-options'), resultDialog: $('result-dialog'), resultDice: $('result-dice'), settlement: $('settlement'), resultNext: $('result-next-round'), stage: $('round-stage'), stageDice: $('stage-dice'), stageCopy: $('stage-copy'), stageBowl: $('stage-bowl'), stageContinue: $('stage-continue'),
      endSession: $('end-session'), summaryDialog: $('summary-dialog'), summaryList: $('summary-list'), summaryContinue: $('summary-continue'), drawDialog: $('draw-dialog'), drawScene: $('draw-scene'), drawUrn: $('draw-urn-button'), drawReveal: $('draw-reveal'), drawResult: $('draw-result'), drawConfirm: $('draw-confirm'), legalDialog: $('legal-dialog'), knowledgeShow: $('knowledge-show'), knowledgeDialog: $('knowledge-dialog'), knowledgeList: $('knowledge-list'),
    };
    let names = ['Người chơi 1', 'Người chơi 2'];
    let session = null;
    let audioContext = null;
    let questionTimerId = null;
    let questionStartedAt = 0;
    let questionDeadlineAt = 0;
    let questionLocked = false;
    let questionStarted = false;
    const questionDurationMs = CONFIG.questionDurationMs;
    const formatPoints = (value) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(Number(value))} điểm`;
    const formatQuizTime = (timeMs) => `${(Number(timeMs) / 1000).toFixed(1).replace('.', ',')} giây`;
    const now = () => global.performance?.now?.() ?? Date.now();
    const symbolById = (id) => CONFIG.symbols.find((symbol) => symbol.id === id);
    const setStatus = (message) => { dom.status.textContent = message; };
    const showSummary = () => { dom.summaryList.innerHTML = pointRanking(session).map((p, i) => `<p><strong>Hạng ${i + 1}. ${p.name}</strong> — ${formatPoints(p.score)} ${p.drawUsed ? '✓ Đã rút' : `<button class="draw-player" data-id="${p.id}" type="button"><img src="assets/generated/fortune-stick-icon.png" alt=""> Bốc thăm</button>`}</p>`).join(''); dom.summaryList.querySelectorAll('.draw-player').forEach((button) => button.addEventListener('click', () => { dom.drawUrn.dataset.id = button.dataset.id; dom.drawScene.className = 'draw-scene'; dom.drawReveal.hidden = true; dom.drawUrn.disabled = false; dom.drawResult.textContent = 'Chạm vào ống thăm để bắt đầu.'; dom.drawConfirm.hidden = true; dom.drawDialog.showModal(); })); };

    function clearQuestionTimer() {
      if (questionTimerId !== null) global.clearInterval(questionTimerId);
      questionTimerId = null;
      questionStartedAt = 0;
      questionDeadlineAt = 0;
      dom.questionTimer.classList.remove('is-urgent');
    }

    function updateQuestionTimer() {
      const seconds = Math.max(0, Math.ceil((questionDeadlineAt - now()) / 1000));
      dom.questionTimer.querySelector('strong').textContent = `${seconds} giây`;
      dom.questionTimer.classList.toggle('is-urgent', seconds <= 5);
    }

    function startQuestionTimer() {
      clearQuestionTimer();
      questionStartedAt = now();
      questionDeadlineAt = questionStartedAt + questionDurationMs;
      updateQuestionTimer();
      questionTimerId = global.setInterval(() => {
        if (now() >= questionDeadlineAt) answerQuestion(-1, true);
        else updateQuestionTimer();
      }, 200);
    }

    async function playShakeSound() {
      const AudioContext = global.AudioContext || global.webkitAudioContext;
      if (!AudioContext) return;
      audioContext ||= new AudioContext();
      await audioContext.resume();
      const startAt = audioContext.currentTime + 0.04;
      for (let beat = 0; beat < 5; beat += 1) {
        const noise = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.16, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let index = 0; index < data.length; index += 1) data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
        const filter = audioContext.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 650; filter.Q.value = 1.4;
        const gain = audioContext.createGain(); const at = startAt + beat * 0.42; gain.gain.setValueAtTime(0.8, at); gain.gain.exponentialRampToValueAtTime(0.01, at + 0.2);
        noise.buffer = buffer; noise.connect(filter).connect(gain).connect(audioContext.destination); noise.start(at);
        const knock = audioContext.createOscillator(); knock.type = 'triangle'; knock.frequency.setValueAtTime(165, at); knock.frequency.exponentialRampToValueAtTime(75, at + 0.12); knock.connect(gain); knock.start(at); knock.stop(at + 0.13);
      }
    }

    function renderSetup() {
      dom.playerList.innerHTML = '';
      names.forEach((name, index) => {
        const row = document.createElement('div'); row.className = 'player-entry';
        row.innerHTML = `<span>${index + 1}</span><input aria-label="Tên người chơi ${index + 1}" value="${name.replace(/"/g, '&quot;')}" /><button class="remove-player" type="button" aria-label="Xóa người chơi ${index + 1}">×</button>`;
        row.querySelector('input').addEventListener('input', (event) => { names[index] = event.target.value; });
        row.querySelector('button').addEventListener('click', () => { if (names.length > 1) { names.splice(index, 1); renderSetup(); } });
        dom.playerList.append(row);
      });
    }

    function renderBoard() {
      dom.grid.innerHTML = '';
      const turnState = session.round.turnState;
      const canSelect = session.round.phase === 'betting' && turnState.answered && turnState.correct;
      CONFIG.symbols.forEach((symbol) => {
        const selected = turnState.symbols.includes(symbol.id);
        const button = document.createElement('button'); button.type = 'button'; button.className = `symbol-cell${selected ? ' selected' : ''}`;
        button.disabled = !canSelect;
        button.setAttribute('aria-pressed', String(selected));
        button.innerHTML = `<span class="icon">${symbolSvg(symbol.id)}</span><span class="label">${symbol.label}</span>`;
        button.addEventListener('click', () => {
          try { toggleBetSymbol(session, symbol.id); dom.betError.textContent = ''; }
          catch (error) { dom.betError.textContent = error.message; }
          render();
        });
        dom.grid.append(button);
      });
    }

    function render() {
      const round = session.round;
      const player = currentPlayer(session);
      const betting = round.phase === 'betting';
      const turnState = round.turnState;
      const rule = turnState.difficulty ? DIFFICULTIES[turnState.difficulty] : null;
      const turnReady = betting && turnState.answered && (!turnState.correct || turnState.symbols.length === rule.selectionCount);
      dom.round.textContent = round.number;
      dom.turn.textContent = player ? player.name : round.phase === 'revealing' ? 'Chuẩn bị mở bát' : 'Vòng đã kết thúc';
      dom.score.textContent = player ? formatPoints(player.score) : '—';
      dom.queue.textContent = betting ? `Thứ tự còn lại: ${round.order.slice(round.turnIndex).map((id) => session.players[id].name).join(' → ')}` : 'Đã hoàn tất mọi lượt cược.';
      [dom.easy, dom.hard].forEach((button) => { button.disabled = !betting || turnState.difficulty !== null; });
      dom.easy.classList.toggle('is-selected', turnState.difficulty === 'easy');
      dom.hard.classList.toggle('is-selected', turnState.difficulty === 'hard');
      dom.boardInstruction.textContent = !betting ? 'Đã khóa lựa chọn' : !turnState.difficulty ? 'Hãy chọn mức câu hỏi trước' : !turnState.answered ? 'Đang trả lời câu hỏi' : !turnState.correct ? 'Không có lượt cược — hãy kết thúc lượt' : `Chọn đủ ${rule.selectionCount} ô cược`;
      dom.selectionProgress.textContent = turnState.correct ? `${turnState.symbols.length}/${rule.selectionCount} ô đã chọn` : '';
      dom.newRound.hidden = round.phase !== 'settled';
      dom.endTurn.hidden = round.phase !== 'betting';
      dom.endTurn.disabled = !turnReady;
      dom.reveal.hidden = round.phase !== 'revealing';
      renderBoard();
      dom.statuses.innerHTML = '';
      session.players.forEach((item) => {
        const betsText = round.bets.filter((bet) => bet.playerId === item.id).map((bet) => `${DIFFICULTIES[bet.difficulty].label}: ${bet.symbols.map((symbol) => symbolById(symbol).label).join(', ')}`).join(' · ');
        const activeSelection = player?.id === item.id && turnState.symbols.length ? `Đang chọn: ${turnState.symbols.map((symbol) => symbolById(symbol).label).join(', ')}` : '';
        const card = document.createElement('div'); card.className = `player-status${player?.id === item.id ? ' active' : ''}`;
        card.innerHTML = `<strong>${item.name}</strong><span id="score-${item.id}">${formatPoints(item.score)}</span><small>${betsText || activeSelection || 'Chưa có lựa chọn'}</small>`;
        dom.statuses.append(card);
      });
    }

    function openQuestion(difficulty) {
      let question;
      try { question = chooseDifficulty(session, difficulty); dom.betError.textContent = ''; }
      catch (error) { dom.betError.textContent = error.message; return; }
      dom.questionText.textContent = question.text; dom.answers.innerHTML = '';
      question.answers.forEach((answer, index) => {
        const option = document.createElement('button'); option.type = 'button'; option.className = 'answer-option'; option.disabled = true; option.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        option.addEventListener('click', () => answerQuestion(index)); dom.answers.append(option);
      });
      dom.questionDialog.showModal();
      questionLocked = false;
      questionStarted = false;
      clearQuestionTimer();
      dom.questionTimer.querySelector('strong').textContent = '10 giây';
      dom.questionStart.hidden = false;
    }

    function answerQuestion(index, timedOut = false) {
      if (questionLocked || !questionStarted) return;
      questionLocked = true;
      const responseTimeMs = questionStartedAt ? Math.min(questionDurationMs, Math.max(0, now() - questionStartedAt)) : 0;
      clearQuestionTimer();
      questionStarted = false;
      const result = submitAnswer(session, index, responseTimeMs);
      const rule = DIFFICULTIES[session.round.turnState.difficulty];
      dom.questionText.textContent = result.correct ? `Chính xác! Bạn được chọn ${rule.selectionCount} ô cược.` : timedOut ? 'Hết giờ! Bạn không được chọn ô cược trong lượt này.' : 'Chưa đúng! Bạn không được chọn ô cược trong lượt này.';
      dom.answers.innerHTML = '';
      global.setTimeout(() => { dom.questionDialog.close(); questionLocked = false; setStatus(result.correct ? `Hãy chọn đủ ${rule.selectionCount} ô rồi kết thúc lượt.` : timedOut ? 'Hết giờ: hãy kết thúc lượt.' : 'Trả lời sai: hãy kết thúc lượt.'); render(); }, 1100);
    }

    function playIntro() {
      dom.stageBowl.style.transform = ''; dom.stage.hidden = false; dom.stage.className = 'round-stage is-shaking'; dom.stageCopy.textContent = 'Úp bát · lắc lắc · mở hội'; playShakeSound();
      dom.stageDice.innerHTML = ['bau', 'cua', 'tom'].map((id) => dieSvg(id)).join('');
      global.setTimeout(() => { rollDice(session); dom.stage.hidden = true; openBetting(session); setStatus('Đến lượt người chơi đầu tiên chọn mức câu hỏi.'); render(); }, 2600);
    }

    function reveal() {
      beginReveal(session); dom.stage.hidden = false; dom.stage.className = 'round-stage is-awaiting-open'; dom.stageCopy.textContent = 'Giữ bát và kéo sang phải để mở kết quả'; dom.stageContinue.hidden = true;
      dom.stageDice.innerHTML = session.round.dice.map((id) => dieSvg(id)).join('');
      let startX = null; let opened = false;
      const openBowl = () => { if (opened) return; opened = true; dom.stageCopy.textContent = 'Kết quả đã mở — bấm tiếp tục để tính điểm'; dom.stageContinue.hidden = false; };
      dom.stageBowl.onpointerdown = (event) => { startX = event.clientX; dom.stageBowl.setPointerCapture(event.pointerId); dom.stageBowl.classList.add('is-dragging'); };
      dom.stageBowl.onpointermove = (event) => { if (startX === null) return; const slide = Math.max(0, Math.min(340, event.clientX - startX)); dom.stageBowl.style.transform = `translateX(${slide}px)`; if (slide > 190) openBowl(); };
      dom.stageBowl.onpointerup = () => { startX = null; dom.stageBowl.classList.remove('is-dragging'); };
      dom.stageBowl.onkeydown = (event) => { if (event.key === 'Enter' || event.key === ' ') openBowl(); };
    }

    function beginRound() { dom.betError.textContent = ''; setStatus('Kết quả xúc xắc đang được khóa trong bát.'); startRound(session); render(); playIntro(); }
    dom.addPlayer.addEventListener('click', () => { if (names.length < CONFIG.questions.length / 2) { names.push(`Người chơi ${names.length + 1}`); renderSetup(); } });
    dom.start.addEventListener('click', () => {
      try { session = createSession(names); dom.music.src = 'https://www.youtube.com/embed/pa-cRsAxPXA?autoplay=1&loop=1&playlist=pa-cRsAxPXA'; dom.setup.hidden = true; dom.game.hidden = false; beginRound(); }
      catch (error) { dom.setupError.textContent = error.message; }
    });
    dom.easy.addEventListener('click', () => openQuestion('easy'));
    dom.hard.addEventListener('click', () => openQuestion('hard'));
    dom.questionStart.addEventListener('click', () => {
      if (questionLocked || questionStarted) return;
      questionStarted = true;
      dom.questionStart.hidden = true;
      dom.answers.querySelectorAll('button').forEach((button) => { button.disabled = false; });
      startQuestionTimer();
    });
    dom.endTurn.addEventListener('click', () => { if (endTurn(session)) { dom.betError.textContent = ''; setStatus(currentPlayer(session) ? 'Đã kết thúc lượt. Người chơi tiếp theo hãy chọn mức câu hỏi.' : 'Đã hoàn tất mọi lượt.'); render(); } });
    dom.reveal.addEventListener('click', reveal);
    dom.stageContinue.addEventListener('click', () => { const settlement = settleRound(session); dom.stage.hidden = true; dom.resultDice.innerHTML = session.round.dice.map((id) => `<div class="result-die">${dieSvg(id)}<small>${symbolById(id).label}</small></div>`).join(''); const lines = session.players.map((player) => `${player.name}: +${formatPoints(settlement.awards[player.id])} · tổng ${formatPoints(player.score)}`); dom.settlement.innerHTML = lines.join('<br>'); render(); dom.resultDialog.showModal(); });
    dom.newRound.addEventListener('click', beginRound);
    dom.resultNext.addEventListener('click', () => { dom.resultDialog.close(); beginRound(); });
    dom.endSession.addEventListener('click', () => { showSummary(); dom.summaryDialog.showModal(); });
    const revealDraw = () => { dom.drawScene.classList.remove('is-shaking'); dom.drawScene.classList.add('is-fading'); dom.drawReveal.hidden = false; global.setTimeout(() => { dom.drawScene.classList.add('is-revealed'); const lost = drawPenalty(session, dom.drawUrn.dataset.id); if (lost === null) return; dom.drawResult.textContent = `Cây thăm cảnh báo: bạn mất toàn bộ ${formatPoints(lost)}.`; dom.drawConfirm.hidden = false; }, 1100); };
    dom.drawUrn.addEventListener('click', () => { if (dom.drawUrn.disabled) return; dom.drawUrn.disabled = true; dom.drawScene.classList.add('is-shaking'); global.setTimeout(revealDraw, 1100); });
    dom.drawConfirm.addEventListener('click', () => { dom.drawDialog.close(); showSummary(); });
    dom.summaryContinue.addEventListener('click', () => { dom.summaryDialog.close(); dom.legalDialog.showModal(); });
    dom.knowledgeShow.addEventListener('click', () => { dom.legalDialog.close(); dom.knowledgeList.innerHTML = knowledgeRanking(session).map((p, i) => `<p><strong>Hạng ${i + 1}. ${p.name}</strong> — ${p.correctAnswers} câu đúng · ${formatQuizTime(p.correctAnswerTimeMs)}</p>`).join(''); dom.knowledgeDialog.showModal(); });
    dom.questionDialog.addEventListener('cancel', (event) => event.preventDefault());
    renderSetup();
  }

  const api = { CONFIG, createSession, startRound, rollDice, openBetting, currentPlayer, getCurrentQuestion, chooseDifficulty, submitAnswer, toggleBetSymbol, advanceTurn, endTurn, beginReveal, settleRound, pointRanking, drawEligiblePlayerIds, knowledgeRanking, drawPenalty, symbolSvg, dieSvg, initGame };
  global.BauCuaGame = api;
  if (typeof module !== 'undefined') module.exports = api;
  if (global.document) global.document.addEventListener('DOMContentLoaded', initGame);
}(typeof window !== 'undefined' ? window : globalThis));
