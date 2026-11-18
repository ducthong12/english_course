(() => {
  const panel = document.querySelector("#adaptive");
  if (!panel) return;
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "adaptive.css";
  document.head.append(style);
  const DAY = 86400000;
  const skills = {
    grammar: "Ngữ pháp",
    vocab: "Từ vựng",
    listen: "Nghe hiểu",
    speaking: "Luyện nói",
    writing: "Luyện viết",
  };
  const topics = {
    intro: "Bài mở đầu",
    meaning: "Nghĩa của từ",
    pictures: "Nhận biết qua hình",
    comprehension: "Hiểu nội dung",
    dictation: "Chép chính tả",
    dialogue: "Hội thoại",
    pronunciation: "Đọc theo mẫu",
    "read-aloud": "Đọc lời hội thoại",
  };
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const current = () => document.querySelector("#level").value;
  const guestKey = (level) => "lingo-guest-evidence-v1-" + level;
  const readGuest = (level) =>
    JSON.parse(localStorage.getItem(guestKey(level)) || "[]");
  let refreshId = 0,
    unsaved = null;

  // Classic BKT (Corbett & Anderson) with fixed, uncalibrated initial parameters.
  // Recency changes review priority, never the estimated knowledge state itself.
  function infer(events, level) {
    const groups = new Map(),
      visited = new Set(),
      seenSkills = new Set();
    for (const e of events) {
      const item = catalog[level]?.[e.skill]?.find((l) => l.id === e.lessonId);
      if (!item) continue;
      const key = e.skill + "|" + e.topic;
      const m = groups.get(key) || {
        p: 0.35,
        count: 0,
        wrong: 0,
        distinct: new Set(),
        skill: e.skill,
        topic: e.topic,
      };
      const p = m.p;
      const yes = Boolean(e.correct);
      const known = yes ? 0.88 : 0.12,
        unknown = yes ? 0.3 : 0.7;
      const posterior = (p * known) / (p * known + (1 - p) * unknown);
      m.p = posterior + (1 - posterior) * 0.1;
      m.count++;
      m.wrong += Number(!yes);
      m.distinct.add(e.questionId);
      m.last = e.at;
      m.lastWrong = !yes;
      m.lesson = item;
      m.title = item.topic?.title || topics[e.topic] || skills[e.skill];
      groups.set(key, m);
      visited.add(e.lessonId);
      seenSkills.add(e.skill);
    }
    const ordered = [...groups.values()]
      .map((m) => {
        const weak = m.p < 0.65 && m.wrong >= 2 && m.distinct.size >= 3;
        const review = Date.now() - m.last >= 7 * DAY;
        const rank = weak ? 0 : m.lastWrong ? 1 : review ? 2 : 3;
        return { ...m, rank };
      })
      .sort(
        (a, b) =>
          a.rank - b.rank || (a.rank === 2 ? a.last - b.last : a.p - b.p),
      );
    const m = ordered[0],
      options = [];
    if (m) {
      const related = catalog[level][m.skill].filter((l) =>
        m.lesson.topic ? l.topic?.id === m.lesson.topic.id : l.id !== m.skill,
      );
      const lesson =
        m.rank === 2
          ? m.lesson
          : related.find((l) => !visited.has(l.id)) || m.lesson;
      options.push({
        skill: m.skill,
        lesson,
        reason:
          m.rank === 0
            ? "Củng cố chủ điểm"
            : m.rank === 1
              ? "Kiểm tra lại"
              : m.rank === 2
                ? "Ôn sau một tuần"
                : "Luyện tiếp",
      });
    }
    // Offer one objectively assessed task in a skill with no observations.
    const fresh = ["grammar", "listen", "vocab"].find(
      (skill) => !seenSkills.has(skill) && catalog[level]?.[skill]?.length,
    );
    if (fresh)
      options.push({
        skill: fresh,
        lesson:
          catalog[level][fresh].find((l) => l.id !== fresh) ||
          catalog[level][fresh][0],
        reason: m ? "Thử kỹ năng mới" : "Bài khởi đầu",
      });
    return { ordered, m, options, seenSkills };
  }
  function draw(events, level) {
    const { m, options, ordered, seenSkills } = infer(events, level);
    const child = level === "Kids3";
    const skillName = (key) =>
      child
        ? { grammar: "Mẫu câu", writing: "Chơi cùng bé" }[key] || skills[key]
        : skills[key];
    const total = ordered.reduce((n, t) => n + t.count, 0);
    const status = !m
      ? "Chưa có kết quả"
      : m.rank === 0
        ? "Nên ôn thêm"
        : m.rank === 1
          ? "Cần thêm bằng chứng"
          : m.rank === 2
            ? "Đến lúc ôn lại"
            : m.distinct.size < 3 || m.p < 0.75
              ? "Đang tìm hiểu"
              : "Đang tiến bộ";
    const summary = !m
      ? "Làm một bài có đáp án để nhận gợi ý theo kết quả."
      : m.rank === 0
        ? m.title +
          " có " +
          m.wrong +
          " lượt sai trong " +
          m.count +
          " lượt đầu. Hãy thử một bài cùng chủ điểm."
        : m.rank === 1
          ? "Bạn vừa gặp khó ở phần " +
            m.title +
            ". Thử thêm một bài để kiểm tra lại."
          : m.rank === 2
            ? "Lần luyện " + m.title + " gần nhất đã cách ít nhất 7 ngày."
            : m.distinct.size < 3 || m.p < 0.75
              ? "Đã ghi nhận kết quả ở phần " +
                m.title +
                ". Cần thêm câu hỏi khác để nhận xét chắc hơn."
              : "Bạn đang trả lời tốt ở phần " +
                m.title +
                ". Hãy thử câu tiếp theo.";
    panel.innerHTML =
      '<div class="adaptiveHead"><h2>Gợi ý cho bạn</h2><span>' +
      escape(status) +
      "</span></div><p>" +
      escape(summary) +
      '</p><div class="adaptiveLinks">' +
      options
        .map(
          (o, i) =>
            '<button type="button" data-advice="' +
            i +
            '"><small>' +
            escape(o.reason + " · " + skillName(o.skill)) +
            "</small><strong>" +
            escape(o.lesson.title) +
            ' <span aria-hidden="true">→</span></strong></button>',
        )
        .join("") +
      '</div><div id="adaptiveNotice" role="status"></div><details><summary>Căn cứ gợi ý' +
      (total ? " · " + total + " lượt" : "") +
      "</summary>" +
      (m
        ? "<ul>" +
          ordered
            .slice(0, 5)
            .map(
              (t) =>
                "<li>" +
                escape(t.title) +
                " · đúng " +
                (t.count - t.wrong) +
                "/" +
                t.count +
                " lượt đầu</li>",
            )
            .join("") +
          "</ul>"
        : "") +
      (seenSkills.size === Object.keys(skills).length
        ? "<p>Cả năm kỹ năng đều đã có kết quả"
        : "<p>Các kỹ năng chưa có dữ liệu gồm " +
          escape(
            Object.keys(skills)
              .filter((s) => !seenSkills.has(s))
              .map(skillName)
              .join(", "),
          )) +
      '.</p><p>Mỗi câu tính lượt đầu trong ngày UTC. Hoàn thành bài hoặc lưu bản nháp tự nó chưa cho biết mức thành thạo. Gợi ý dùng tối đa 1.000 lượt gần nhất của lộ trình.</p><p>Mô hình Bayesian Knowledge Tracing dùng xác suất ban đầu 35%, học sau mỗi lượt 10%, đoán đúng 30% và sơ suất 12%. Đây là giả định khởi đầu, chưa hiệu chỉnh theo người học. Bài nói chỉ phản ánh độ khớp lời được nhận dạng. <a href="https://doi.org/10.1007/BF01099821" target="_blank" rel="noopener noreferrer">Nghiên cứu của Corbett và Anderson</a></p></details>';
    panel.querySelectorAll("[data-advice]").forEach(
      (b) =>
        (b.onclick = () => {
          const o = options[Number(b.dataset.advice)];
          if (current() === level) openCatalogLesson(o.skill, o.lesson.id);
        }),
    );
    showUnsaved();
  }
  function showUnsaved() {
    const notice = panel.querySelector("#adaptiveNotice");
    if (
      !notice ||
      !unsaved ||
      unsaved.owner !== accounts.viewerId ||
      unsaved.item.level !== current()
    )
      return;
    notice.textContent = "Chưa lưu được kết quả để cập nhật gợi ý. ";
    const b = document.createElement("button");
    b.textContent = "Thử lưu lại";
    b.onclick = () => record(unsaved.item).catch(() => {});
    notice.append(b);
  }
  async function call(url, opts) {
    const r = await fetch(url, {
      credentials: "same-origin",
      cache: "no-store",
      ...opts,
    });
    if (!r.ok) throw new Error("Chưa đồng bộ được kết quả luyện tập.");
    return r.json();
  }
  async function refresh() {
    const id = ++refreshId,
      level = current();
    await accounts.ready;
    const who = accounts.viewerId;
    try {
      if (who === undefined) throw Error();
      let events;
      if (who === null) events = readGuest(level);
      else {
        const res = await call(
          "/api/account/evidence?level=" + encodeURIComponent(level),
        );
        if (res.viewerId !== who) throw Error();
        events = res.events;
      }
      if (id === refreshId && current() === level && who === accounts.viewerId)
        draw(events, level);
    } catch {
      if (id === refreshId && current() === level) {
        panel.innerHTML =
          '<h2>Gợi ý cho bạn</h2><p>Chưa tải được lịch sử luyện tập.</p><button class="secondary" id="adaptiveRetry">Tải lại</button><div id="adaptiveNotice" role="status"></div>';
        panel.querySelector("#adaptiveRetry").onclick = refresh;
        showUnsaved();
      }
    }
  }
  async function record(spec) {
    await accounts.ready;
    const { level, skill, lessonId, correct } = spec;
    if (
      typeof correct !== "boolean" ||
      !catalog[level]?.[skill]?.some((l) => l.id === lessonId)
    )
      return;
    const owner = accounts.viewerId;
    if (owner === undefined) throw new Error("Chưa xác nhận được tài khoản.");
    const at = Date.now(),
      day = spec.day ?? Math.floor(at / DAY);
    const item = {
      level,
      skill,
      lessonId,
      topic: spec.topic || skill,
      questionId: spec.questionId || lessonId,
      correct,
      day,
    };
    if (
      ![item.questionId, item.topic].every(
        (k) =>
          typeof k === "string" && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,95}$/.test(k),
      )
    )
      return;
    try {
      if (owner === null) {
        const save = () => {
          if (accounts.viewerId !== null) return;
          const data = readGuest(level);
          if (
            data.some(
              (e) =>
                e.day === day &&
                e.skill === skill &&
                e.questionId === item.questionId,
            )
          )
            return;
          data.push({ ...item, at });
          localStorage.setItem(
            guestKey(level),
            JSON.stringify(data.slice(-1000)),
          );
        };
        if (navigator.locks)
          await navigator.locks.request(guestKey(level), save);
        else save();
      } else {
        const opts = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, expectedUser: owner }),
        };
        try {
          await call("/api/account/evidence", opts);
        } catch (e) {
          if (owner !== accounts.viewerId) throw e;
          await call("/api/account/evidence", opts);
        }
      }
      if (
        unsaved?.owner === owner &&
        unsaved.item.questionId === item.questionId
      )
        unsaved = null;
      if (current() === level && accounts.viewerId === owner) await refresh();
    } catch (e) {
      if (accounts.viewerId === owner) {
        unsaved = { owner, item };
        showUnsaved();
      }
      throw e;
    }
  }
  window.adaptive = { record };
  window.addEventListener("coursechange", refresh);
  window.addEventListener("accountchange", () => {
    unsaved = null;
    panel.replaceChildren();
    refresh();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === guestKey(current()) && accounts.viewerId === null) refresh();
  });
  refresh();
})();
