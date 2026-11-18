let speechModelPromise, readingSession;
function stopReading() {
  stopStudyAudio();
  if (readingSession) {
    readingSession.cancelled = true;
    readingSession.stop?.();
    readingSession = null;
  }
}
async function speechModel() {
  if (!speechModelPromise) {
    speechModelPromise = (async () => {
      if (!window.Vosk)
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "vendor/vosk.js";
          script.onload = resolve;
          script.onerror = () => {
            script.remove();
            reject(new Error("Chưa tải được bộ nhận dạng giọng nói."));
          };
          document.head.append(script);
        });
      return await Vosk.createModel(
        new URL("api/speech-model", document.baseURI).href,
        -1,
      );
    })().catch((e) => {
      speechModelPromise = null;
      throw e;
    });
  }
  return speechModelPromise;
}
function spokenWords(text) {
  const digits = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\bcan't\b/g, "cannot")
    .replace(/\bcannot\b/g, "can not")
    .replace(/\bwon't\b/g, "will not")
    .replace(/n't\b/g, " not")
    .replace(/'m\b/g, " am")
    .replace(/'re\b/g, " are")
    .replace(/'ll\b/g, " will")
    .replace(/'ve\b/g, " have")
    .replace(/\b(he|she|it|that|there|what)'s\b/g, "$1 is")
    .replace(/\b\d+\b/g, (n) => digits[Number(n)] || n)
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
function compareReading(target, actual) {
  const a = spokenWords(target),
    b = spokenWords(actual);
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (!i ? j : !j ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + Number(a[i - 1] !== b[j - 1]),
      );
  const parts = [];
  let i = a.length,
    j = b.length;
  while (i || j) {
    if (i && j && d[i][j] === d[i - 1][j - 1] + Number(a[i - 1] !== b[j - 1])) {
      parts.push({
        word: a[i - 1],
        heard: b[j - 1],
        ok: a[i - 1] === b[j - 1],
      });
      i--;
      j--;
    } else if (i && d[i][j] === d[i - 1][j] + 1) {
      parts.push({ word: a[i - 1], heard: "", ok: false });
      i--;
    } else {
      parts.push({ word: "", heard: b[--j], ok: false });
    }
  }
  return {
    percent: Math.max(
      0,
      Math.round(100 * (1 - d[a.length][b.length] / Math.max(1, a.length))),
    ),
    parts: parts.reverse(),
  };
}
async function transcribeRecording(blob, model) {
  const ctx = new AudioContext();
  let decoded;
  try {
    decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
  } finally {
    await ctx.close();
  }
  const offline = new OfflineAudioContext(
    1,
    Math.ceil(decoded.duration * 16000),
    16000,
  );
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start();
  const mono = await offline.startRendering();
  const rec = new model.KaldiRecognizer(16000);
  try {
    return await new Promise((resolve, reject) => {
      let final = false;
      const chunks = [];
      const timeout = setTimeout(
        () =>
          reject(Error("Hết thời gian nhận dạng. Hãy thử một câu ngắn hơn.")),
        45000,
      );
      function received(msg) {
        if (msg.result.text) chunks.push(msg.result.text);
        if (final) {
          clearTimeout(timeout);
          resolve(chunks.join(" ").trim());
          return;
        }
        final = true;
        rec.retrieveFinalResult();
      }
      rec.on("result", received);
      rec.on("partialresult", received);
      rec.on("error", () => {
        clearTimeout(timeout);
        reject(Error("Chưa phân tích được bản ghi."));
      });
      rec.acceptWaveformFloat(mono.getChannelData(0), 16000);
    });
  } finally {
    rec.remove();
  }
}
function speakingLesson(lesson) {
  studyShell(lesson.title);
  goBack("speaking");
  const k = level,
    key = lesson.id,
    session = { cancelled: false },
    threshold = 80;
  readingSession = session;
  const previous = state.drafts[key];
  let scores = {};
  try {
    scores = JSON.parse(previous || "{}");
  } catch {}
  const lines = lesson.turns;
  let role = 0,
    active = -1,
    sample,
    recordedBlob,
    recorder,
    stream,
    timer;
  const safe = () => !session.cancelled && readingSession === session;
  const release = () => {
    clearTimeout(timer);
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
  };
  session.stop = () => {
    if (recorder?.state === "recording") recorder.stop();
    release();
    sample?.pause();
  };
  const ui = document.createElement("div");
  ui.className = "speakingBody";
  content.append(ui);
  ui.innerHTML =
    '<label class="field">Vai của bạn<select id="role"><option value="0">Vai A</option><option value="1">Vai B</option></select></label><small>Nghe mẫu, đọc hai lượt của vai mình và đạt 80% số từ khớp ở mỗi lượt. Bộ nhận dạng tải khoảng 41 MB lần đầu. Âm thanh được xử lý trên thiết bị. Điểm thể hiện số từ khớp với câu mẫu. Phản hồi âm vị, trọng âm và ngữ điệu cần bộ đánh giá chuyên sâu hơn.</small><button class="secondary" id="whole">▶ Nghe cả hội thoại</button><div class="scriptLines"></div><div class="actionRow"><button id="recordLine" class="primary">● Thu âm</button><button class="secondary" id="replay" hidden>Nghe bản ghi</button></div><div id="readFeedback" role="status" aria-live="polite"></div>';
  let loopTimer;
  const controls = document.createElement("div");
  controls.innerHTML =
    '<div class="toolsRow"><label class="field">Tốc độ nghe<select id="practiceSpeed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option></select></label><label><input type="checkbox" id="repeatLine"> Lặp câu</label><label><input type="checkbox" id="hideLines"> Ẩn lời thoại</label></div><details id="dictationPanel"><summary>Nghe chép từng câu</summary><label class="field">Chọn câu<select id="dictLine">' +
    lines
      .map(
        (_, i) =>
          '<option value="' +
          i +
          '">Câu ' +
          (i + 1) +
          " · Vai " +
          (i % 2 ? "B" : "A") +
          "</option>",
      )
      .join("") +
    '</select></label><button class="secondary" id="dictPlay">▶ Nghe câu</button><label class="field">Gõ câu bạn nghe được<textarea id="lineDraft" maxlength="2000"></textarea></label><button class="primary" id="dictCheck">Kiểm tra</button><p id="lineResult" role="status"></p></details>';
  ui.prepend(controls);
  $("#hideLines").onchange = () =>
    ui.classList.toggle("hideTranscript", $("#hideLines").checked);
  $("#practiceSpeed").onchange = () => {
    if (sample) sample.playbackRate = Number($("#practiceSpeed").value);
  };
  $("#repeatLine").onchange = () => {
    if (!$("#repeatLine").checked) clearTimeout(loopTimer);
  };
  $("#dictPlay").onclick = () => listen(Number($("#dictLine").value));
  let firstDict = true;
  const draftKey = "shadow-" + key.split("-")[1];
  let lineDrafts = {};
  try {
    lineDrafts = JSON.parse(state.drafts[draftKey] || "{}");
  } catch {}
  function selectDict() {
    firstDict = true;
    $("#lineDraft").value = lineDrafts[$("#dictLine").value] || "";
    $("#lineResult").textContent = "";
    sample?.pause();
    clearTimeout(loopTimer);
  }
  $("#dictLine").onchange = selectDict;
  selectDict();
  $("#dictCheck").onclick = async () => {
    const index = Number($("#dictLine").value),
      input = $("#lineDraft").value.trim();
    if (!input) {
      $("#lineResult").textContent = "Hãy nhập câu bạn nghe được.";
      return;
    }
    const score = compareReading(lines[index], input),
      missing = score.parts
        .filter((p) => !p.ok)
        .map((p) =>
          !p.word
            ? "Thêm “" + p.heard + "”"
            : !p.heard
              ? "Thiếu “" + p.word + "”"
              : "Mẫu “" + p.word + "”, bạn viết “" + p.heard + "”",
        );
    if (firstDict) {
      recordAttempt(
        {
          level: k,
          skill: "speaking",
          lessonId: key,
          questionId: key + "-dict-" + index,
          topic: "dictation",
        },
        score.percent >= 80,
      );
      firstDict = false;
    }
    lineDrafts[index] = input;
    try {
      await save({ drafts: { [draftKey]: JSON.stringify(lineDrafts) } });
      if (safe())
        $("#lineResult").textContent =
          score.percent +
          "% khớp từ. " +
          missing.join(" · ") +
          (score.percent === 100
            ? "Chính xác!"
            : " · Đọc đối chiếu: " + lines[index]);
    } catch (e) {
      if (safe()) $("#lineResult").textContent = e.message;
    }
  };
  const report = (s) => {
    if (safe()) $("#readFeedback").textContent = s;
  };
  const file = "media/dialogues/" + k + "-" + key.split("-")[1] + ".mp3",
    times = window.dialogueTimes[k][Number(key.split("-")[1]) - 1];

  const oldStop = session.stop;
  session.stop = () => {
    clearTimeout(loopTimer);
    oldStop();
  };
  function listen(i) {
    clearTimeout(loopTimer);
    if (recorder?.state === "recording") return;
    sample?.pause();
    window.speechSynthesis?.cancel();
    sample = new Audio(file);
    sample.currentTime = i < 0 ? 0 : times[i];
    sample.playbackRate = Number($("#practiceSpeed")?.value || 1);
    if (i >= 0)
      sample.ontimeupdate = () => {
        if (sample.currentTime >= times[i + 1]) {
          sample.pause();
          if ($("#repeatLine")?.checked && safe())
            loopTimer = setTimeout(() => listen(i), 600);
        }
      };
    sample.play().catch(() => {
      if (safe()) speak(i < 0 ? lines.join(" ") : lines[i]);
    });
  }
  function draw() {
    const container = ui.querySelector(".scriptLines");
    container.innerHTML = lines
      .map(
        (line, i) =>
          '<div class="turn ' +
          (i % 2 === role ? "yourTurn" : "") +
          " " +
          (i === active ? "activeTurn" : "") +
          '"><b>' +
          (i % 2 ? "B" : "A") +
          "</b><div><p>" +
          interactiveTranscript(line) +
          '</p><div class="actionRow"><button class="subtle" data-sample="' +
          i +
          '">Nghe mẫu</button>' +
          (i % 2 === role
            ? '<button class="subtle" data-line="' +
              i +
              '">' +
              (active === i ? "Đang chọn" : "Chọn đọc") +
              "</button>"
            : "") +
          (Number.isFinite(scores[i])
            ? "<small>" + scores[i] + "%</small>"
            : "") +
          "</div></div></div>",
      )
      .join("");
    container
      .querySelectorAll("[data-sample]")
      .forEach((b) => (b.onclick = () => listen(+b.dataset.sample)));
    container.querySelectorAll("[data-line]").forEach(
      (b) =>
        (b.onclick = () => {
          active = +b.dataset.line;
          recordedBlob = null;
          $("#replay").hidden = true;
          draw();
          report("");
        }),
    );
  }
  function lock(busy) {
    ui.querySelector("#role").disabled = busy;
    controls
      .querySelectorAll("button,input,select,textarea")
      .forEach((el) => (el.disabled = busy));
    ui.querySelector("#whole").disabled = busy;
    ui.querySelectorAll("[data-line],[data-sample],#replay").forEach(
      (b) => (b.disabled = busy),
    );
  }
  function selectRole() {
    role = +$("#role").value;
    active = [role, role + 2].find((i) => (scores[i] || 0) < threshold) ?? role;
    recordedBlob = null;
    $("#replay").hidden = true;
    draw();
    report("");
  }
  $("#role").onchange = selectRole;
  $("#whole").onclick = () => listen(-1);
  selectRole();
  $("#replay").onclick = () => {
    if (recordedBlob) {
      sample?.pause();
      const url = URL.createObjectURL(recordedBlob);
      sample = new Audio(url);
      sample.onended = () => URL.revokeObjectURL(url);
      sample.play().catch(() => URL.revokeObjectURL(url));
    }
  };
  const record = ui.querySelector("#recordLine");
  record.onclick = async () => {
    if (recorder?.state === "recording") {
      recorder.stop();
      record.disabled = true;
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      report(
        "Để thu âm, mở trang qua HTTPS hoặc localhost bằng trình duyệt hỗ trợ micro.",
      );
      return;
    }
    clearTimeout(loopTimer);
    sample?.pause();
    lock(true);
    record.disabled = true;
    try {
      report("Đang chuẩn bị bộ nhận dạng tiếng Anh…");
      const model = await speechModel();
      if (!safe()) return;
      report("Cho phép dùng micro, sau đó đọc câu đang chọn.");
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      if (!safe()) {
        release();
        return;
      }
      recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      recorder.onstop = async () => {
        release();
        if (!safe()) return;
        record.disabled = true;
        report("Đang đối chiếu với câu mẫu…");
        try {
          recordedBlob = new Blob(chunks, { type: recorder.mimeType });
          const heard = await transcribeRecording(recordedBlob, model);
          if (!safe()) return;
          $("#replay").hidden = false;
          if (!heard) {
            report("Chưa nghe rõ lời đọc. Kiểm tra micro và thử lại nhé.");
            return;
          }
          const { percent, parts } = compareReading(lines[active], heard),
            pass = percent >= threshold;
          recordAttempt(
            {
              level: k,
              skill: "speaking",
              lessonId: key,
              questionId: key + "-" + active,
              topic: "read-aloud",
            },
            pass,
          );
          scores[active] = Math.max(scores[active] || 0, percent);
          const finished = [role, role + 2].every(
            (i) => scores[i] >= threshold,
          );
          const patch = { drafts: { [key]: JSON.stringify(scores) } };
          if (finished) patch.completed = [key];
          await save(patch);
          if (!safe()) return;
          draw();
          const detail = parts
            .filter((p) => !p.ok)
            .map((p) =>
              !p.word
                ? "Đọc thêm “" + p.heard + "”"
                : !p.heard
                  ? "Thiếu “" + p.word + "”"
                  : "Mẫu “" + p.word + "”, nghe thành “" + p.heard + "”",
            );
          report(
            percent +
              "% khớp từ. Nghe được: “" +
              heard +
              "”. " +
              detail.join(" · ") +
              (finished ? " · Đã hoàn thành hai lượt của vai này." : ""),
          );
        } catch (e) {
          report(e.message || "Chưa nhận dạng được. Vui lòng thử lại.");
        } finally {
          if (safe()) {
            record.textContent = "● Thu âm lại";
            record.disabled = false;
            lock(false);
          }
        }
      };
      recorder.start();
      timer = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 30000);
      record.disabled = false;
      record.textContent = "■ Dừng và kiểm tra";
      report("Đang thu âm…");
    } catch (e) {
      release();
      if (safe()) {
        record.disabled = false;
        lock(false);
        report(
          e.name === "NotAllowedError"
            ? "Chưa được cấp quyền micro. Hãy cho phép trong trình duyệt rồi thử lại."
            : "Chưa mở được bộ nhận dạng hoặc micro. " + e.message,
        );
      }
    }
  };
}
