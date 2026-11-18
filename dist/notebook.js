const notebookLevels = [
  "A1",
  "A2",
  "B1",
  "B2",
  "IELTS",
  "Office",
  "Kids3",
  "Kids6",
];
async function notebookEntries() {
  await accounts.ready;
  const rows = await Promise.all(
    notebookLevels.map(async (course) => {
      const data = await accounts.loadCourse(course);
      return Object.entries(data.drafts)
        .filter(([key]) => key.startsWith("srs-"))
        .flatMap(([key, value]) => {
          try {
            const item = JSON.parse(value);
            return item &&
              typeof item.word === "string" &&
              typeof item.meaning === "string"
              ? [{ ...item, key, course }]
              : [];
          } catch {
            return [];
          }
        });
    }),
  );
  return rows.flat();
}
async function notebookKey(word) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(word.trim().toLowerCase()),
  );
  return (
    "srs-" +
    Array.from(new Uint8Array(digest))
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 24)
  );
}
function interactiveTranscript(text) {
  return String(text)
    .split(/([A-Za-z]+(?:['’][A-Za-z]+)?)/)
    .map((part, i) =>
      i % 2
        ? '<button class="transcriptWord" data-lookup="' +
          escapeHTML(part) +
          '" aria-label="Tra từ ' +
          escapeHTML(part) +
          '">' +
          escapeHTML(part) +
          "</button>"
        : escapeHTML(part),
    )
    .join("");
}
function openWordNote(word, context = "", targetCourse = level) {
  stopStudyAudio();
  const existing = document.querySelector("#wordNote");
  existing?.close();
  existing?.remove();
  const row = window.lexicon.find(
    (w) => w[0].toLowerCase() === word.toLowerCase(),
  );
  const d = document.createElement("dialog");
  d.id = "wordNote";
  d.innerHTML =
    '<div class="modalHead"><h2>' +
    escapeHTML(word) +
    '</h2><button class="close" aria-label="Đóng từ điển">×</button></div><form id="noteForm"><small>' +
    escapeHTML(row?.[3] || "") +
    '</small><label class="field">Nghĩa tiếng Việt<input id="noteMeaning" required maxlength="500"></label><label class="field">Câu ngữ cảnh<textarea id="noteContext" maxlength="2000"></textarea></label><div class="actionRow"><button class="secondary" type="button" id="noteHear">▶ Nghe từ</button><button class="primary" id="noteSave">Lưu vào sổ tay</button></div><p id="noteStatus" role="status"></p></form>';
  document.body.append(d);
  d.showModal();
  d.querySelector("#noteMeaning").value = row?.[1] || "";
  d.querySelector("#noteContext").value = context;
  d.querySelector(".close").onclick = () => d.close();
  d.addEventListener("close", () => {
    window.speechSynthesis?.cancel();
    d.remove();
  });
  d.querySelector("#noteHear").onclick = () => speak(word);
  const who = accounts.viewerId,
    course = targetCourse;
  d.querySelector("#noteForm").onsubmit = async (e) => {
    e.preventDefault();
    const button = d.querySelector("#noteSave");
    button.disabled = true;
    try {
      if (accounts.viewerId !== who)
        throw Error("Tài khoản đã thay đổi. Hãy mở lại từ này.");
      const key = await notebookKey(word),
        saved = await accounts.loadCourse(course);
      let prior = {};
      try {
        prior = JSON.parse(saved.drafts[key] || "{}");
      } catch {}
      const entry = {
        ...prior,
        word: word.toLowerCase(),
        meaning: d.querySelector("#noteMeaning").value.trim(),
        context: d.querySelector("#noteContext").value.trim(),
        due: prior.due || Date.now(),
        interval: prior.interval || 0,
        reps: prior.reps || 0,
        lapses: prior.lapses || 0,
      };
      if (!entry.meaning) throw Error("Hãy nhập nghĩa của từ.");
      if (accounts.viewerId !== who) throw Error("Tài khoản đã thay đổi.");
      await accounts.save(course, { drafts: { [key]: JSON.stringify(entry) } });
      if (d.isConnected)
        d.querySelector("#noteStatus").textContent =
          "Đã lưu từ và ngữ cảnh. Bạn có thể ôn trong Sổ tay.";
    } catch (e) {
      if (d.isConnected) d.querySelector("#noteStatus").textContent = e.message;
    } finally {
      button.disabled = false;
    }
  };
}
document.addEventListener("click", (e) => {
  const word = e.target.closest("[data-lookup]");
  if (word) {
    const sentence =
      word.closest("[data-sentence]")?.dataset.sentence ||
      word.closest("p")?.textContent ||
      "";
    openWordNote(word.dataset.lookup, sentence);
  }
});
window.addEventListener("accountchange", () =>
  document.querySelector("#wordNote")?.close(),
);
async function openNotebook() {
  studyShell("Sổ tay và từ đến hạn");
  const container = content;
  container.innerHTML = "<p>Đang tải sổ tay…</p>";
  const marker = container.firstElementChild;
  const who = accounts.viewerId;
  try {
    const entries = await notebookEntries();
    if (
      !marker.isConnected ||
      !modal.open ||
      current !== "study" ||
      accounts.viewerId !== who
    )
      return;
    const now = Date.now(),
      due = entries.filter((w) => w.due <= now);
    container.innerHTML =
      "<p>" +
      entries.length +
      " từ đã lưu · " +
      due.length +
      ' từ đến hạn ôn</p><div class="toolsRow"><button id="reviewDue" class="primary" ' +
      (!due.length ? "disabled" : "") +
      '>Ôn từ đến hạn</button><button id="allNotes" class="secondary" ' +
      (!entries.length ? "disabled" : "") +
      '>Lật toàn bộ sổ tay</button></div><label class="field">Tìm trong sổ tay<input type="search" id="noteSearch"></label><div class="lessonList" id="notes"></div>';
    function draw() {
      const q = foldText($("#noteSearch").value);
      $("#notes").innerHTML =
        entries
          .filter((w) => foldText(w.word + " " + w.meaning).includes(q))
          .sort((a, b) => a.due - b.due)
          .map(
            (w, i) =>
              '<button class="libItem" data-note="' +
              entries.indexOf(w) +
              '"><strong>' +
              escapeHTML(w.word) +
              " · " +
              escapeHTML(w.meaning) +
              "</strong><small>" +
              escapeHTML(labels[w.course]) +
              " · " +
              (w.due <= now
                ? "Đến hạn ôn"
                : new Date(w.due).toLocaleDateString("vi-VN")) +
              "</small><p>" +
              escapeHTML(w.context) +
              "</p></button>",
          )
          .join("") ||
        "<p>Chưa có từ phù hợp. Bấm một từ trong bản chép lời, hoặc lưu từ từ kho từ vựng.</p>";
      $("#notes")
        .querySelectorAll("[data-note]")
        .forEach(
          (b) =>
            (b.onclick = () => {
              const w = entries[Number(b.dataset.note)];
              openWordNote(w.word, w.context, w.course);
            }),
        );
    }
    $("#noteSearch").oninput = draw;
    $("#reviewDue").onclick = () => reviewNotebook(due);
    $("#allNotes").onclick = () =>
      openWordFlashcards(
        entries.map((w) => [w.word, w.meaning, labels[w.course], "", ""]),
        openNotebook,
      );
    draw();
  } catch (e) {
    if (container.isConnected) container.textContent = e.message;
  }
}
function nextWordReview(prior, remembered, now = Date.now()) {
  const interval = remembered
    ? prior.reps
      ? Math.min(60, Math.max(1, prior.interval) * 2)
      : 1
    : 0;
  return {
    ...prior,
    reps: remembered ? (prior.reps || 0) + 1 : 0,
    lapses: (prior.lapses || 0) + Number(!remembered),
    interval,
    due: now + (remembered ? interval * 86400000 : 600000),
    last: now,
  };
}
function reviewNotebook(entries) {
  const who = accounts.viewerId;
  let index = 0;
  const deck = [...entries].sort((a, b) => a.due - b.due);
  function draw() {
    if (index >= deck.length) {
      openNotebook();
      return;
    }
    const w = deck[index];
    studyShell("Ôn từ đến hạn");
    content.innerHTML =
      "<small>Thẻ " +
      (index + 1) +
      " / " +
      deck.length +
      " · " +
      escapeHTML(labels[w.course]) +
      "</small><h3>" +
      escapeHTML(w.word) +
      '</h3><button class="secondary" id="reviewListen">▶ Nghe từ</button><button class="primary" id="reviewReveal">Xem nghĩa</button><div id="reviewMeaning" hidden><div class="rule">' +
      escapeHTML(w.meaning) +
      "</div><p>" +
      escapeHTML(w.context) +
      '</p><div class="actionRow"><button id="forgotWord" class="secondary">Chưa nhớ · ôn sau 10 phút</button><button id="rememberedWord" class="primary">Đã nhớ</button></div></div><p role="status" id="reviewStatus"></p>';
    $("#reviewListen").onclick = () => speak(w.word);
    $("#reviewReveal").onclick = () => {
      $("#reviewMeaning").hidden = false;
      $("#reviewReveal").hidden = true;
    };
    let saving = false;
    async function rate(remembered) {
      if (saving) return;
      saving = true;
      const feedback = $("#reviewStatus");
      try {
        if (who !== accounts.viewerId) throw Error("Tài khoản đã thay đổi.");
        const latest = await accounts.loadCourse(w.course);
        let prior = JSON.parse(latest.drafts[w.key] || "null");
        if (!prior) throw Error("Không tìm thấy thẻ từ.");
        const updated = nextWordReview(prior, remembered);
        if (who !== accounts.viewerId) throw Error("Tài khoản đã thay đổi.");
        await accounts.save(w.course, {
          drafts: { [w.key]: JSON.stringify(updated) },
        });
        if (!feedback.isConnected || who !== accounts.viewerId) return;
        index++;
        draw();
      } catch (e) {
        if (feedback.isConnected) feedback.textContent = e.message;
      } finally {
        saving = false;
      }
    }
    $("#forgotWord").onclick = () => rate(false);
    $("#rememberedWord").onclick = () => rate(true);
  }
  draw();
}
