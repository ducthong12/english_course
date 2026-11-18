const $ = (s) => document.querySelector(s);
const courses = window.courses;
const labels = {
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  IELTS: "IELTS",
  Office: "Văn phòng",
  Kids3: "Bé 3–6 tuổi",
  Kids6: "Bé 6–10 tuổi",
};
const skills = {
  vocab: "Từ vựng",
  grammar: "Ngữ pháp",
  writing: "Luyện viết",
  listen: "Luyện nghe",
  speaking: "Luyện nói",
};
const drawings = {
  sound: '<path d="M3 10v4m4-8v12m5-15v18m5-15v12m4-8v4"/>',
  play: '<path d="m7 4 13 8-13 8z" fill="currentColor"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  chart: '<path d="M4 20V13m7 7V8m7 12V3"/>',
};
function icons() {
  document
    .querySelectorAll("[data-icon]")
    .forEach(
      (el) =>
        (el.innerHTML =
          '<svg aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
          drawings[el.dataset.icon] +
          "</svg>"),
    );
}
const modal = $("#modal"),
  content = $("#content");
let level = localStorage.getItem("lingo-level") || "A1",
  current = "",
  controller,
  recognition;
if (!Object.hasOwn(courses, level)) level = "A1";
let state = { completed: [], drafts: {} };
const levelSelect = $("#level");
levelSelect.innerHTML = Object.keys(courses)
  .map((key) => '<option value="' + key + '">' + labels[key] + "</option>")
  .join("");
