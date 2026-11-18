const COURSE_IDS = new Set([
  "A1",
  "A2",
  "B1",
  "B2",
  "IELTS",
  "Office",
  "Kids3",
  "Kids6",
]);
const EXERCISE = /^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/;
const encoder = new TextEncoder();
const SESSION_SECONDS = 60 * 60 * 24 * 14;
const COOKIE_NAME = "lingo_session";
function hex(bytes) {
  return [...new Uint8Array(bytes)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
function bytes(hexValue) {
  return Uint8Array.from(hexValue.match(/../g), (pair) => parseInt(pair, 16));
}
const random = (size) => hex(crypto.getRandomValues(new Uint8Array(size)));
const sha = async (text) =>
  hex(await crypto.subtle.digest("SHA-256", encoder.encode(text)));
async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const params = {
    name: "PBKDF2",
    salt: bytes(salt),
    iterations: 100000,
    hash: "SHA-256",
  };
  return hex(await crypto.subtle.deriveBits(params, key, 256));
}
function equalHash(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function response(body, status = 200, extra = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
}
const fail = (error, status) => response({ error }, status);
const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
});
function cookie(token, age, url) {
  return (
    COOKIE_NAME +
    "=" +
    token +
    "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" +
    age +
    (url.protocol === "https:" ? "; Secure" : "")
  );
}
async function permit(db, key, max) {
  const now = Math.floor(Date.now() / 1000);
  const bucket = await sha(key);
  const record = await db
    .prepare(
      "INSERT INTO auth_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=CASE WHEN expires_at<=? THEN 1 ELSE count+1 END, expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING count",
    )
    .bind(bucket, now + 600, now, now)
    .first();
  await db
    .prepare("DELETE FROM auth_limits WHERE expires_at<=?")
    .bind(now)
    .run();
  return record.count <= max;
}
function groupProgress(rows, withDrafts) {
  const courses = {};
  for (const row of rows) {
    const c = (courses[row.course] ??= { completed: [], drafts: {} });
    if (row.completed) c.completed.push(row.skill);
    if (withDrafts && row.draft !== null) c.drafts[row.skill] = row.draft;
  }
  return courses;
}
export async function handleAccount(req, db) {
  const url = new URL(req.url),
    path = url.pathname;
  if (
    ![
      "/api/account/me",
      "/api/account/evidence",
      "/api/account/register",
      "/api/account/login",
      "/api/account/logout",
      "/api/progress",
      "/api/admin/users",
    ].includes(path)
  )
    return fail("Không tìm thấy chức năng.", 404);
  const query = (sql, ...args) => db.prepare(sql).bind(...args);
  const now = Math.floor(Date.now() / 1000);
  let data = {};
  if (!["GET", "HEAD"].includes(req.method)) {
    if (req.headers.get("Origin") !== url.origin)
      return fail("Yêu cầu khác nguồn bị từ chối.", 403);
    if (
      !req.headers
        .get("Content-Type")
        ?.toLowerCase()
        .startsWith("application/json")
    )
      return fail("Cần gửi dữ liệu JSON.", 415);
    if (Number(req.headers.get("Content-Length") || 0) > 65536)
      return fail("Dữ liệu quá dài.", 413);
    try {
      let size = 0;
      const parts = [],
        reader = req.body?.getReader();
      if (reader)
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > 65536) {
            await reader.cancel();
            return fail("Dữ liệu quá dài.", 413);
          }
          parts.push(value);
        }
      data = JSON.parse(await new Blob(parts).text());
      if (!data || Array.isArray(data) || typeof data !== "object")
        throw new Error();
    } catch {
      return fail("Dữ liệu JSON không hợp lệ.", 400);
    }
  }
  const sessionToken = (req.headers.get("Cookie") || "")
    .split(/;\s*/)
    .find((c) => c.startsWith(COOKIE_NAME + "="))
    ?.slice(COOKIE_NAME.length + 1);
  const digest =
    sessionToken && /^[a-f0-9]{64}$/.test(sessionToken)
      ? await sha(sessionToken)
      : null;
  if (path === "/api/account/register" || path === "/api/account/login") {
    if (req.method !== "POST") return fail("Phương thức không phù hợp.", 405);
    const register = path.endsWith("register");
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const name = typeof data.name === "string" ? data.name.trim() : "";
    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof data.password !== "string" ||
      !data.password.length ||
      data.password.length > 256
    )
      return fail("Kiểm tra email và mật khẩu.", 400);
    if (register && (data.password.length < 8 || !name || name.length > 80))
      return fail("Tên cần dài từ 1–80 ký tự và mật khẩu từ 8 ký tự.", 400);
    const ip = req.headers.get("CF-Connecting-IP") || "local";
    if (
      !(await permit(db, "ip:" + path + ":" + ip, register ? 15 : 100)) ||
      (!register && !(await permit(db, "login:" + email, 15)))
    )
      return fail("Bạn đã thử nhiều lần. Hãy thử lại sau 10 phút.", 429);
    let user;
    if (register) {
      const salt = random(16),
        id = crypto.randomUUID();
      const derived = await hashPassword(data.password, salt);
      const inserted = await query(
        "INSERT INTO users(id,email,name,password_hash,salt) VALUES(?,?,?,?,?) ON CONFLICT(email) DO NOTHING RETURNING id,email,name,role",
        id,
        email,
        name,
        derived,
        salt,
      ).first();
      if (!inserted) return fail("Email đã được đăng ký.", 409);
      user = inserted;
    } else {
      user = await query("SELECT * FROM users WHERE email=?", email).first();
      const derived = await hashPassword(
        data.password,
        user?.salt || "00".repeat(16),
      );
      if (!user || !equalHash(derived, user.password_hash))
        return fail("Email hoặc mật khẩu chưa đúng.", 401);
    }
    const token = random(32);
    const addSession = query(
      "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)",
      await sha(token),
      user.id,
      now + SESSION_SECONDS,
    );
    await db.batch([
      query("DELETE FROM sessions WHERE expires_at<=?", now),
      ...(digest
        ? [query("DELETE FROM sessions WHERE token_hash=?", digest)]
        : []),
      addSession,
    ]);
    return response({ user: publicUser(user) }, register ? 201 : 200, {
      "Set-Cookie": cookie(token, SESSION_SECONDS, url),
    });
  }
  if (path === "/api/account/logout") {
    if (req.method !== "POST") return fail("Phương thức không phù hợp.", 405);
    if (digest)
      await query("DELETE FROM sessions WHERE token_hash=?", digest).run();
    return response({ ok: true }, 200, { "Set-Cookie": cookie("", 0, url) });
  }
  const user = digest
    ? await query(
        "SELECT u.id,u.email,u.name,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?",
        digest,
        now,
      ).first()
    : null;
  if (path === "/api/account/me" && req.method === "GET")
    return response({ user });
  if (!user) return fail("Hãy đăng nhập để tiếp tục.", 401);
  if (path === "/api/account/evidence") {
    const level =
      req.method === "GET" ? url.searchParams.get("level") : data.level;
    if (!COURSE_IDS.has(level)) return fail("Lộ trình không hợp lệ.", 400);
    if (req.method === "GET") {
      const { results } = await query(
        "SELECT skill,question AS questionId,lesson AS lessonId,topic,correct,seen_at AS at FROM practice_evidence WHERE user_id=? AND level=? ORDER BY seen_at DESC,rowid DESC LIMIT 1000",
        user.id,
        level,
      ).all();
      return response({ events: results.reverse(), viewerId: user.id });
    }
    if (req.method !== "POST") return fail("Phương thức không phù hợp.", 405);
    if (data.expectedUser !== user.id)
      return fail("Tài khoản đã thay đổi. Vui lòng tải lại trang.", 409);
    const { skill, questionId, lessonId, topic, correct, day } = data;
    const validId = (value) =>
      typeof value === "string" &&
      /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,95}$/.test(value);
    const serverDay = Math.floor(Date.now() / 86400000);
    if (
      !["listen", "grammar", "vocab", "speaking", "writing"].includes(skill) ||
      ![questionId, lessonId, topic].every(validId) ||
      typeof correct !== "boolean" ||
      !Number.isInteger(day) ||
      day > serverDay + 1 ||
      day < serverDay - 1
    )
      return fail("Kết quả luyện tập không hợp lệ.", 400);
    await query(
      "INSERT INTO practice_evidence(user_id,level,skill,question,day,lesson,topic,correct,seen_at) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,level,skill,question,day) DO NOTHING",
      user.id,
      level,
      skill,
      questionId,
      day,
      lessonId,
      topic,
      Number(correct),
      Date.now(),
    ).run();
    return response({ ok: true });
  }
  if (path === "/api/admin/users") {
    if (req.method !== "GET") return fail("Phương thức không phù hợp.", 405);
    if (user.role !== "admin")
      return fail("Chỉ quản trị viên có thể xem danh sách.", 403);
    const { results: users } = await db
      .prepare(
        "SELECT id,email,name,role,created_at AS createdAt FROM users ORDER BY created_at DESC,email",
      )
      .all();
    const { results: learning } = await db
      .prepare(
        "SELECT user_id,course,skill,completed FROM learning WHERE completed=1 ORDER BY user_id,course,skill",
      )
      .all();
    const byUser = new Map();
    for (const skill of learning) {
      if (!byUser.has(skill.user_id)) byUser.set(skill.user_id, []);
      byUser.get(skill.user_id).push(skill);
    }
    return response({
      users: users.map((u) => ({
        ...u,
        courses: groupProgress(byUser.get(u.id) || [], false),
      })),
    });
  }
  if (path === "/api/progress") {
    if (req.method === "GET") {
      const { results } = await query(
        "SELECT course,skill,completed,draft FROM learning WHERE user_id=? ORDER BY course,skill",
        user.id,
      ).all();
      return response({ courses: groupProgress(results, true) });
    }
    if (req.method === "PATCH") {
      if (data.expectedUser !== undefined && data.expectedUser !== user.id) {
        return fail("Tài khoản đã thay đổi. Vui lòng tải lại trang.", 409);
      }
      const { course } = data;
      const completed = data.completed ?? [],
        drafts = data.drafts ?? {};
      const validSkill = (s) =>
        typeof s === "string" &&
        EXERCISE.test(s) &&
        !["constructor", "prototype", "__proto__"].includes(s);
      if (
        !COURSE_IDS.has(course) ||
        !Array.isArray(completed) ||
        completed.length > 32 ||
        !completed.every(validSkill) ||
        typeof drafts !== "object" ||
        Array.isArray(drafts) ||
        Object.keys(drafts).length > 32 ||
        !Object.entries(drafts).every(
          ([key, value]) =>
            validSkill(key) &&
            typeof value === "string" &&
            value.length <= 18000,
        )
      )
        return fail("Nội dung bài học không hợp lệ.", 400);
      const writes = [];
      for (const skill of new Set(completed))
        writes.push(
          query(
            "INSERT INTO learning(user_id,course,skill,completed) VALUES(?,?,?,1) ON CONFLICT(user_id,course,skill) DO UPDATE SET completed=1",
            user.id,
            course,
            skill,
          ),
        );
      for (const [skill, draft] of Object.entries(drafts))
        writes.push(
          query(
            "INSERT INTO learning(user_id,course,skill,draft) VALUES(?,?,?,?) ON CONFLICT(user_id,course,skill) DO UPDATE SET draft=excluded.draft",
            user.id,
            course,
            skill,
            draft,
          ),
        );
      if (writes.length) await db.batch(writes);
      const { results } = await query(
        "SELECT course,skill,completed,draft FROM learning WHERE user_id=? AND course=? ORDER BY skill",
        user.id,
        course,
      ).all();
      return response(
        groupProgress(results, true)[course] || { completed: [], drafts: {} },
      );
    }
  }
  return fail("Phương thức không phù hợp.", 405);
}
export default {
  async fetch(request, env) {
    try {
      const path = new URL(request.url).pathname;
      if (path === "/api/speech-model") {
        const upstream = await fetch(
          "https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz",
        );
        if (!upstream.ok)
          return fail("Chưa tải được bộ nhận dạng tiếng Anh.", 503);
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "application/gzip",
            "Cache-Control": "public, max-age=2592000",
          },
        });
      }
      if (path === "/api/status")
        return response({ app: "lingo-hosted", aiReady: false });
      if (/^\/api\/(account\/|admin\/|progress(?:\/|$))/.test(path))
        return await handleAccount(request, env.DB);
      if (path === "/api/chat")
        return response(
          { error: "Chạy TN trên máy có AI CLI để trò chuyện." },
          503,
        );
      return await env.ASSETS.fetch(request);
    } catch {
      return fail("Máy chủ tạm thời chưa xử lý được yêu cầu.", 500);
    }
  },
};
