function openLexicon(packId = "") {
  const pack = window.wordPacks.find((p) => p.id === packId);
  studyShell("Kho từ thông dụng");
  let band = Object.hasOwn({ A1: 1, A2: 1, B1: 1, B2: 1 }, level)
      ? level
      : { Kids3: "A1", Kids6: "A1", Office: "B1", IELTS: "B2" }[level],
    page = 0;
  const posNames = {
    n: "danh từ",
    v: "động từ",
    adjective: "tính từ",
    noun: "danh từ",
    verb: "động từ",
    adverb: "trạng từ",
    adj: "tính từ",
    adv: "trạng từ",
    pron: "đại từ",
    prep: "giới từ",
    conj: "liên từ",
    det: "từ hạn định",
    phrase: "cụm từ",
  };
  if (pack) band = "";
  const words = window.lexicon;
  const memberWords = new Set(
    pack?.entries.map((v) => v[0].toLowerCase()) || [],
  );
  content.innerHTML =
    '<div class="lessonPath"><button id="backLex" class="subtle">← Từ vựng</button><span>' +
    words.length.toLocaleString("vi-VN") +
    ' từ</span></div><div class="toolsRow"><label class="field">Trình độ<select id="lexBand"><option value="">Tất cả</option>' +
    ["A1", "A2", "B1", "B2"].map((b) => "<option>" + b + "</option>").join("") +
    '</select></label><label class="field">Tìm theo từ hoặc nghĩa<input id="lookup" type="search"></label></div><div class="toolsRow"><button id="reviseWords" class="primary">Ôn từ đang lọc</button><small id="lexStats"></small></div><div id="lexResults"></div><div id="pages" class="actionRow"></div><small>Từ nền tảng phân mức theo CEFR-J. Cụm từ theo chủ đề có mức học do TN đề xuất. <a href="word-source/README.md" target="_blank" rel="noopener">Nguồn dữ liệu và giấy phép</a></small>';
  $("#backLex").onclick = openWordPacks;
  const intro = document.createElement("div");
  intro.innerHTML =
    '<label class="field">Bộ từ theo chủ đề<select id="lexPack"><option value="">Tất cả từ thông dụng</option>' +
    window.wordPacks
      .map(
        (p) =>
          '<option value="' +
          p.id +
          '">' +
          escapeHTML(p.title) +
          " · " +
          p.entries.length +
          " thẻ</option>",
      )
      .join("") +
    "</select></label>" +
    (pack
      ? '<p class="rule">Ví dụ theo chủ đề · ' +
        escapeHTML(pack.example) +
        "</p>"
      : "");
  content.insertBefore(intro, $("#lexResults"));
  $("#lexPack").value = packId;
  $("#lexPack").onchange = () => openLexicon($("#lexPack").value);
  $("#lexBand").value = band;
  function filtered() {
    const q = foldText($("#lookup").value);
    return words.filter(
      (w) =>
        (!pack || memberWords.has(w[0].toLowerCase())) &&
        (!band || w[2] === band) &&
        (!q || foldText(w[0] + " " + w[1]).includes(q)),
    );
  }
  function key(w) {
    return "lex-" + w[0].toLowerCase().replace(/[^a-z0-9]/g, "_");
  }
  function draw() {
    const found = filtered(),
      size = 18,
      max = Math.max(1, Math.ceil(found.length / size));
    page = Math.min(page, max - 1);
    $("#reviseWords").disabled = !found.length;
    if ($("#flashWords")) $("#flashWords").disabled = !found.length;
    $("#lexStats").textContent =
      found.length +
      " từ · " +
      found.filter((w) => state.completed.includes(key(w))).length +
      " từ đã ôn đúng";
    const visible = found.slice(page * size, page * size + size);
    $("#lexResults").innerHTML =
      visible
        .map(
          (w, i) =>
            '<div class="lexRow"><div><b>' +
            escapeHTML(w[0]) +
            "</b> <small>" +
            escapeHTML(w[3] || "") +
            " · " +
            escapeHTML(w[2]) +
            " · " +
            escapeHTML(posNames[w[4]] || w[4]) +
            "</small><p>" +
            escapeHTML(w[1]) +
            '</p></div><button class="subtle" data-word="' +
            i +
            '" aria-label="Nghe ' +
            escapeHTML(w[0]) +
            '">▶</button></div>',
        )
        .join("") || "<p>Chưa tìm thấy từ.</p>";
    $("#lexResults")
      .querySelectorAll("[data-word]")
      .forEach((b) => (b.onclick = () => speak(visible[+b.dataset.word][0])));
    $("#lexResults")
      .querySelectorAll(".lexRow")
      .forEach((row, i) => {
        const save = document.createElement("button");
        save.className = "subtle";
        save.textContent = "＋";
        save.setAttribute("aria-label", "Lưu " + visible[i][0]);
        save.onclick = () => openWordNote(visible[i][0], pack?.example || "");
        row.append(save);
      });
    $("#pages").innerHTML =
      '<button class="secondary" id="prev" ' +
      (!page ? "disabled" : "") +
      ">Trước</button><span>" +
      (page + 1) +
      " / " +
      max +
      '</span><button class="secondary" id="next" ' +
      (page + 1 >= max ? "disabled" : "") +
      ">Sau</button>";
    $("#prev").onclick = () => {
      page--;
      draw();
    };
    $("#next").onclick = () => {
      page++;
      draw();
    };
  }
  $("#lookup").oninput = () => {
    page = 0;
    draw();
  };
  $("#lexBand").onchange = () => {
    band = $("#lexBand").value;
    page = 0;
    draw();
  };
  const flash = document.createElement("button");
  flash.className = "secondary";
  flash.id = "flashWords";
  flash.textContent = "Lật thẻ từ";
  $("#reviseWords").after(flash);
  flash.onclick = () => {
    const selected = shuffled(filtered());
    if (selected.length)
      openWordFlashcards(selected, () => openLexicon(packId));
  };
  $("#reviseWords").onclick = () => {
    const found = filtered(),
      fresh = found.filter((w) => !state.completed.includes(key(w))),
      deck = shuffled(fresh.length ? fresh : found).slice(0, 10);
    let i = 0;
    function next() {
      const w = deck[i],
        alts = shuffled(words.filter((x) => x[2] === w[2] && x[1] !== w[1])),
        opts = [w[1]];
      for (const a of alts) {
        if (!opts.includes(a[1])) opts.push(a[1]);
        if (opts.length === 3) break;
      }
      const options = shuffled(opts);
      studyShell("Ôn từ thông dụng");
      content.innerHTML =
        '<button class="subtle" id="backWords">← Kho từ</button><small>Từ ' +
        (i + 1) +
        " / " +
        deck.length +
        " · " +
        w[2] +
        "</small><h3>" +
        escapeHTML(w[0]) +
        " " +
        escapeHTML(w[3] || "") +
        '</h3><button class="secondary" id="hearLex">Nghe từ</button>' +
        choices(options) +
        result;
      $("#hearLex").onclick = () => speak(w[0]);
      $("#backWords").onclick = () => openLexicon(packId);
      let passed = false;
      content.querySelectorAll("[data-answer]").forEach(
        (b) =>
          (b.onclick = async () => {
            if (passed) return;
            if (options[+b.dataset.answer] !== w[1]) {
              feedback("Hãy thử một nghĩa khác.");
              return;
            }
            passed = true;
            try {
              await save({ completed: [key(w)] });
              if (!b.isConnected) return;
              feedback("Đúng rồi. " + w[0] + " · " + w[1]);
              const n = document.createElement("button");
              n.className = "primary";
              n.textContent =
                i + 1 === deck.length ? "Hoàn thành lượt ôn" : "Từ tiếp theo";
              n.onclick = () => {
                if (++i < deck.length) next();
                else openLexicon(packId);
              };
              content.append(n);
            } catch (e) {
              passed = false;
              handleError(e);
            }
          }),
      );
    }
    if (deck.length) next();
  };
  draw();
}

