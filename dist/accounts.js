(() => {
  const guestKey = "lingo-guest-progress-v1";
  const tabSignal = "lingo-session-change";
  const lastSession = "lingo-session-present";
  const blank = () => ({ completed: [], drafts: {} });
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
  const labels = {
    Office: "Văn phòng",
    Kids3: "Bé 3–6 tuổi",
    Kids6: "Bé 6–10 tuổi",
  };
  const skillNames = {
    speaking: "Luyện nói",
    listen: "Luyện nghe",
    vocab: "Từ vựng",
    grammar: "Ngữ pháp",
    writing: "Luyện viết",
  };
  let user = null,
    courses = {},
    revision = 0,
    pending = Promise.resolve(),
    accountError = "";
  const avatar = document.createElement("button");
  avatar.className = "avatar";
  avatar.type = "button";
  document.querySelector(".avatar").replaceWith(avatar);
  const dialog = document.createElement("dialog");
  dialog.id = "accountDialog";
  dialog.setAttribute("aria-labelledby", "accountHeading");
  document.body.append(dialog);
  const updateAvatar = () => {
    avatar.textContent = user
      ? user.name
          .trim()
          .split(/\s+/)
          .filter((_, i, all) => i === 0 || i === all.length - 1)
          .map((w) => Array.from(w)[0])
          .join("")
          .toUpperCase()
      : "Đăng nhập";
    avatar.classList.toggle("guestAvatar", !user);
    avatar.title = user ? user.name : "Đăng nhập hoặc tạo tài khoản";
    avatar.setAttribute(
      "aria-label",
      user ? "Tài khoản của " + user.name : avatar.title,
    );
  };
  async function api(path, method = "GET", body) {
    let response;
    try {
      response = await fetch("/api/" + path, {
        method,
        credentials: "same-origin",
        cache: "no-store",
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new Error("Không kết nối được máy chủ. Vui lòng thử lại.");
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Máy chủ tài khoản chưa sẵn sàng.");
    }
    if (!response.ok)
      throw Object.assign(new Error(data.error || "Vui lòng thử lại."), {
        status: response.status,
      });
    return data;
  }
  async function setUser(next, notify) {
    const version = ++revision;
    user = next;
    courses = {};
    accountError = "";
    updateAvatar();
    try {
      if (next) localStorage.setItem(lastSession, "1");
      else localStorage.removeItem(lastSession);
    } catch {}
    if (next) {
      try {
        const result = await api("progress");
        if (version === revision) courses = result.courses;
      } catch (e) {
        if (version === revision) accountError = e.message;
      }
    }
    if (notify && version === revision)
      window.dispatchEvent(new Event("accountchange"));
  }
  async function refresh(notify) {
    try {
      await setUser((await api("account/me")).user, notify);
    } catch (e) {
      accountError = e.message;
      updateAvatar();
    }
  }
  function guest() {
    try {
      return JSON.parse(localStorage.getItem(guestKey) || "{}") || {};
    } catch {
      return {};
    }
  }
  function frame(title, body, wide = false) {
    dialog.classList.toggle("adminDialog", wide);
    dialog.innerHTML =
      '<div class="accountBar"><h2 id="accountHeading">' +
      title +
      '</h2><button type="button" class="accountX" aria-label="Đóng">×</button></div>' +
      body;
    dialog.querySelector(".accountX").onclick = () => dialog.close();
    if (!dialog.open) dialog.showModal();
  }
  function report(text) {
    const feedback = dialog.querySelector("[role=status]");
    if (feedback) feedback.textContent = text;
  }
  function signal() {
    try {
      localStorage.setItem(tabSignal, crypto.randomUUID());
    } catch {}
  }
  function auth(register = false) {
    frame(
      register ? "Tạo tài khoản" : "Đăng nhập",
      '<p class="accountHint">Lưu bài viết và theo dõi tiến độ của bạn qua từng buổi học.</p><form id="accountForm">' +
        (register
          ? '<label>Tên hiển thị<input name="name" autocomplete="name" maxlength="80" required></label>'
          : "") +
        '<label>Email<input name="email" type="email" autocomplete="email" maxlength="254" required></label>' +
        '<label>Mật khẩu<input name="password" type="password" autocomplete="' +
        (register ? "new-password" : "current-password") +
        '" ' +
        (register ? 'minlength="8" placeholder="Ít nhất 8 ký tự"' : "") +
        ' maxlength="256" required></label>' +
        '<p class="accountStatus" role="status"></p><button class="primary" type="submit">' +
        (register ? "Tạo tài khoản" : "Đăng nhập") +
        "</button></form>" +
        '<button class="accountLink" type="button" id="accountSwitch">' +
        (register
          ? "Đã có tài khoản? Đăng nhập"
          : "Chưa có tài khoản? Đăng ký") +
        "</button>",
    );
    report(accountError);
    dialog.querySelector("#accountSwitch").onclick = () => auth(!register);
    dialog.querySelector("form").onsubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const values = Object.fromEntries(new FormData(form));
      if (values.name) values.name = values.name.trim();
      const submit = form.querySelector("[type=submit]");
      submit.disabled = true;
      try {
        await pending;
        const result = await api(
          register ? "account/register" : "account/login",
          "POST",
          values,
        );
        await setUser(result.user, true);
        signal();
        if (location.hash === "#admin") await admin();
        else dialog.close();
      } catch (e) {
        report(e.message);
      } finally {
        submit.disabled = false;
      }
    };
  }
  function profile() {
    if (!user) {
      auth();
      return;
    }
    frame(
      "Tài khoản",
      '<div class="accountIdentity"><strong>' +
        escape(user.name) +
        "</strong><span>" +
        escape(user.email) +
        "</span></div>" +
        (user.role === "admin"
          ? '<button id="adminOpen" class="primary">Quản lý học viên</button>'
          : "") +
        '<button class="secondary" id="accountLogout">Đăng xuất</button><p class="accountStatus" role="status"></p>',
    );
    const opener = dialog.querySelector("#adminOpen");
    if (opener)
      opener.onclick = () => {
        location.hash = "admin";
      };
    dialog.querySelector("#accountLogout").onclick = async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      try {
        await pending;
        await api("account/logout", "POST", {});
        await setUser(null, true);
        signal();
        dialog.close();
      } catch (e) {
        report(e.message);
      } finally {
        button.disabled = false;
      }
    };
  }
  async function admin() {
    if (!user) {
      auth();
      return;
    }
    frame("Quản lý học viên", '<p role="status">Đang tải danh sách…</p>', true);
    if (user.role !== "admin") {
      report("Tài khoản của bạn chưa có quyền quản trị.");
      return;
    }
    const version = revision;
    try {
      const { users } = await api("admin/users");
      if (version !== revision || !dialog.open || location.hash !== "#admin")
        return;
      frame(
        "Quản lý học viên",
        '<div class="adminTools"><label>Tìm học viên<input id="accountSearch" type="search" placeholder="Tên hoặc email"></label><span id="studentCount"></span></div><div id="studentList"></div>',
        true,
      );
      const search = dialog.querySelector("#accountSearch");
      function draw() {
        const needle = search.value.trim().toLocaleLowerCase("vi");
        const matches = users.filter((u) =>
          (u.name + " " + u.email).toLocaleLowerCase("vi").includes(needle),
        );
        dialog.querySelector("#studentCount").textContent =
          matches.length + " tài khoản";
        dialog.querySelector("#studentList").innerHTML =
          matches
            .map((u) => {
              const rows = Object.entries(u.courses || {}),
                done = rows.reduce(
                  (n, [id, p]) =>
                    n +
                    Object.values(courseCounts(id, p.completed)).reduce(
                      (sum, v) => sum + v.done,
                      0,
                    ),
                  0,
                );
              return (
                '<details class="student"><summary><span><strong>' +
                escape(u.name) +
                "</strong><small>" +
                escape(u.email) +
                "</small></span><b>" +
                done +
                " bài đã hoàn thành</b></summary>" +
                (rows.length
                  ? "<ul>" +
                    rows
                      .map(
                        ([id, p]) =>
                          "<li><strong>" +
                          escape(labels[id] || id) +
                          "</strong> · " +
                          Object.entries(courseCounts(id, p.completed))
                            .map(([skill, n]) =>
                              escape(
                                (id === "Kids3" && skill === "writing"
                                  ? "Chơi cùng bé"
                                  : skillNames[skill]) +
                                  " " +
                                  n.done +
                                  "/" +
                                  n.total,
                              ),
                            )
                            .join(" · ") +
                          "</li>",
                      )
                      .join("") +
                    "</ul>"
                  : "<p>Học viên chưa hoàn thành bài tập.</p>") +
                "</details>"
              );
            })
            .join("") || "<p>Chưa tìm thấy học viên.</p>";
      }
      search.oninput = draw;
      draw();
    } catch (e) {
      report(e.message);
    }
  }
  const ready = refresh(false);
  window.accounts = {
    ready,
    get viewerId() {
      if (!user && accountError && localStorage.getItem(lastSession))
        return undefined;
      return user?.id ?? null;
    },
    async loadCourse(key) {
      await ready;
      if (!user && accountError && localStorage.getItem(lastSession))
        throw new Error(accountError);
      if (user && accountError) {
        const result = await api("progress");
        courses = result.courses;
        accountError = "";
      }
      return structuredClone((user ? courses : guest())[key] || blank());
    },
    save(course, patch) {
      const version = revision;
      const task = pending.then(async () => {
        await ready;
        if (version !== revision)
          throw new Error("Tài khoản đã thay đổi. Vui lòng mở lại bài tập.");
        if (user) {
          const state = await api("progress", "PATCH", {
            course,
            ...patch,
            expectedUser: user.id,
          });
          if (version === revision) courses[course] = state;
        } else {
          if (accountError && localStorage.getItem(lastSession))
            throw new Error(accountError);
          const saved = guest(),
            prior = saved[course] || blank();
          saved[course] = {
            completed: [
              ...new Set([...prior.completed, ...(patch.completed || [])]),
            ],
            drafts: { ...prior.drafts, ...patch.drafts },
          };
          localStorage.setItem(guestKey, JSON.stringify(saved));
        }
      });
      pending = task.catch(() => {});
      return task;
    },
    async open() {
      await ready;
      user ? profile() : auth();
    },
  };
  avatar.onclick = () => window.accounts.open();
  dialog.addEventListener("close", () => {
    if (location.hash === "#admin") history.replaceState(null, "", "#home");
    dialog.replaceChildren();
  });
  window.addEventListener("storage", async (event) => {
    if (event.key === tabSignal) {
      await refresh(true);
      if (dialog.open) {
        if (location.hash === "#admin") await admin();
        else profile();
      }
    }
  });
  window.addEventListener("hashchange", () => {
    if (location.hash === "#admin") ready.then(admin);
    else if (dialog.open) dialog.close();
  });
  if (location.hash === "#admin") ready.then(admin);
  updateAvatar();
})();
