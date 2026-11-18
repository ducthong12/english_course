const foldText = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .trim();
const normalizedAnswer = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
function shuffled(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function recordAttempt(spec, correct) {
  const result = window.adaptive?.record({
    ...spec,
    questionId: spec.questionId || spec.lessonId,
    correct,
  });
  result?.catch?.((error) => console.warn(error.message));
}
function unitCourse(base, u) {
  const answers = shuffled([u.answer, u.wrong1, u.wrong2]);
  const requested = u.writing.match(/(\d+)\s*(?:từ|words)/i);
  const minimum = requested
    ? Number(requested[1])
    : {
        A1: 6,
        A2: 12,
        B1: 20,
        B2: 25,
        IELTS: 30,
        Office: 12,
        Kids6: 5,
        Kids3: 0,
      }[level];
  return {
    ...base,
    ...u,
    title: u.title,
    english: u.title,
    choices: answers,
    answer: answers.indexOf(u.answer),
    minWords: minimum,
    tip: "Nghe từ, dừng video và đọc lại cả câu ví dụ.",
  };
}
function studyShell(title) {
  stopReading();
  window.speechSynthesis?.cancel();
  if (!modal.open) modal.showModal();
  current = "study";
  $("#modalTitle").textContent = title;
  $("#modalLabel").textContent = "TN / " + labels[level];
  content.replaceChildren();
  modal.scrollTop = 0;
}
function goBack(skill) {
  const row = document.createElement("div");
  row.className = "lessonPath";
  row.innerHTML =
    '<button class="subtle">← Danh sách bài</button><span>' +
    escapeHTML(skillName(skill)) +
    "</span>";
  row.querySelector("button").onclick = () => openShelf(skill);
  content.prepend(row);
}
function lessonFinished(skill, lesson) {
  const next = catalog[level][skill].find(
    (l) => l.id !== lesson.id && !state.completed.includes(l.id),
  );
  const after = document.createElement("div");
  after.className = "actionRow";
  after.innerHTML =
    '<button class="primary">' +
    (next ? "Bài tiếp theo" : "Về danh sách") +
    "</button>";
  after.firstChild.onclick = () =>
    next ? openCatalogLesson(skill, next.id) : openShelf(skill);
  content.append(after);
}
function openShelf(skill) {
  studyShell(skillName(skill));
  const list = catalog[level][skill],
    kid = level.startsWith("Kids");
  content.innerHTML =
    '<div class="skillNav">' +
    Object.keys(skills)
      .map(
        (s) =>
          '<button class="' +
          (s === skill ? "on" : "") +
          '" data-to="' +
          s +
          '">' +
          skillName(s) +
          "</button>",
      )
      .join("") +
    "</div>" +
    (skill === "vocab"
      ? '<div class="toolsRow"><button class="secondary" id="picGame">Nhìn hình đoán từ</button><button class="secondary" id="lex">Kho từ theo trình độ</button></div>'
      : "") +
    (skill === "grammar"
      ? '<button class="secondary" id="grammarBook">Học theo sách Giải thích ngữ pháp</button>'
      : "") +
    (skill === "writing" && !oral()
      ? '<button class="secondary" id="bookshelf">Học theo sách Writing 1</button>'
      : "") +
    '<label class="field">Tìm bài học<input type="search" id="findLesson" placeholder="Nhập tên hoặc nội dung bài…"></label>' +
    (skill === "grammar"
      ? '<label class="field">Chủ điểm<select id="topic"><option value="">Tất cả chủ điểm</option>' +
        window.grammarBank
          .filter((t) => t.level === level)
          .map(
            (t) =>
              '<option value="' +
              t.id +
              '">' +
              escapeHTML(t.title) +
              "</option>",
          )
          .join("") +
        "</select></label>"
      : "") +
    '<small id="matches"></small><div id="lessonList" class="lessonList"></div>';
  content
    .querySelectorAll("[data-to]")
    .forEach((b) => (b.onclick = () => openShelf(b.dataset.to)));
  if (skill === "vocab") {
    $("#picGame").onclick = openPictures;
    $("#lex").onclick = openWordPacks;
  }
  if ($("#grammarBook")) $("#grammarBook").onclick = showGrammarBook;
  if ($("#bookshelf")) $("#bookshelf").onclick = showBook;
  function draw() {
    const query = foldText($("#findLesson").value),
      topic = $("#topic")?.value;
    const found = list.filter(
      (l) =>
        (!topic || topic === l.topic?.id) &&
        foldText(l.title + " " + l.detail).includes(query),
    );
    $("#matches").textContent =
      found.length +
      " bài · " +
      list.filter((l) => state.completed.includes(l.id)).length +
      " bài đã hoàn thành trong kỹ năng này";
    $("#lessonList").innerHTML =
      found
        .map(
          (l) =>
            '<button class="libItem lessonItem" data-id="' +
            escapeHTML(l.id) +
            '">' +
            (kid && skill === "vocab"
              ? '<img alt="" src="' +
                kidPicture(level, l.unit || { number: 0 }) +
                '">'
              : "") +
            "<span><strong>" +
            escapeHTML(l.title) +
            "</strong><small>" +
            escapeHTML(l.detail) +
            '</small></span><b aria-label="' +
            (state.completed.includes(l.id) ? "Đã hoàn thành" : "Mở bài") +
            '">' +
            (state.completed.includes(l.id) ? "✓" : "›") +
            "</b></button>",
        )
        .join("") || "<p>Chưa tìm thấy bài phù hợp.</p>";
    $("#lessonList")
      .querySelectorAll("[data-id]")
      .forEach(
        (b) => (b.onclick = () => openCatalogLesson(skill, b.dataset.id)),
      );
  }
  $("#findLesson").oninput = draw;
  if ($("#topic")) $("#topic").onchange = draw;
  draw();
}
function renderCatalogLesson(skill, lessonId) {
  const lesson = catalog[level][skill]?.find((l) => l.id === lessonId);
  if (!lesson) return openShelf(skill);
  if (lesson.story) {
    openReading(lesson);
    return;
  }
  if (lesson.topic) {
    grammarLesson(lesson);
    return;
  }
  if (lesson.book) {
    bookLesson(lesson);
    return;
  }
  if (skill === "speaking") {
    speakingLesson(lesson);
    return;
  }
  if (skill === "vocab" && (lesson.unit || level.startsWith("Kids"))) {
    wordLesson(lesson);
    return;
  }
  view(skill, lesson);
  goBack(skill);
  if (lesson.unit) $("#modalTitle").textContent = lesson.title;
}
function grammarLesson(lesson) {
  const t = lesson.topic;
  const rounds = [
    lesson.questionIndex,
    (lesson.questionIndex + 1) % t.questions.length,
  ];
  let round = 0;
  const render = () => {
    studyShell(lesson.title);
    const q = t.questions[rounds[round]],
      options = q.others ? shuffled([q.answer, ...q.others]) : null;
    content.innerHTML =
      '<div class="rule">' +
      escapeHTML(t.rule) +
      (t.source
        ? "<p><small>Giải thích ngữ pháp tiếng Anh · Chương " +
          t.source.chapter +
          " · trang sách " +
          t.source.page +
          " / PDF " +
          t.source.pdfPage +
          "</small></p>"
        : "") +
      "</div><small>Câu " +
      (round + 1) +
      " / " +
      rounds.length +
      "</small><h3>" +
      escapeHTML(q.prompt) +
      "</h3>" +
      (options
        ? choices(options)
        : '<form id="gap"><label class="field">Điền phần còn thiếu<input id="gapText" required autocomplete="off" autocapitalize="off"></label>' +
          action("checkGap", "Kiểm tra") +
          "</form>") +
      result;
    goBack("grammar");
    let first = true,
      passed = false;
    async function check(value) {
      if (passed) return;
      const correct = [q.answer, ...(q.also || [])].some(
        (a) => normalizedAnswer(a) === normalizedAnswer(value),
      );
      if (first) {
        recordAttempt(
          {
            level,
            skill: "grammar",
            lessonId: lesson.id,
            topic: t.id,
            questionId: t.id + "-" + rounds[round],
          },
          correct,
        );
        first = false;
      }
      if (!correct) {
        feedback("Thử lại nhé. " + q.why);
        return;
      }
      passed = true;
      try {
        if (round === rounds.length - 1) await save({ completed: [lesson.id] });
        if (
          !$("#feedback") ||
          current !== "study" ||
          $("#modalTitle").textContent !== lesson.title
        )
          return;
        feedback("Chính xác! " + q.why);
        if (round === rounds.length - 1) lessonFinished("grammar", lesson);
        else {
          const b = document.createElement("button");
          b.className = "primary";
          b.textContent = "Câu tiếp theo";
          b.onclick = () => {
            round++;
            render();
          };
          content.append(b);
        }
      } catch (e) {
        passed = false;
        handleError(e);
      }
    }
    if (options)
      content
        .querySelectorAll("[data-answer]")
        .forEach(
          (b) => (b.onclick = () => check(options[Number(b.dataset.answer)])),
        );
    else
      $("#gap").onsubmit = (e) => {
        e.preventDefault();
        check($("#gapText").value);
      };
  };
  render();
}
function wordLesson(lesson) {
  const kid = level.startsWith("Kids");
  const u = lesson.unit || { ...courses[level], number: 0 };
  const pool = catalog[level].vocab.filter(
    (l) => l.unit && l.id !== lesson.id && l.unit.meaning !== u.meaning,
  );
  const options = shuffled([
    u,
    ...shuffled(pool)
      .slice(0, 2)
      .map((l) => l.unit),
  ]);
  studyShell(u.word);
  content.innerHTML =
    (kid
      ? '<div class="wordHero"><img src="' +
        kidPicture(level, u) +
        '" alt="' +
        escapeHTML(u.meaning) +
        '"></div>'
      : "") +
    "<h3>" +
    escapeHTML(u.word) +
    " <small>" +
    escapeHTML(u.ipa) +
    "</small></h3><p>" +
    escapeHTML(u.meaning) +
    " · " +
    escapeHTML(u.example) +
    "</p>" +
    video("word", u.number) +
    action("tryWord", kid ? "Luyện chọn hình" : "Ôn nghĩa của từ");
  goBack("vocab");
  $("#tryWord").onclick = () => {
    studyShell(kid ? "Nghe rồi chọn hình" : "Chọn nghĩa của từ");
    content.innerHTML =
      (kid
        ? '<button id="hearWord" class="primary">▶ Nghe từ</button><div class="picOptions">' +
          options
            .map(
              (v, i) =>
                '<button data-answer="' +
                i +
                '" aria-label="' +
                escapeHTML(v.meaning) +
                '"><img alt="' +
                escapeHTML(v.meaning) +
                '" src="' +
                kidPicture(level, v) +
                '"></button>',
            )
            .join("") +
          "</div>"
        : "<h3>" +
          escapeHTML(u.word) +
          "</h3>" +
          choices(options.map((x) => x.meaning))) + result;
    goBack("vocab");
    const audio = new Audio(
      "media/" +
        (u.number ? "units/" + level + "-" + u.number : level) +
        "-word.mp4",
    );
    const play = () => {
      stopStudyAudio();
      activeStudyAudio = audio;
      audio.currentTime = 0;
      audio.ontimeupdate = () => {
        if (audio.currentTime > 1.8) audio.pause();
      };
      audio.play().catch(() => speak(u.word));
    };
    if (kid) {
      $("#hearWord").onclick = play;
      play();
    }
    let first = true,
      done = false;
    content.querySelectorAll("[data-answer]").forEach(
      (b) =>
        (b.onclick = async () => {
          if (done) return;
          const ok = options[Number(b.dataset.answer)] === u;
          if (first) {
            recordAttempt(
              {
                level,
                skill: "vocab",
                lessonId: lesson.id,
                topic: kid ? "pictures" : "meaning",
              },
              ok,
            );
            first = false;
          }
          if (!ok) {
            feedback("Chưa đúng. Hãy thử lại nhé.");
            return;
          }
          done = true;
          try {
            await save({ completed: [lesson.id] });
            if (!b.isConnected) return;
            feedback("Đúng rồi! " + u.word + " · " + u.meaning);
            lessonFinished("vocab", lesson);
          } catch (e) {
            done = false;
            handleError(e);
          }
        }),
    );
  };
}
let activeStudyAudio;
function stopStudyAudio() {
  if (activeStudyAudio) {
    activeStudyAudio.pause();
    activeStudyAudio = null;
  }
}
function picPath(w) {
  return "art/words/pic-" + w.word.replaceAll(" ", "-") + ".webp";
}
function openPictures() {
  let category = "",
    mode = "guess",
    deck = [],
    idx = 0;
  studyShell("Nhìn hình đoán từ");
  content.innerHTML =
    '<div class="lessonPath"><button id="backPic" class="subtle">← Từ vựng</button><span>' +
    pictureWords.length +
    ' thẻ hình</span></div><label class="field">Chủ đề<select id="picCat"><option value="">Tất cả chủ đề</option>' +
    [...new Set(pictureWords.map((w) => w.category))]
      .map((c) => "<option>" + escapeHTML(c) + "</option>")
      .join("") +
    '</select></label><label class="field">Cách luyện<select id="picMode"><option value="guess">Nhìn hình chọn từ</option><option value="hear">Nghe từ chọn hình</option><option value="type">Nhìn hình tự gõ từ</option></select></label><div id="picRound"></div>';
  $("#backPic").onclick = () => openShelf("vocab");
  function render() {
    const w = deck[idx],
      options = shuffled([
        w,
        ...shuffled(
          pictureWords.filter((v) => v.category === w.category && v !== w),
        ).slice(0, 2),
      ]);
    $("#picRound").innerHTML =
      "<small>" +
      escapeHTML(w.category) +
      " · Thẻ " +
      (idx + 1) +
      " / " +
      deck.length +
      "</small>" +
      (mode === "hear"
        ? '<button class="primary" id="playPic">▶ Nghe từ</button>'
        : '<div class="wordHero"><img alt="Tranh để đoán từ" src="' +
          picPath(w) +
          '"></div>') +
      (mode === "type"
        ? '<form id="picForm"><label class="field">Từ tiếng Anh<input id="picText" required autocomplete="off"></label>' +
          action("picSubmit", "Kiểm tra") +
          "</form>"
        : mode === "hear"
          ? '<div class="picOptions">' +
            options
              .map(
                (v, i) =>
                  '<button data-pick="' +
                  i +
                  '"><img alt="' +
                  escapeHTML(v.vi) +
                  '" src="' +
                  picPath(v) +
                  '"></button>',
              )
              .join("") +
            "</div>"
          : choices(options.map((v) => v.word))) +
      result;
    const pronounce = () => {
      const a = new Audio(
        "media/pictures/" + w.word.replaceAll(" ", "-") + ".mp3",
      );
      stopStudyAudio();
      activeStudyAudio = a;
      a.play().catch(() => speak(w.word));
    };
    if ($("#playPic")) {
      $("#playPic").onclick = pronounce;
      pronounce();
    }
    let solved = false;
    function check(ok) {
      if (solved) return;
      if (!ok) {
        feedback("Thử một lần nữa nhé.");
        return;
      }
      solved = true;
      feedback(w.word + " · " + w.vi);
      pronounce();
      const next = document.createElement("button");
      next.className = "primary";
      next.textContent =
        idx === deck.length - 1 ? "Trộn lại bộ thẻ" : "Thẻ tiếp theo";
      next.onclick = () => {
        if (++idx >= deck.length) {
          idx = 0;
          deck = shuffled(deck);
        }
        render();
      };
      $("#picRound").append(next);
    }
    if (mode === "type")
      $("#picForm").onsubmit = (e) => {
        e.preventDefault();
        check(
          normalizedAnswer($("#picText").value) === normalizedAnswer(w.word),
        );
      };
    else
      $("#picRound")
        .querySelectorAll("[data-answer],[data-pick]")
        .forEach(
          (b) =>
            (b.onclick = () =>
              check(options[Number(b.dataset.pick ?? b.dataset.answer)] === w)),
        );
  }
  function restart() {
    category = $("#picCat").value;
    mode = $("#picMode").value;
    deck = shuffled(
      pictureWords.filter((w) => !category || w.category === category),
    );
    idx = 0;
    render();
  }
  $("#picCat").onchange = restart;
  $("#picMode").onchange = restart;
  restart();
}
function showBook() {
  studyShell("Chắp bút 1000 câu Writing · Tập 1");
  content.innerHTML =
    '<p>Luyện viết theo 30 chủ đề của sách. Chọn một chủ đề để xem hướng dẫn, trang tham khảo và bài luyện.</p><div class="lessonList">' +
    window.writingBook
      .map(
        (b) =>
          '<button class="libItem lessonItem" data-book="' +
          escapeHTML(b.id) +
          '"><span><strong>' +
          escapeHTML(b.title) +
          "</strong><small>Chủ đề " +
          escapeHTML(b.unit) +
          " · " +
          escapeHTML(labels[b.level]) +
          " · " +
          escapeHTML(b.pages) +
          "</small></span><b>›</b></button>",
      )
      .join("") +
    "</div>";
  content.querySelectorAll("[data-book]").forEach(
    (button) =>
      (button.onclick = async () => {
        const b = window.writingBook.find((x) => x.id === button.dataset.book);
        await choose(b.level);
        openCatalogLesson("writing", b.id);
      }),
  );
}
function bookLesson(lesson) {
  const b = lesson.book;
  studyShell(b.title);
  content.innerHTML =
    '<button class="subtle" id="bookBack">← Mục lục Writing 1</button><small>Chủ đề ' +
    escapeHTML(b.unit) +
    " · " +
    escapeHTML(b.pages) +
    '</small><div class="rule">' +
    escapeHTML(b.guide) +
    "</div><h3>Bài luyện</h3><p>" +
    escapeHTML(b.prompt) +
    '</p><label class="field">Bài viết của bạn<textarea id="bookDraft" maxlength="8000" placeholder="Write in English…"></textarea></label><small id="bookCount"></small><div class="checklist"><strong>Tự rà soát</strong>' +
    b.checklist
      .map(
        (line) =>
          '<label><input type="checkbox"> ' + escapeHTML(line) + "</label>",
      )
      .join("") +
    '</div><div class="actionRow"><button class="secondary" id="bookSave">Lưu nháp</button><button class="primary" id="bookFinish">Hoàn thành</button></div>' +
    result;
  $("#bookBack").onclick = showBook;
  const draft = $("#bookDraft");
  draft.value = state.drafts[b.id] || "";
  const words = () => draft.value.trim().split(/\s+/).filter(Boolean).length;
  const refresh = () =>
    ($("#bookCount").textContent =
      words() + " từ · Mục tiêu " + b.minWords + " từ");
  refresh();
  draft.oninput = refresh;
  async function store(finish) {
    if (finish && (!words() || words() < b.minWords)) {
      feedback("Hãy bổ sung thêm nội dung để đạt độ dài mục tiêu.");
      return;
    }
    if (finish && content.querySelector("input[type=checkbox]:not(:checked)")) {
      feedback("Hãy rà soát bài viết theo từng mục trước khi hoàn thành.");
      return;
    }
    try {
      await save({
        drafts: { [b.id]: draft.value },
        ...(finish ? { completed: [b.id] } : {}),
      });
      if (draft.isConnected)
        feedback(finish ? "Đã lưu bài viết hoàn thành." : "Đã lưu bản nháp.");
    } catch (e) {
      handleError(e);
    }
  }
  $("#bookSave").onclick = () => store(false);
  $("#bookFinish").onclick = () => store(true);
}

function showGrammarBook() {
  studyShell("Giải thích ngữ pháp tiếng Anh");
  const topics = window.grammarBank.filter((t) => t.source);
  content.innerHTML =
    '<p>Mai Lan Hương · Hà Thanh Uyên · tái bản 2015. Bài luyện chuyển soạn theo các chủ điểm của sách. Mức học do TN đề xuất.</p><label class="field">Chương<select id="bookChapter"><option value="">Tất cả 9 chương</option>' +
    [...new Set(topics.map((t) => t.source.chapter))]
      .map((n) => "<option>" + n + "</option>")
      .join("") +
    '</select></label><div class="lessonList" id="bookTopics"></div>';
  function draw() {
    const chapter = $("#bookChapter").value;
    $("#bookTopics").innerHTML = topics
      .filter((t) => !chapter || t.source.chapter === Number(chapter))
      .map(
        (t) =>
          '<button class="libItem lessonItem" data-topic="' +
          t.id +
          '"><span><strong>' +
          escapeHTML(t.title) +
          "</strong><small>" +
          labels[t.level] +
          " · Chương " +
          t.source.chapter +
          " · trang " +
          t.source.page +
          " · " +
          t.questions.length +
          " câu luyện</small></span><b>›</b></button>",
      )
      .join("");
    $("#bookTopics")
      .querySelectorAll("[data-topic]")
      .forEach(
        (b) =>
          (b.onclick = async () => {
            const t = topics.find((t) => t.id === b.dataset.topic);
            await choose(t.level);
            openCatalogLesson("grammar", "g-" + t.id + "-1");
          }),
      );
  }
  $("#bookChapter").onchange = draw;
  draw();
}

function openCatalogLesson(skill, lessonId) {
  const lesson = catalog[level][skill]?.find((l) => l.id === lessonId);
  renderCatalogLesson(skill, lessonId);
  if (lesson) attachBookmark(skill, lesson);
}