function vocabularyKey(word) {
  return "lex-" + word.toLowerCase().replace(/[^a-z0-9]/g, "_");
}
function openWordPacks() {
  studyShell("Từ vựng theo chủ đề");
  content.innerHTML =
    "<p>" +
    window.lexicon.length.toLocaleString("vi-VN") +
    " từ và cụm từ · " +
    window.wordPacks.length +
    ' bộ chủ đề</p><div class="toolsRow"><button id="allVocabulary" class="primary">Mở toàn bộ kho từ</button><button id="pictureVocabulary" class="secondary">Nhìn hình đoán từ</button><button id="lessonVocabulary" class="secondary">Bài học từ vựng</button></div><label class="field">Lọc mức học<select id="packBand"><option value="">Tất cả trình độ</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option></select></label><div class="lessonList" id="packList"></div>';
  const actions = document.createElement("div");
  actions.className = "toolsRow";
  actions.innerHTML =
    '<button class="secondary" id="myNotebook">Sổ tay & từ đến hạn</button><button class="secondary" id="wordGames">Trò chơi ôn tập</button>';
  $("#packList").before(actions);
  $("#myNotebook").onclick = openNotebook;
  $("#wordGames").onclick = openPracticeGames;
  $("#allVocabulary").onclick = () => openLexicon();
  $("#pictureVocabulary").onclick = openPictures;
  $("#lessonVocabulary").onclick = () => openShelf("vocab");
  function draw() {
    const band = $("#packBand").value;
    $("#packList").innerHTML = window.wordPacks
      .filter((p) => !band || p.level === band)
      .map(
        (p) =>
          '<button class="libItem lessonItem" data-pack="' +
          p.id +
          '"><span><strong>' +
          escapeHTML(p.title) +
          "</strong><small>" +
          p.level +
          " · " +
          p.entries.length +
          " từ/cụm từ · " +
          p.entries.filter((w) => state.completed.includes(vocabularyKey(w[0])))
            .length +
          " đã ôn đúng</small></span><b>›</b></button>",
      )
      .join("");
    $("#packList")
      .querySelectorAll("[data-pack]")
      .forEach((b) => (b.onclick = () => openLexicon(b.dataset.pack)));
  }
  $("#packBand").onchange = draw;
  draw();
}
function openWordFlashcards(words, back) {
  let index = 0;
  function render() {
    const w = words[index];
    studyShell("Lật thẻ từ");
    content.innerHTML =
      '<button class="subtle" id="flashBack">← Kho từ</button><small>Thẻ ' +
      (index + 1) +
      " / " +
      words.length +
      " · " +
      w[2] +
      "</small><h3>" +
      escapeHTML(w[0]) +
      "</h3><small>" +
      escapeHTML(w[3] || "") +
      '</small><button class="secondary" id="flashHear">▶ Nghe phát âm</button><button class="primary" id="revealWord">Xem nghĩa</button><div id="wordMeaning" hidden class="rule">' +
      escapeHTML(w[1]) +
      '</div><div class="actionRow"><button class="secondary" id="flashPrev" ' +
      (!index ? "disabled" : "") +
      '>Trước</button><button class="secondary" id="flashNext">' +
      (index + 1 === words.length ? "Về kho từ" : "Thẻ tiếp theo") +
      "</button></div>";
    $("#flashBack").onclick = back;
    $("#flashHear").onclick = () => speak(w[0]);
    $("#revealWord").onclick = () => {
      $("#wordMeaning").hidden = false;
      $("#revealWord").hidden = true;
    };
    $("#flashPrev").onclick = () => {
      index--;
      render();
    };
    $("#flashNext").onclick = () => {
      if (++index === words.length) back();
      else render();
    };
  }
  render();
}
