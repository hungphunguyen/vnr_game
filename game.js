(function attachGameApi(global) {
  'use strict';

  const CONFIG = {
    startingBalance: 25,
    minimumBet: 5,
    previewCost: 15,
    symbols: [
      { id: 'bau', label: 'Bầu' },
      { id: 'cua', label: 'Cua' },
      { id: 'tom', label: 'Tôm' },
      { id: 'ca', label: 'Cá' },
      { id: 'ga', label: 'Gà' },
      { id: 'nai', label: 'Nai' },
    ],
    questions: [
      ['q1', 'Thủ đô của Việt Nam là?', ['Hà Nội', 'Huế', 'Đà Nẵng', 'Cần Thơ'], 0],
      ['q2', 'Bánh chưng thường có hình gì?', ['Tròn', 'Vuông', 'Tam giác', 'Lục giác'], 1],
      ['q3', 'Vịnh Hạ Long thuộc tỉnh nào?', ['Quảng Ninh', 'Ninh Bình', 'Lào Cai', 'Nghệ An'], 0],
      ['q4', 'Con gì gáy “ò ó o”?', ['Con mèo', 'Con gà trống', 'Con vịt', 'Con dê'], 1],
      ['q5', 'Ngày Quốc khánh Việt Nam là ngày nào?', ['30/4', '2/9', '20/11', '1/6'], 1],
      ['q6', 'Hoa sen là biểu tượng quen thuộc của?', ['Việt Nam', 'Nhật Bản', 'Hàn Quốc', 'Úc'], 0],
      ['q7', 'Món phở truyền thống thường dùng thịt gì?', ['Bò hoặc gà', 'Cá hồi', 'Cừu', 'Tôm hùm'], 0],
      ['q8', 'Tết Trung Thu thường có loại bánh nào?', ['Bánh mì', 'Bánh trung thu', 'Bánh xèo', 'Bánh tét'], 1],
      ['q9', 'Sông dài nhất Việt Nam là?', ['Sông Hồng', 'Sông Đồng Nai', 'Sông Mã', 'Sông Hương'], 1],
      ['q10', 'Nhạc cụ có nhiều dây, phổ biến ở Việt Nam?', ['Đàn bầu', 'Kèn trumpet', 'Trống snare', 'Sáo bagpipe'], 0],
      ['q11', 'Áo dài là trang phục truyền thống của?', ['Việt Nam', 'Ấn Độ', 'Tây Ban Nha', 'Brazil'], 0],
      ['q12', 'Truyện Thánh Gióng kể về nhân vật cưỡi?', ['Ngựa sắt', 'Voi trắng', 'Hổ vàng', 'Rồng xanh'], 0],
      ['q13', 'Chợ nổi nổi tiếng ở Cần Thơ tên là?', ['Cái Răng', 'Bến Thành', 'Đông Ba', 'Hàn'], 0],
      ['q14', 'Nước ta có bao nhiêu mùa rõ rệt ở miền Bắc?', ['Hai', 'Ba', 'Bốn', 'Sáu'], 2],
      ['q15', 'Loài cây cho quả dừa là?', ['Cây cau', 'Cây dừa', 'Cây chuối', 'Cây tre'], 1],
      ['q16', 'Trống đồng là di sản của nền văn hóa nào?', ['Đông Sơn', 'Sa Huỳnh', 'Óc Eo', 'Chăm Pa'], 0],
      ['q17', 'Màu nào có trên quốc kỳ Việt Nam?', ['Đỏ', 'Xanh lá', 'Tím', 'Cam'], 0],
      ['q18', 'Món nem rán còn được gọi là?', ['Chả giò', 'Bún chả', 'Bánh cuốn', 'Cơm tấm'], 0],
      ['q19', 'Đỉnh Fansipan thuộc dãy núi nào?', ['Hoàng Liên Sơn', 'Trường Sơn', 'Tam Đảo', 'Bạch Mã'], 0],
      ['q20', 'Loài vật tượng trưng cho năm Thìn là?', ['Rồng', 'Hổ', 'Ngựa', 'Dê'], 0],
    ].map(([id, text, answers, correctIndex]) => ({ id, text, answers, correctIndex })),
  };

  function createSession(names) {
    const cleanNames = names.map((name) => String(name).trim()).filter(Boolean);
    if (cleanNames.length < 1) throw new Error('Cần có ít nhất một người chơi.');
    if (cleanNames.length > CONFIG.questions.length) throw new Error('Số người chơi vượt quá số câu hỏi.');
    return {
      players: cleanNames.map((name, id) => ({ id, name, balance: CONFIG.startingBalance })),
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
      previewBuyerId: null,
      usedQuestionIds: [],
      question: null,
      bets: [],
      phase: 'intro',
      previewPayload: null,
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
    const choices = CONFIG.questions.filter((question) => !round.usedQuestionIds.includes(question.id));
    if (!choices.length) throw new Error('Đã dùng hết câu hỏi cho vòng này.');
    round.question = choices[Math.floor(round.random() * choices.length)];
    return round.question;
  }

  function advanceTurn(session) {
    if (!session?.round || session.round.phase !== 'betting') return false;
    session.round.question = null;
    session.round.turnIndex += 1;
    if (session.round.turnIndex >= session.round.order.length) session.round.phase = 'revealing';
    return true;
  }

  function buyPreview(session) {
    const player = currentPlayer(session);
    if (!player || session.round.previewBuyerId !== null || player.balance < CONFIG.previewCost) return false;
    player.balance -= CONFIG.previewCost;
    session.round.previewBuyerId = player.id;
    session.round.previewPayload = [...session.round.dice];
    const [buyerId] = session.round.order.splice(session.round.turnIndex, 1);
    session.round.order.push(buyerId);
    return true;
  }

  function consumePreview(session) {
    if (!session?.round || !session.round.previewPayload) return null;
    const payload = session.round.previewPayload;
    session.round.previewPayload = null;
    return payload;
  }

  function validateSelection(session, selection) {
    const player = currentPlayer(session);
    const amount = Number(selection?.amount);
    if (!player) throw new Error('Không có lượt cược hợp lệ.');
    if (!CONFIG.symbols.some((symbol) => symbol.id === selection?.symbol)) throw new Error('Hãy chọn một ô cược.');
    if (!Number.isInteger(amount) || amount < CONFIG.minimumBet) throw new Error(`Cược tối thiểu là ${CONFIG.minimumBet}.`);
    if (amount > player.balance) throw new Error('Số dư không đủ cho mức cược này.');
    return { player, amount };
  }

  function submitBet(session, selection, answerIndex) {
    const { player, amount } = validateSelection(session, selection);
    const question = getCurrentQuestion(session);
    session.round.usedQuestionIds.push(question.id);
    player.balance -= amount;
    const correct = Number(answerIndex) === question.correctIndex;
    if (correct) session.round.bets.push({ playerId: player.id, symbol: selection.symbol, amount });
    session.round.question = null;
    return { correct, question };
  }

  function endTurn(session) {
    if (!currentPlayer(session)) return false;
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
    const payouts = Object.fromEntries(session.players.map((player) => [player.id, 0]));
    session.round.bets.forEach((bet) => { payouts[bet.playerId] += bet.amount * counts[bet.symbol]; });
    session.players.forEach((player) => { player.balance += payouts[player.id]; });
    session.round.phase = 'settled';
    return { counts, payouts };
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
      round: $('round-number'), turn: $('turn-label'), balance: $('current-balance'), queue: $('queue'),
      grid: $('symbol-grid'), amount: $('bet-amount'), betForm: $('bet-form'), betError: $('bet-error'), preview: $('preview-button'), endTurn: $('end-turn'), reveal: $('reveal-button'), statuses: $('player-statuses'), status: $('status'), newRound: $('new-round'),
      questionDialog: $('question-dialog'), questionText: $('question-text'), answers: $('answer-options'), previewDialog: $('preview-dialog'), previewResult: $('preview-result-dice'), previewClose: $('preview-close'), resultDialog: $('result-dialog'), resultDice: $('result-dice'), settlement: $('settlement'), resultNext: $('result-next-round'), stage: $('round-stage'), stageDice: $('stage-dice'), stageCopy: $('stage-copy'), stageBowl: $('stage-bowl'), stageContinue: $('stage-continue'),
    };
    let names = ['Người chơi 1', 'Người chơi 2'];
    let session = null;
    let selectedSymbol = null;
    let audioContext = null;
    const money = (value) => `${Number(value).toLocaleString('vi-VN')} ⭐`;
    const symbolById = (id) => CONFIG.symbols.find((symbol) => symbol.id === id);
    const setStatus = (message) => { dom.status.textContent = message; };

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
      const bets = session.round.bets;
      CONFIG.symbols.forEach((symbol) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = `symbol-cell${selectedSymbol === symbol.id ? ' selected' : ''}`;
        const total = bets.filter((bet) => bet.symbol === symbol.id).reduce((sum, bet) => sum + bet.amount, 0);
        button.disabled = session.round.phase !== 'betting';
        button.innerHTML = `${total ? `<span class="bet-chip">${money(total)}</span>` : ''}<span class="icon">${symbolSvg(symbol.id)}</span><span class="label">${symbol.label}</span>`;
        button.addEventListener('click', () => { selectedSymbol = symbol.id; dom.betError.textContent = ''; renderBoard(); });
        dom.grid.append(button);
      });
    }

    function render() {
      const round = session.round;
      const player = currentPlayer(session);
      const betting = round.phase === 'betting';
      dom.round.textContent = round.number;
      dom.turn.textContent = player ? player.name : round.phase === 'revealing' ? 'Chuẩn bị mở bát' : 'Vòng đã kết thúc';
      dom.balance.textContent = player ? money(player.balance) : '—';
      dom.queue.textContent = betting ? `Thứ tự còn lại: ${round.order.slice(round.turnIndex).map((id) => session.players[id].name).join(' → ')}` : 'Đã hoàn tất mọi lượt cược.';
      dom.preview.disabled = !betting || round.previewBuyerId !== null || !player || player.balance < CONFIG.previewCost;
      dom.amount.disabled = !betting;
      dom.betForm.querySelector('button').disabled = !betting;
      dom.newRound.hidden = round.phase !== 'settled';
      dom.endTurn.hidden = round.phase !== 'betting';
      dom.reveal.hidden = round.phase !== 'revealing';
      renderBoard();
      dom.statuses.innerHTML = '';
      session.players.forEach((item) => {
        const betsText = round.bets.filter((bet) => bet.playerId === item.id).map((bet) => `${symbolById(bet.symbol).label} ${money(bet.amount)}`).join(', ');
        const card = document.createElement('div'); card.className = `player-status${player?.id === item.id ? ' active' : ''}`;
        card.innerHTML = `<strong>${item.name}</strong><span id="balance-${item.id}">${money(item.balance)}</span><small>${betsText || 'Chưa có cược'}</small>`;
        dom.statuses.append(card);
      });
      if (player && round.previewBuyerId === player.id && round.previewPayload && !dom.previewDialog.open) {
        dom.previewResult.innerHTML = round.previewPayload.map((id) => `<div class="result-die">${dieSvg(id)}<small>${symbolById(id).label}</small></div>`).join('');
        dom.previewDialog.showModal();
      }
    }

    function openQuestion() {
      const player = currentPlayer(session); const amount = Number(dom.amount.value);
      if (!selectedSymbol) { dom.betError.textContent = 'Hãy chọn một ô trên bàn cược.'; return; }
      if (!Number.isInteger(amount) || amount < CONFIG.minimumBet) { dom.betError.textContent = `Mức cược tối thiểu là ${money(CONFIG.minimumBet)}.`; return; }
      if (amount > player.balance) { dom.betError.textContent = 'Số dư không đủ cho mức cược này.'; return; }
      const question = getCurrentQuestion(session);
      dom.questionText.textContent = question.text; dom.answers.innerHTML = '';
      question.answers.forEach((answer, index) => {
        const option = document.createElement('button'); option.type = 'button'; option.className = 'answer-option'; option.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        option.addEventListener('click', () => answerQuestion(index)); dom.answers.append(option);
      });
      dom.questionDialog.showModal();
    }

    function answerQuestion(index) {
      const result = submitBet(session, { symbol: selectedSymbol, amount: Number(dom.amount.value) }, index);
      dom.questionText.textContent = result.correct ? 'Chính xác! Cược của bạn đã được ghi nhận.' : `Chưa đúng! Bạn bị trừ ${money(dom.amount.value)} và lượt cược này bị vô hiệu hóa.`;
      dom.answers.innerHTML = '';
      global.setTimeout(() => { dom.questionDialog.close(); selectedSymbol = null; setStatus(result.correct ? 'Đã ghi nhận cược.' : 'Trả lời sai: lượt cược đã bị vô hiệu hóa.'); render(); }, 1100);
    }

    function playIntro() {
      dom.stageBowl.style.transform = ''; dom.stage.hidden = false; dom.stage.className = 'round-stage is-shaking'; dom.stageCopy.textContent = 'Úp bát · lắc lắc · mở hội'; playShakeSound();
      dom.stageDice.innerHTML = ['bau', 'cua', 'tom'].map((id) => dieSvg(id)).join('');
      global.setTimeout(() => { rollDice(session); dom.stage.hidden = true; openBetting(session); setStatus('Đến lượt người chơi đầu tiên đặt cược.'); render(); }, 2600);
    }

    function reveal() {
      beginReveal(session); dom.stage.hidden = false; dom.stage.className = 'round-stage is-awaiting-open'; dom.stageCopy.textContent = 'Giữ bát và kéo sang phải để mở kết quả'; dom.stageContinue.hidden = true;
      dom.stageDice.innerHTML = session.round.dice.map((id) => dieSvg(id)).join('');
      let startX = null; let opened = false;
      const openBowl = () => { if (opened) return; opened = true; dom.stageCopy.textContent = 'Kết quả đã mở — bấm tiếp tục để thanh toán'; dom.stageContinue.hidden = false; };
      dom.stageBowl.onpointerdown = (event) => { startX = event.clientX; dom.stageBowl.setPointerCapture(event.pointerId); dom.stageBowl.classList.add('is-dragging'); };
      dom.stageBowl.onpointermove = (event) => { if (startX === null) return; const slide = Math.max(0, Math.min(340, event.clientX - startX)); dom.stageBowl.style.transform = `translateX(${slide}px)`; if (slide > 190) openBowl(); };
      dom.stageBowl.onpointerup = () => { startX = null; dom.stageBowl.classList.remove('is-dragging'); };
      dom.stageBowl.onkeydown = (event) => { if (event.key === 'Enter' || event.key === ' ') openBowl(); };
    }

    function beginRound() { selectedSymbol = null; dom.betError.textContent = ''; setStatus('Kết quả xúc xắc đang được khóa trong bát.'); startRound(session); render(); playIntro(); }
    dom.addPlayer.addEventListener('click', () => { if (names.length < CONFIG.questions.length) { names.push(`Người chơi ${names.length + 1}`); renderSetup(); } });
    dom.start.addEventListener('click', () => {
      try { session = createSession(names); dom.music.src = 'https://www.youtube.com/embed/LOzUAdwiiEU?autoplay=1&loop=1&playlist=LOzUAdwiiEU'; dom.setup.hidden = true; dom.game.hidden = false; beginRound(); }
      catch (error) { dom.setupError.textContent = error.message; }
    });
    dom.betForm.addEventListener('submit', (event) => { event.preventDefault(); openQuestion(); });
    dom.preview.addEventListener('click', () => { if (buyPreview(session)) { selectedSymbol = null; setStatus('Bạn đã trả phí xem trước và được chuyển xuống lượt cuối.'); render(); } });
    dom.previewClose.addEventListener('click', () => { consumePreview(session); dom.previewDialog.close(); setStatus('Đã đóng xem trước. Hãy chọn ô cược của bạn.'); render(); });
    dom.endTurn.addEventListener('click', () => { endTurn(session); selectedSymbol = null; setStatus('Đã kết thúc lượt.'); render(); });
    dom.reveal.addEventListener('click', reveal);
    dom.stageContinue.addEventListener('click', () => { const settlement = settleRound(session); dom.stage.hidden = true; dom.resultDice.innerHTML = session.round.dice.map((id) => `<div class="result-die">${dieSvg(id)}<small>${symbolById(id).label}</small></div>`).join(''); const lines = session.players.map((player) => `${player.name}: nhận ${money(settlement.payouts[player.id])} · còn ${money(player.balance)}`); dom.settlement.innerHTML = lines.join('<br>'); render(); dom.resultDialog.showModal(); });
    dom.newRound.addEventListener('click', beginRound);
    dom.resultNext.addEventListener('click', () => { dom.resultDialog.close(); beginRound(); });
    dom.questionDialog.addEventListener('cancel', (event) => event.preventDefault());
    renderSetup();
  }

  const api = { CONFIG, createSession, startRound, rollDice, openBetting, currentPlayer, getCurrentQuestion, advanceTurn, endTurn, buyPreview, consumePreview, submitBet, beginReveal, settleRound, symbolSvg, dieSvg, initGame };
  global.BauCuaGame = api;
  if (typeof module !== 'undefined') module.exports = api;
  if (global.document) global.document.addEventListener('DOMContentLoaded', initGame);
}(typeof window !== 'undefined' ? window : globalThis));
