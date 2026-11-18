function showLibraryPage() {
  const page = document.querySelector("#libraryPage");
  const modes = [
    {
      id: "words",
      title: "Từ vựng theo chủ đề",
      detail:
        lexicon.length.toLocaleString("vi-VN") +
        " từ & cụm từ · " +
        wordPacks.length +
        " bộ chủ đề",
      image: "books",
      open: openWordPacks,
    },
    {
      id: "speaking",
      title: "Nghe và luyện nói",
      detail: "30 hội thoại · chọn vai, nghe chép và đọc theo",
      image: "speaking",
      open: () => openShelf("speaking"),
    },
    {
      id: "reading",
      title: "Đọc và nghe",
      detail: readings.length + " bài song ngữ · bấm từ để tra và lưu",
      image: "Kids6",
      open: openReadings,
    },
    {
      id: "grammar",
      title: "Ngữ pháp theo chủ điểm",
      detail:
        catalog[level].grammar.length +
        " bài · các thì, liên từ và cấu trúc câu",
      image: "puzzle",
      open: () => openShelf("grammar"),
    },
    {
      id: "writing",
      title: level === "Kids3" ? "Chơi cùng bé" : "Luyện viết",
      detail: catalog[level].writing.length + " bài · lưu nháp và tự rà soát",
      image: "notebook",
      open: () => openShelf("writing"),
    },
    {
      id: "queue",
      title: "Nghe liên tục",
      detail: "Phát hội thoại, theo dõi lượt nói và tự chuyển bài",
      image: "A2",
      open: openListeningQueue,
    },
  ];
  page.innerHTML =
    '<section class="libraryIntro"><div><h1>Thư viện học tập<span>.</span></h1><p>Tìm bài vừa sức, học từ trong ngữ cảnh và ôn lại điều đã học.</p></div><label class="picker">Lộ trình<select id="libraryCourse">' +
    Object.keys(courses)
      .map((k) => '<option value="' + k + '">' + labels[k] + "</option>")
      .join("") +
    '</select></label></section><section class="libraryTools"><label class="field"><span class="srOnly">Tìm trong thư viện</span><input type="search" id="librarySearch" placeholder="Tìm từ, tên bài hoặc chủ đề…"></label><div class="toolsRow"><button class="secondary" id="libraryNotebook">Sổ tay & từ đến hạn</button><button class="secondary" id="librarySaved">Bài yêu thích</button><button class="secondary" id="libraryGames">Trò chơi ôn tập</button></div></section><div id="libraryModes" class="libraryGrid">' +
    modes
      .map(
        (m, i) =>
          '<button class="libraryCard" data-mode="' +
          m.id +
          '"><div class="libraryArt tone' +
          i +
          '"><img alt="" src="art/' +
          m.image +
          '.webp"></div><div><h2>' +
          escapeHTML(m.title) +
          "</h2><p>" +
          escapeHTML(m.detail) +
          '</p><span aria-hidden="true">↗</span></div></button>',
      )
      .join("") +
    '</div><section id="libraryResults" class="lessonList" hidden></section>';
  $("#libraryCourse").value = level;
  enhanceCoursePicker($("#libraryCourse"));
  $("#libraryCourse").onchange = async () => {
    await choose($("#libraryCourse").value);
    showLibraryPage();
  };
  page
    .querySelectorAll("[data-mode]")
    .forEach(
      (b) =>
        (b.onclick = () => modes.find((m) => m.id === b.dataset.mode).open()),
    );
  $("#libraryNotebook").onclick = openNotebook;
  $("#librarySaved").onclick = openBookmarks;
  $("#libraryGames").onclick = openPracticeGames;
  $("#librarySearch").oninput = () => {
    const q = foldText($("#librarySearch").value),
      box = $("#libraryResults");
    $("#libraryModes").hidden = Boolean(q);
    box.hidden = !q;
    if (!q) {
      box.replaceChildren();
      return;
    }
    const lessons = Object.entries(catalog[level])
      .flatMap(([skill, list]) => list.map((l) => ({ ...l, skill })))
      .filter((l) => foldText(l.title + " " + l.detail).includes(q))
      .slice(0, 10);
    const words = lexicon
      .filter((w) => foldText(w[0] + " " + w[1]).includes(q))
      .slice(0, 10);
    box.innerHTML =
      lessons
        .map(
          (l, i) =>
            '<button class="libItem" data-found="' +
            i +
            '"><strong>' +
            escapeHTML(l.title) +
            "</strong><small>" +
            escapeHTML(skills[l.skill]) +
            " · " +
            escapeHTML(labels[level]) +
            "</small></button>",
        )
        .join("") +
        words
          .map(
            (w, i) =>
              '<button class="libItem" data-foundword="' +
              i +
              '"><strong>' +
              escapeHTML(w[0]) +
              "</strong>" +
              escapeHTML(w[1]) +
              " · " +
              w[2] +
              "</button>",
          )
          .join("") ||
      "<p>Chưa tìm thấy. Thử tên chủ điểm hoặc từ khác nhé.</p>";
    box.querySelectorAll("[data-found]").forEach(
      (b) =>
        (b.onclick = () => {
          const l = lessons[Number(b.dataset.found)];
          openCatalogLesson(l.skill, l.id);
        }),
    );
    box
      .querySelectorAll("[data-foundword]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            openWordNote(words[Number(b.dataset.foundword)][0])),
      );
  };
}
