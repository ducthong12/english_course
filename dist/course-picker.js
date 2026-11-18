const courseDetails = {
  A1: ["A1", "Bắt đầu", "Từ và câu cơ bản"],
  A2: ["A2", "Nền tảng", "Giao tiếp hằng ngày"],
  B1: ["B1", "Trung cấp", "Tự tin trong hội thoại"],
  B2: ["B2", "Nâng cao", "Diễn đạt rõ và linh hoạt"],
  IELTS: ["IELTS", "Luyện thi", "Nghe, nói và viết học thuật"],
  Office: ["WORK", "Văn phòng", "Tiếng Anh trong công việc"],
  Kids3: ["3–6", "Bé 3–6 tuổi", "Nghe và chơi cùng gia đình"],
  Kids6: ["6–10", "Bé 6–10 tuổi", "Khám phá bằng hình ảnh"],
};
function enhanceCoursePicker(select) {
  const label = select.closest(".picker");
  if (!label || label.hidden) return;
  label.hidden = true;
  const host = document.createElement("div");
  host.className = "coursePicker";
  host.dataset.select = select.id;
  const menuId = select.id + "-choices";
  host.innerHTML =
    '<button class="courseTrigger" aria-haspopup="dialog" aria-expanded="false" aria-controls="' +
    menuId +
    '"><span class="courseBadge"></span><span class="courseCurrent"><small>Lộ trình của bạn</small><strong></strong></span><span class="courseChevron" aria-hidden="true">⌄</span></button><div class="courseMenu" id="' +
    menuId +
    '" role="dialog" aria-label="Chọn lộ trình" hidden><div class="courseMenuHead"><strong>Chọn lộ trình</strong><button type="button" aria-label="Đóng danh sách lộ trình">×</button></div><div class="courseOptions">' +
    Object.entries(courseDetails)
      .map(
        ([key, details]) =>
          '<button type="button" data-course-value="' +
          key +
          '" aria-pressed="false"><span class="courseBadge">' +
          details[0] +
          "</span><span><strong>" +
          escapeHTML(labels[key]) +
          "</strong><small>" +
          details[2] +
          '</small></span><span class="courseCheck" aria-hidden="true">✓</span></button>',
      )
      .join("") +
    "</div></div>";
  label.after(host);
  const trigger = host.querySelector(".courseTrigger"),
    menu = host.querySelector(".courseMenu");
  function close() {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }
  trigger.onclick = () => {
    const open = menu.hidden;
    document.querySelectorAll(".courseMenu").forEach((m) => {
      m.hidden = true;
      m.previousElementSibling?.setAttribute("aria-expanded", "false");
    });
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open)
      menu.querySelector('[data-course-value="' + select.value + '"]')?.focus();
  };
  menu.querySelector(".courseMenuHead button").onclick = () => {
    close();
    trigger.focus();
  };
  host.querySelectorAll("[data-course-value]").forEach(
    (b) =>
      (b.onclick = () => {
        select.value = b.dataset.courseValue;
        close();
        trigger.focus();
        select.dispatchEvent(new Event("change", { bubbles: true }));
        refreshCoursePickers();
      }),
  );
  host.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      trigger.focus();
    }
  });
  refreshCoursePickers();
}
function refreshCoursePickers() {
  document.querySelectorAll(".coursePicker").forEach((host) => {
    const select = document.getElementById(host.dataset.select),
      value = select?.value,
      details = courseDetails[value];
    if (!details) return;
    host.querySelector(".courseTrigger .courseBadge").textContent = details[0];
    host.querySelector(".courseCurrent strong").textContent = labels[value];
    host
      .querySelectorAll("[data-course-value]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.courseValue === value)),
      );
  });
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".coursePicker"))
    document.querySelectorAll(".courseMenu").forEach((m) => {
      m.hidden = true;
      m.previousElementSibling?.setAttribute("aria-expanded", "false");
    });
});
window.addEventListener("coursechange", refreshCoursePickers);