levelSelect.value = level;
const oral = () => Boolean(courses[level].oral);
function skillName(key) {
  return oral()
    ? { writing: "Chơi cùng bé", grammar: "Mẫu câu" }[key] || skills[key]
    : skills[key];
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function dashboard() {
  const c = courses[level];
  $("#heroTitle").textContent = c.english;
  $("#heroDesc").textContent = c.title + " · " + labels[level];
  $(".heroArt").src = "art/" + (level === "A1" ? "cafe" : level) + ".webp";
  $(".heroArt").alt = c.title;
  const counts = courseCounts(level, state.completed);
  const artwork = {
    vocab: "books",
    grammar: "puzzle",
    writing: "notebook",
    listen: level === "A1" ? "cafe" : level,
    speaking: "speaking",
  };
  $("#tiles").innerHTML = Object.keys(skills)
    .map(
      (key) =>
        '<button class="tile" data-shelf="' +
        key +
        '"><img alt="" src="art/' +
        artwork[key] +
        '.webp"><div class="tileText"><strong>' +
        skillName(key) +
        '<i data-icon="arrow"></i></strong><p>' +
        (key === "vocab"
          ? window.lexicon.length.toLocaleString("vi-VN") + " từ & cụm từ · "
          : "") +
        counts[key].total +
        " bài luyện</p></div></button>",
    )
    .join("");
  $(".tutorCard").hidden = oral();
  $('nav a[href="#tutor"]').hidden = oral();
  const values = Object.values(counts);
  const total = values.reduce((sum, v) => sum + v.total, 0),
    finished = values.reduce((sum, v) => sum + v.done, 0);
  const percent = Math.round((finished * 100) / total) + "%";
  $("#percentage").textContent = percent;
  $("#ring").style.setProperty("--amount", percent);
  $("#progressCount").textContent = finished + " / " + total + " bài";
  $("#tracks").innerHTML = Object.entries(counts)
    .map(
      ([key, n]) =>
        "<div>" +
        skillName(key) +
        "<span>" +
        n.done +
        " / " +
        n.total +
        "</span></div>",
    )
    .join("");
  icons();
}
let lastSync = 0;
async function sync() {
  const sequence = ++lastSync;
  const k = level;
  await accounts.ready;
  const progress = await accounts.loadCourse(k);
  if (sequence === lastSync && k === level) {
    state = progress;
    dashboard();
  }
}
async function choose(k) {
  level = k;
  levelSelect.value = k;
  localStorage.setItem("lingo-level", k);
  state = { completed: [], drafts: {} };
  dashboard();
  await sync();
  window.dispatchEvent(new Event("coursechange"));
}
levelSelect.onchange = () => choose(levelSelect.value);
window.addEventListener("accountchange", () => {
  if (modal.open) modal.close();
  state = { completed: [], drafts: {} };
  dashboard();
  sync();
});
function handleError(e) {
  feedback(e.message || "Chưa lưu được. Vui lòng thử lại.");
}
async function save(patch) {
  const k = level;
  await accounts.save(k, patch);
  if (level === k) await sync();
}
function feedback(s) {
  const el = $("#feedback");
  if (el) el.textContent = s;
}
async function done(key, extra = {}) {
  try {
    await save({ completed: [key], ...extra });
    feedback("Đã lưu tiến độ học.");
  } catch (e) {
    handleError(e);
  }
}
function video(type, number) {
  return (
    '<video preload="metadata" controls playsinline aria-label="Video bài học"><source src="media/' +
    (number ? "units/" + level + "-" + number : level) +
    "-" +
    type +
    '.mp4" type="video/mp4"></video>'
  );
}
function action(id, text) {
  return '<button class="primary" id="' + id + '">' + text + "</button>";
}
function choices(items) {
  return (
    '<div class="choices">' +
    items
      .map(
        (s, i) =>
          '<button data-answer="' + i + '">' + escapeHTML(s) + "</button>",
      )
      .join("") +
    "</div>"
  );
}
function quiz(index, explanation, onPass, evidence) {
  let first = true;
  content.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = async () => {
        content
          .querySelectorAll("[data-answer]")
          .forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        if (first && evidence) {
          recordAttempt(evidence, Number(b.dataset.answer) === index);
          first = false;
        }
        if (Number(b.dataset.answer) !== index) {
          feedback(
            "Thử lại nhé. " +
              (current === "listen" ? "Bạn có thể nghe lại video." : ""),
          );
          return;
        }
        try {
          await onPass();
          feedback("Chính xác! " + explanation);
        } catch (e) {
          handleError(e);
        }
      }),
  );
}
const result = '<div id="feedback" role="status" class="feedback"></div>';
function view(key, lesson) {
  stopReading();
  if (key === "tutor" && oral()) return;
  if (!modal.open) modal.showModal();
  current = key;
  const base = courses[level],
    unit = lesson?.unit;
  const id = lesson?.id || key;
  const dictKey = unit ? "dict-" + unit.number : "dictation";
  const c = unit ? unitCourse(base, unit) : base;
  $("#modalLabel").textContent = "LINGO STUDIO  /  " + labels[level];
  $("#modalTitle").textContent =
    skillName(key) ||
    { library: "Thư viện bài học", tutor: "Trò chuyện cùng AI" }[key];
  if (key === "library") {
    openExplore();
    return;
  }
  if (key === "vocab") {
    content.innerHTML =
      "<h3>" +
      c.word +
      " <small>" +
      c.ipa +
      "</small></h3><p>" +
      c.meaning +
      "</p>" +
      video("word", unit?.number) +
      "<p>" +
      c.tip +
      "</p><p><i>" +
      c.example +
      "</i></p>" +
      action("remember", "Đã luyện phát âm") +
      result;
    $("#remember").onclick = () => done(id);
    return;
  }
  if (key === "grammar") {
    content.innerHTML =
      "<h3>" + c.grammar + "</h3>" + choices(c.grammarChoices) + result;
    quiz(c.grammarAnswer, c.explain, () => save({ completed: [id] }), {
      level,
      skill: key,
      lessonId: id,
      topic: "intro",
    });
    return;
  }
  if (key === "listen") {
    $("#modalTitle").textContent = c.english;
    content.innerHTML =
      video("listen", unit?.number) +
      "<h3>" +
      c.question +
      "</h3>" +
      choices(c.choices) +
      result +
      (oral()
        ? ""
        : '<details><summary>Thử thách chép chính tả</summary><p>Nghe lại và nhập toàn bộ đoạn vừa nghe.</p><textarea id="dict" aria-label="Đoạn chép chính tả"></textarea>' +
          action("checkDict", "So khớp bản chép") +
          '<p role="status" id="dictScore"></p></details>') +
      "<details><summary>Xem bản chép lời</summary><p>" +
      interactiveTranscript(c.transcript) +
      "</p></details>";
    quiz(c.answer, "", () => save({ completed: [id] }), {
      level,
      skill: key,
      lessonId: id,
      topic: "comprehension",
    });
    if (!oral()) {
      $("#dict").value = state.drafts[dictKey] || "";
      $("#checkDict").onclick = async () => {
        const input = $("#dict").value.trim();
        if (!input) {
          $("#dictScore").textContent = "Hãy nhập đoạn bạn nghe được.";
          return;
        }
        const words = (s) =>
          s
            .toLowerCase()
            .replace(/[^a-z0-9' ]/g, " ")
            .split(/\s+/)
            .filter(Boolean);
        const ref = words(c.transcript),
          typed = words(input);
        let prev = Array.from({ length: ref.length + 1 }, (_, i) => i);
        for (const w of typed.slice(0, ref.length * 3)) {
          const row = [prev[0] + 1];
          for (let i = 1; i <= ref.length; i++)
            row[i] = Math.min(
              row[i - 1] + 1,
              prev[i] + 1,
              prev[i - 1] + Number(w !== ref[i - 1]),
            );
          prev = row;
        }
        const score = Math.max(
          0,
          Math.round(
            (1 -
              (prev[ref.length] + Math.max(0, typed.length - ref.length * 3)) /
                ref.length) *
              100,
          ),
        );
        $("#dictScore").textContent =
          "Khớp " + score + "% với bản chép lời. Hãy mở bản chép để đối chiếu.";
        try {
          await save({ drafts: { [dictKey]: input } });
        } catch (e) {
          handleError(e);
        }
      };
    }
    return;
  }
  if (key === "writing") {
    content.innerHTML =
      "<p>" +
      c.writing +
      "</p>" +
      (oral()
        ? action("finish", "Gia đình đã chơi xong")
        : '<textarea id="draft" maxlength="8000" placeholder="Write in English…" aria-label="Bài viết tiếng Anh"></textarea><small id="counter"></small><div class="actionRow"><button class="secondary" id="store">Lưu nháp</button>' +
          action("finish", "Hoàn thành bài viết") +
          "</div>") +
      result;
    if (oral()) {
      $("#finish").onclick = () => done(id);
      return;
    }
    const draft = $("#draft");
    draft.value = state.drafts[id] || "";
    const count = () => draft.value.trim().split(/\s+/).filter(Boolean).length;
    const counter = () =>
      ($("#counter").textContent =
        count() + " từ · Mục tiêu tối thiểu " + c.minWords + " từ");
    counter();
    draft.oninput = counter;
    $("#store").onclick = async () => {
      try {
        await save({ drafts: { [id]: draft.value } });
        feedback("Đã lưu bản nháp.");
      } catch (e) {
        handleError(e);
      }
    };
    $("#finish").onclick = () =>
      count() < c.minWords
        ? feedback(
            "Viết thêm " + (c.minWords - count()) + " từ để đạt mục tiêu.",
          )
        : done(id, { drafts: { [id]: draft.value } });
    return;
  }
  if (key === "tutor") chat();
}
const conversations = {};
function speak(text) {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    speechSynthesis.speak(u);
  }
}
async function chat() {
  const k = level,
    messages = (conversations[k] ||= []);
  content.innerHTML =
    "<p>Luyện nói về <b>" +
    courses[k].english +
    '</b>. Bạn có thể bắt đầu bằng một lời chào.</p><div id="chatLog" class="chatLog" aria-live="polite"></div><textarea maxlength="1200" id="message" aria-label="Tin nhắn tiếng Anh" placeholder="Hello!"></textarea><div class="actionRow">' +
    action("send", "Gửi tin nhắn") +
    '<button id="mic" class="secondary">Dùng mic</button><button id="read" class="secondary">Nghe trả lời</button></div>' +
    result;
  const box = $("#chatLog"),
    send = $("#send"),
    mic = $("#mic"),
    input = $("#message");
  const paint = () => {
    box.innerHTML = messages
      .map(
        (m) =>
          '<div class="bubble ' +
          m.role +
          '">' +
          escapeHTML(m.content) +
          "</div>",
      )
      .join("");
    box.scrollTop = box.scrollHeight;
  };
  paint();
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  mic.hidden = !SR;
  mic.onclick = () => {
    recognition = new SR();
    recognition.lang = "en-US";
    recognition.onstart = () => {
      mic.disabled = true;
      mic.textContent = "Đang nghe…";
    };
    recognition.onend = () => {
      mic.disabled = false;
      mic.textContent = "Dùng mic";
    };
    recognition.onresult = (e) => (input.value = e.results[0][0].transcript);
    recognition.onerror = () =>
      feedback("Chưa nhận được giọng nói. Bạn có thể nhập bằng bàn phím.");
    recognition.start();
  };
  $("#read").onclick = () => {
    const last = messages.filter((m) => m.role === "assistant").at(-1);
    if (last) speak(last.content);
    else feedback("Hãy gửi lời chào đầu tiên.");
  };
  send.disabled = true;
  try {
    const r = await fetch("/api/status");
    const data = await r.json();
    if (data.app !== "lingo-classroom") throw Error();
    if (!data.aiReady)
      feedback(
        "Máy đang chuẩn bị mô hình hội thoại. Bạn có thể nhập lời chào trong lúc chờ.",
      );
    send.disabled = false;
  } catch {
    if (box.isConnected)
      feedback(
        "Hội thoại dùng AI CLI trên máy tính. Chạy pnpm dev trong bộ mã nguồn và mở địa chỉ cục bộ để bắt đầu.",
      );
    return;
  }
  send.onclick = async () => {
    const msg = input.value.trim();
    if (!msg) return;
    controller = new AbortController();
    const next = [...messages, { role: "user", content: msg }].slice(-11);
    send.disabled = true;
    feedback("Gia sư đang trả lời…");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: k, messages: next }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Chưa kết nối được AI.");
      messages.push(next.at(-1), { role: "assistant", content: data.reply });
      input.value = "";
      paint();
      if (box.isConnected) feedback("");
    } catch (e) {
      if (box.isConnected) handleError(e);
    } finally {
      send.disabled = false;
    }
  };
}
function route() {
  const route = location.hash.slice(1) || "home";
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.toggle("active", a.dataset.nav === route));
  if (["tutor", "library"].includes(route)) view(route);
  else if (modal.open) modal.close();
}
document.addEventListener("click", (e) => {
  const shelf = e.target.closest("[data-shelf]");
  if (shelf) {
    if (shelf.dataset.shelf === "vocab") openWordPacks();
    else openShelf(shelf.dataset.shelf);
  }
  const b = e.target.closest("[data-open]");
  if (b) {
    if (b.dataset.open === "listen") openCatalogLesson("listen", "listen");
    else view(b.dataset.open);
  }
  const a = e.target.closest("nav a");
  if (a && a.hash === location.hash) route();
});
$(".close").onclick = () => modal.close();
modal.onclose = () => {
  stopReading();
  controller?.abort();
  recognition?.abort();
  window.speechSynthesis?.cancel();
  content.innerHTML = "";
  current = "";
  if (["#library", "#tutor"].includes(location.hash)) {
    history.replaceState(null, "", "#home");
    route();
  }
};
window.addEventListener("hashchange", route);
window.addEventListener("accountchange", () =>
  Object.keys(conversations).forEach((k) => delete conversations[k]),
);
dashboard();
sync().catch((e) => console.warn(e.message));
route();
