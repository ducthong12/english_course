const gameSentences = () => {
  const all = Object.values(window.units)
    .flat()
    .map((row) => row[4]);
  return shuffled([...new Set(all)])
    .filter((s) => s.split(/ +/).length >= 4 && s.split(/ +/).length <= 14)
    .slice(0, 8);
};
function openPracticeGames() {
  studyShell("Trò chơi ôn từ");
  content.innerHTML =
    '<p>Chọn một cách luyện. Mỗi lượt có 8 câu, có thể chơi lại với bộ câu mới.</p><button class="libItem" id="spellGame"><strong>Nghe và viết từ</strong>Nghe phát âm rồi tự gõ từ tiếng Anh.</button><button class="libItem" id="meaningGame"><strong>Nhìn nghĩa chọn từ</strong>Chọn từ khớp với nghĩa tiếng Việt.</button><button class="libItem" id="sentenceGame"><strong>Xếp câu</strong>Chạm các mảnh từ để tạo lại câu mẫu.</button>';
  $("#spellGame").onclick = () => wordGame("spell");
  $("#meaningGame").onclick = () => wordGame("meaning");
  $("#sentenceGame").onclick = sentenceGame;
}
function wordGame(mode) {
  const band =
    { Kids3: "A1", Kids6: "A1", Office: "B1", IELTS: "B2" }[level] || level;
  const pool = window.lexicon.filter(
    (w) => w[2] === band && !w[0].includes(" "),
  );
  const deck = shuffled(pool).slice(0, 8);
  let index = 0,
    score = 0,
    wrong = [];
  function draw() {
    if (index === deck.length) {
      finishGame(score, deck.length, wrong);
      return;
    }
    const w = deck[index],
      options = shuffled([
        w,
        ...shuffled(pool.filter((x) => x[0] !== w[0] && x[1] !== w[1])).slice(
          0,
          2,
        ),
      ]);
    studyShell(mode === "spell" ? "Nghe và viết từ" : "Nhìn nghĩa chọn từ");
    content.innerHTML =
      "<small>Câu " +
      (index + 1) +
      " / " +
      deck.length +
      " · " +
      band +
      "</small>" +
      (mode === "spell"
        ? '<button class="primary" id="gameHear">▶ Nghe từ</button><form id="spellForm"><label class="field">Từ bạn nghe được<input id="spellInput" required autocomplete="off"></label><button class="secondary">Kiểm tra</button></form>'
        : "<h3>" +
          escapeHTML(w[1]) +
          "</h3>" +
          choices(options.map((x) => x[0]))) +
      '<p id="gameResult" role="status"></p>';
    let checked = false;
    function answer(ok) {
      if (checked) return;
      checked = true;
      if (ok) score++;
      else wrong.push(w[0] + " · " + w[1]);
      $("#gameResult").textContent =
        (ok ? "Đúng rồi. " : "Lần sau thử lại nhé. ") + w[0] + " · " + w[1];
      const b = document.createElement("button");
      b.className = "primary";
      b.textContent = "Tiếp theo";
      b.onclick = () => {
        index++;
        draw();
      };
      content.append(b);
    }
    if (mode === "spell") {
      $("#gameHear").onclick = () => speak(w[0]);
      $("#spellForm").onsubmit = (e) => {
        e.preventDefault();
        answer(
          normalizedAnswer($("#spellInput").value) === normalizedAnswer(w[0]),
        );
      };
    } else
      content
        .querySelectorAll("[data-answer]")
        .forEach(
          (b) =>
            (b.onclick = () => answer(options[Number(b.dataset.answer)] === w)),
        );
  }
  draw();
}
function sentenceGame() {
  const deck = gameSentences();
  let index = 0,
    score = 0,
    wrong = [];
  function draw() {
    if (index === deck.length) {
      finishGame(score, deck.length, wrong);
      return;
    }
    const target = deck[index],
      tokens = target.split(/ +/),
      pieces = shuffled(tokens.map((word, id) => ({ word, id })));
    let selected = [],
      checked = false;
    studyShell("Xếp câu");
    content.innerHTML =
      "<small>Câu " +
      (index + 1) +
      " / " +
      deck.length +
      '</small><button class="secondary" id="sentenceHear">▶ Nghe câu mẫu</button><p>Chạm từng từ để xếp câu. Chạm từ đã chọn để trả lại.</p><div id="builtSentence" class="wordTiles"></div><div id="sentencePieces" class="wordTiles"></div><button class="primary" id="checkSentence">Kiểm tra</button><p id="gameResult" role="status"></p>';
    function paint() {
      $("#builtSentence").innerHTML = selected
        .map(
          (p) =>
            '<button class="secondary" data-return="' +
            p.id +
            '">' +
            escapeHTML(p.word) +
            "</button>",
        )
        .join("");
      $("#sentencePieces").innerHTML = pieces
        .filter((p) => !selected.some((s) => s.id === p.id))
        .map(
          (p) =>
            '<button class="secondary" data-take="' +
            p.id +
            '">' +
            escapeHTML(p.word) +
            "</button>",
        )
        .join("");
      content.querySelectorAll("[data-take]").forEach(
        (b) =>
          (b.onclick = () => {
            if (!checked) {
              selected.push(
                pieces.find((p) => p.id === Number(b.dataset.take)),
              );
              paint();
            }
          }),
      );
      content.querySelectorAll("[data-return]").forEach(
        (b) =>
          (b.onclick = () => {
            if (!checked) {
              selected = selected.filter(
                (p) => p.id !== Number(b.dataset.return),
              );
              paint();
            }
          }),
      );
    }
    $("#sentenceHear").onclick = () => speak(target);
    $("#checkSentence").onclick = () => {
      if (checked) return;
      if (selected.length !== tokens.length) {
        $("#gameResult").textContent = "Hãy dùng đủ các mảnh từ.";
        return;
      }
      checked = true;
      const ok =
        normalizedAnswer(selected.map((p) => p.word).join(" ")) ===
        normalizedAnswer(target);
      if (ok) score++;
      else wrong.push(target);
      $("#gameResult").textContent =
        (ok ? "Chính xác. " : "Đối chiếu câu mẫu. ") + target;
      const b = document.createElement("button");
      b.className = "primary";
      b.textContent = "Tiếp theo";
      b.onclick = () => {
        index++;
        draw();
      };
      content.append(b);
    };
    paint();
  }
  draw();
}
function finishGame(score, total, wrong) {
  studyShell("Kết quả lượt luyện");
  content.innerHTML =
    "<h3>" +
    score +
    " / " +
    total +
    " câu đúng</h3>" +
    (wrong.length
      ? "<p>Cần ôn lại</p><ul>" +
        wrong.map((w) => "<li>" + escapeHTML(w) + "</li>").join("") +
        "</ul>"
      : "<p>Bạn đã hoàn thành tốt cả lượt.</p>") +
    '<button class="primary" id="againGame">Chơi lượt mới</button>';
  $("#againGame").onclick = openPracticeGames;
}
