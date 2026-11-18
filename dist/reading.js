function openExplore() {
  studyShell("Thư viện học tập");
  content.innerHTML =
    '<div class="lessonList"><button class="libItem" id="exploreWords"><strong>Từ vựng theo chủ đề</strong>Tra từ theo trình độ, sổ tay và ôn từ đến hạn.</button><button class="libItem" id="exploreRead"><strong>Đọc và nghe</strong>Truyện và bài đọc ngắn, bản dịch từng câu, tra và lưu từ.</button><button class="libItem" id="exploreListen"><strong>Nghe liên tục</strong>30 hội thoại theo mỗi lộ trình, theo dõi lượt nói và chuyển bài tự động.</button><button class="libItem" id="exploreGames"><strong>Trò chơi ôn tập</strong>Nghe viết từ, nhìn nghĩa chọn từ và xếp câu.</button><button class="libItem" id="exploreNotebook"><strong>Sổ tay của tôi</strong>Từ đã lưu trong ngữ cảnh và lịch ôn.</button><button class="libItem" id="exploreSaved"><strong>Bài yêu thích</strong>Mở lại các bài bạn đã đánh dấu.</button><button class="libItem" id="exploreSkills"><strong>Danh mục bài học</strong>Nghe, nói, từ vựng, ngữ pháp và viết.</button></div>';
  $("#exploreWords").onclick = openWordPacks;
  $("#exploreRead").onclick = openReadings;
  $("#exploreListen").onclick = openListeningQueue;
  $("#exploreGames").onclick = openPracticeGames;
  $("#exploreNotebook").onclick = openNotebook;
  $("#exploreSaved").onclick = openBookmarks;
  $("#exploreSkills").onclick = () => openShelf("listen");
}
function openReadings() {
  studyShell("Đọc và nghe");
  content.innerHTML =
    '<label class="field">Lộ trình<select id="readingLevel"><option value="">Tất cả</option>' +
    Object.keys(courses)
      .map((k) => '<option value="' + k + '">' + labels[k] + "</option>")
      .join("") +
    '</select></label><div class="lessonList" id="readingList"></div>';
  function draw() {
    $("#readingList").innerHTML = window.readings
      .filter(
        (r) =>
          !$("#readingLevel").value || r.level === $("#readingLevel").value,
      )
      .map(
        (r) =>
          '<button class="libItem lessonItem" data-reading="' +
          r.id +
          '"><span><strong>' +
          escapeHTML(r.title) +
          "</strong><small>" +
          labels[r.level] +
          " · " +
          escapeHTML(r.vi) +
          "</small></span><b>›</b></button>",
      )
      .join("");
    $("#readingList")
      .querySelectorAll("[data-reading]")
      .forEach(
        (b) =>
          (b.onclick = async () => {
            const r = readings.find((r) => r.id === b.dataset.reading);
            await choose(r.level);
            openCatalogLesson("listen", "story-" + r.id);
          }),
      );
  }
  $("#readingLevel").onchange = draw;
  draw();
}
function openReading(lesson) {
  const r = lesson.story;
  studyShell(r.title);
  const times = readingTimes[r.id];
  content.innerHTML +=
    "<p>" +
    escapeHTML(r.vi) +
    '</p><audio controls id="readingPlayer" preload="metadata" src="media/reading/' +
    r.id +
    '.mp3"></audio><div class="toolsRow"><label class="field">Tốc độ<select id="readSpeed"><option value="0.75">0.75×</option><option selected value="1">1×</option><option value="1.25">1.25×</option></select></label><label><input type="checkbox" id="readTranslation"> Hiện bản dịch</label><label><input type="checkbox" id="textOnly"> Chỉ đọc</label></div><div id="storyText">' +
    r.sentences
      .map(
        ([en, vi], i) =>
          '<div class="readingSentence" data-sentence="' +
          escapeHTML(en) +
          '"><button class="subtle" data-readline="' +
          i +
          '" aria-label="Nghe câu ' +
          (i + 1) +
          '">▶</button><div><p>' +
          interactiveTranscript(en) +
          '</p><p class="translation" hidden>' +
          escapeHTML(vi) +
          "</p></div></div>",
      )
      .join("") +
    "</div><h3>" +
    escapeHTML(r.question) +
    "</h3>" +
    choices(shuffled([r.answer, ...r.others])) +
    result;
  // The native player supplies reliable play/pause controls while sentence seeking reuses its timeline.
  goBack("listen");
  const player = $("#readingPlayer");
  activeStudyAudio = player;
  $("#readSpeed").onchange = () =>
    (player.playbackRate = Number($("#readSpeed").value));
  $("#readTranslation").onchange = () =>
    content
      .querySelectorAll(".translation")
      .forEach((p) => (p.hidden = !$("#readTranslation").checked));
  $("#textOnly").onchange = () => {
    player.hidden = $("#textOnly").checked;
    if (player.hidden) player.pause();
  };
  content.querySelectorAll("[data-readline]").forEach(
    (b) =>
      (b.onclick = () => {
        if ($("#textOnly").checked) return;
        player.currentTime = times[Number(b.dataset.readline)];
        player.play().catch(() => {});
      }),
  );
  player.ontimeupdate = () =>
    content
      .querySelectorAll(".readingSentence")
      .forEach((line, i) =>
        line.classList.toggle(
          "playingTurn",
          player.currentTime >= times[i] && player.currentTime < times[i + 1],
        ),
      );
  let passed = false,
    first = true;
  content.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = async () => {
        if (passed) return;
        const ok = b.textContent === r.answer;
        if (first) {
          recordAttempt(
            {
              level: r.level,
              skill: "listen",
              lessonId: lesson.id,
              topic: "comprehension",
            },
            ok,
          );
          first = false;
        }
        if (!ok) {
          feedback("Thử đọc hoặc nghe lại đoạn văn nhé.");
          return;
        }
        passed = true;
        try {
          await save({ completed: [lesson.id] });
          if (b.isConnected)
            feedback("Chính xác! Đã lưu tiến độ bài đọc và nghe.");
        } catch (e) {
          passed = false;
          handleError(e);
        }
      }),
  );
}
function openListeningQueue() {
  studyShell("Nghe liên tục");
  const k = level,
    list = catalog[k].speaking;
  let index = 0;
  content.innerHTML =
    "<p>" +
    labels[k] +
    " · " +
    list.length +
    ' hội thoại</p><label class="field">Chọn bài<select id="queueLesson">' +
    list
      .map(
        (l, i) =>
          '<option value="' + i + '">' + escapeHTML(l.title) + "</option>",
      )
      .join("") +
    '</select></label><audio id="queuePlayer" controls preload="metadata"></audio><div class="toolsRow"><button class="secondary" id="queuePrev">Bài trước</button><button class="secondary" id="queueNext">Bài tiếp</button><label><input id="queueAuto" type="checkbox" checked> Tự chuyển bài</label><label><input id="queueTranscript" type="checkbox" checked> Hiện lời thoại</label></div><label class="field">Tốc độ<select id="queueSpeed"><option value="0.75">0.75×</option><option selected value="1">1×</option><option value="1.25">1.25×</option></select></label><div id="queueText"></div><button class="primary" id="practiceQueue">Luyện nói bài này</button>';
  const player = $("#queuePlayer");
  activeStudyAudio = player;
  function load(play) {
    $("#queueLesson").value = index;
    player.src = "media/dialogues/" + k + "-" + (index + 1) + ".mp3";
    player.playbackRate = Number($("#queueSpeed").value);
    $("#queueText").innerHTML = list[index].turns
      .map(
        (line, i) =>
          '<p class="queueTurn" data-sentence="' +
          escapeHTML(line) +
          '"><button class="subtle" data-seek="' +
          i +
          '" aria-label="Nghe lượt ' +
          (i + 1) +
          '">▶</button> ' +
          interactiveTranscript(line) +
          "</p>",
      )
      .join("");
    $("#queuePrev").disabled = index === 0;
    $("#queueNext").disabled = index === list.length - 1;
    $("#queueText")
      .querySelectorAll("[data-seek]")
      .forEach(
        (b) =>
          (b.onclick = () => {
            player.currentTime =
              dialogueTimes[k][index][Number(b.dataset.seek)];
            player.play().catch(() => {});
          }),
      );
    if (play) player.play().catch(() => {});
  }
  player.ontimeupdate = () => {
    const times = dialogueTimes[k][index];
    $("#queueText")
      ?.querySelectorAll(".queueTurn")
      .forEach((p, i) =>
        p.classList.toggle(
          "playingTurn",
          player.currentTime >= times[i] && player.currentTime < times[i + 1],
        ),
      );
  };
  player.onended = () => {
    if ($("#queueAuto")?.checked && index + 1 < list.length) {
      index++;
      load(true);
    }
  };
  $("#queueLesson").onchange = () => {
    index = Number($("#queueLesson").value);
    load(false);
  };
  $("#queuePrev").onclick = () => {
    index--;
    load(true);
  };
  $("#queueNext").onclick = () => {
    index++;
    load(true);
  };
  $("#queueTranscript").onchange = () =>
    ($("#queueText").hidden = !$("#queueTranscript").checked);
  $("#queueSpeed").onchange = () =>
    (player.playbackRate = Number($("#queueSpeed").value));
  $("#practiceQueue").onclick = () =>
    openCatalogLesson("speaking", list[index].id);
  load(false);
}
async function bookmarkKey(skill, id) {
  return (await notebookKey(skill + ":" + id)).replace("srs-", "bmk-");
}
function attachBookmark(skill, lesson) {
  const k = level,
    who = accounts.viewerId,
    button = document.createElement("button");
  button.className = "subtle";
  button.textContent = "☆ Lưu bài yêu thích";
  button.id = "bookmarkLesson";
  content.prepend(button);
  let present = false;
  const keyPromise = bookmarkKey(skill, lesson.id);
  keyPromise
    .then(async (key) => {
      const data = await accounts.loadCourse(k);
      present = Boolean(data.drafts[key]);
      if (button.isConnected)
        button.textContent = present
          ? "★ Đã lưu · Bỏ lưu"
          : "☆ Lưu bài yêu thích";
    })
    .catch(() => {});
  button.onclick = async () => {
    button.disabled = true;
    try {
      const key = await keyPromise;
      if (accounts.viewerId !== who) throw Error("Tài khoản đã thay đổi.");
      const latest = await accounts.loadCourse(k);
      present = Boolean(latest.drafts[key]);
      if (accounts.viewerId !== who) throw Error("Tài khoản đã thay đổi.");
      await accounts.save(k, {
        drafts: {
          [key]: present
            ? ""
            : JSON.stringify({ id: lesson.id, skill, title: lesson.title }),
        },
      });
      present = !present;
      if (button.isConnected)
        button.textContent = present
          ? "★ Đã lưu · Bỏ lưu"
          : "☆ Lưu bài yêu thích";
    } catch (e) {
      if (button.isConnected) button.textContent = e.message;
    } finally {
      button.disabled = false;
    }
  };
}
async function openBookmarks() {
  studyShell("Bài yêu thích");
  const marker = document.createElement("p");
  marker.textContent = "Đang tải…";
  content.append(marker);
  const who = accounts.viewerId;
  try {
    const rows = (
      await Promise.all(
        notebookLevels.map(async (k) => {
          const s = await accounts.loadCourse(k);
          return Object.entries(s.drafts)
            .filter(([id, v]) => id.startsWith("bmk-") && v)
            .flatMap(([, v]) => {
              try {
                return [{ ...JSON.parse(v), level: k }];
              } catch {
                return [];
              }
            });
        }),
      )
    ).flat();
    if (!marker.isConnected || who !== accounts.viewerId) return;
    content.innerHTML =
      rows
        .map(
          (r, i) =>
            '<button class="libItem" data-bookmark="' +
            i +
            '"><strong>' +
            escapeHTML(r.title) +
            "</strong><small>" +
            escapeHTML(labels[r.level]) +
            " · " +
            escapeHTML(skills[r.skill]) +
            "</small></button>",
        )
        .join("") || "<p>Mở một bài học rồi bấm ngôi sao để lưu vào đây.</p>";
    content.querySelectorAll("[data-bookmark]").forEach(
      (b) =>
        (b.onclick = async () => {
          const r = rows[Number(b.dataset.bookmark)];
          await choose(r.level);
          openCatalogLesson(r.skill, r.id);
        }),
    );
  } catch (e) {
    if (marker.isConnected) marker.textContent = e.message;
  }
}
