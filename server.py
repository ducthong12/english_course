"""Serve the course and its on-device English tutor. Requires Windows x64 and Python 3.9+."""

import contextlib
import hashlib
import http.client
import json
import os
import platform
import shutil
import socket
import subprocess
import threading
import urllib.request
import webbrowser
import zipfile
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory


ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
PORT = int(os.environ.get("LINGO_PORT", 8765))
ORIGIN = f"http://127.0.0.1:{PORT}"
CACHE = Path(os.environ.get("LINGO_AI_DIR") or
             (Path(os.environ.get("LOCALAPPDATA", ".")) / "LingoEnglish" / "ai-b12496"))
ENGINE = CACHE / "bin" / "llama-completion.exe"
MODEL = CACHE / "tutor.gguf"
ENGINE_URL = "https://github.com/ggml-org/llama.cpp/releases/download/b12496/llama-b12496-bin-win-cpu-x64.zip"
MODEL_URL = ("https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/"
             "41ba88dbac95fed2528c92514c131d73eb5a174b/Qwen2.5-0.5B-Instruct-Q4_K_M.gguf")
LEVELS = {"A1", "A2", "B1", "B2", "IELTS", "Office", "Kids6"}
READY = threading.Event()
INFERENCE = threading.BoundedSemaphore(1)
setup_error = ""
SPEECH_MODEL_URL = "https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz"
SPEECH_MODEL_SHA = "f0b24bb92a48ca575b6a96500d6b543f0f079c573dfe85bbe16001fc0404e1d8"
speech_download = threading.Lock()


def download(url, dest, checksum):
    digest = hashlib.sha256()
    with urllib.request.urlopen(url, timeout=90) as response, dest.open("wb") as file:
        while block := response.read(1024 * 1024):
            digest.update(block)
            file.write(block)
    if digest.hexdigest() != checksum:
        raise ValueError("Downloaded file failed its integrity check")


def prepare_ai():
    global setup_error
    try:
        if os.name != "nt" or platform.machine().lower() not in {"amd64", "x86_64"}:
            raise RuntimeError("The bundled setup needs Windows x64")
        CACHE.mkdir(parents=True, exist_ok=True)
        if not ENGINE.is_file() or not MODEL.is_file():
            print("Preparing the English tutor (first launch downloads 423 MB)…", flush=True)
            with TemporaryDirectory(dir=CACHE) as staging:
                stage = Path(staging)
                if not ENGINE.is_file():
                    archive = stage / "engine.zip"
                    download(ENGINE_URL, archive, "f02e029c0f4f0f9c8ea341ef47d0fd28191df0bcfa5ab4f40f4aa43942e943ea")
                    with zipfile.ZipFile(archive) as files:
                        files.extractall(stage / "bin")
                    shutil.copytree(stage / "bin", CACHE / "bin", dirs_exist_ok=True)
                if not MODEL.is_file():
                    model = stage / "tutor.gguf"
                    download(MODEL_URL, model, "6eb923e7d26e9cea28811e1a8e852009b21242fb157b26149d3b188f3a8c8653")
                    model.replace(MODEL)
        READY.set()
        print("English tutor ready.", flush=True)
    except (OSError, ValueError, RuntimeError, zipfile.BadZipFile) as exc:
        setup_error = "Chưa chuẩn bị được AI. Kiểm tra kết nối và mở lại Start.cmd trên Windows x64."
        print(f"AI setup: {exc}", flush=True)


def chat_prompt(payload):
    if not isinstance(payload, dict) or payload.get("level") not in LEVELS:
        raise ValueError
    level, messages = payload["level"], payload.get("messages")
    if not isinstance(messages, list) or not 1 <= len(messages) <= 12:
        raise ValueError
    instruction = (
        f"You are a friendly English conversation tutor for a {level} learner. "
        "Use short, natural English at the learner's level. Reply to their last message, "
        "give one gentle correction when useful, and ask a related question. "
        "Keep replies under four sentences."
    )
    if level == "Kids6":
        instruction = (
            "Talk with a young child who is starting English. Use two very short sentences "
            "with easy words like cat, dog, red, big, like, play. Ask one simple question. "
            "Example: I like dogs. Do you have a dog?"
        )
    turns = [("system", instruction)]
    for message in messages:
        if not isinstance(message, dict) or message.get("role") not in ("user", "assistant"):
            raise ValueError
        content = message.get("content")
        if not isinstance(content, str) or not 1 <= len(content.strip()) <= 3000:
            raise ValueError
        # The template delimiters must come exclusively from this server.
        turns.append((message["role"], content.strip().replace("<|", "< |").replace("\x00", "")))
    if turns[-1][0] != "user":
        raise ValueError
    # Keep recent context within the native model's context window and Windows command-line limit.
    while sum(len(content) for _, content in turns) > 5500:
        turns.pop(1)
    return "".join(f"<|im_start|>{role}\n{content}<|im_end|>\n" for role, content in turns) + "<|im_start|>assistant\n"


class Classroom(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def list_directory(self, path):
        self.send_error(404)

    def do_GET(self):
        if self.path == "/api/speech-model":
            try:
                model = CACHE / "speech-small-en-us-0.15.tar.gz"
                with speech_download:
                    if not model.exists():
                        CACHE.mkdir(parents=True, exist_ok=True)
                        with TemporaryDirectory(dir=CACHE) as temp:
                            staged = Path(temp) / "model"
                            download(SPEECH_MODEL_URL, staged, SPEECH_MODEL_SHA)
                            staged.replace(model)
                self.send_response(200)
                self.send_header("Content-Type", "application/gzip")
                self.send_header("Content-Length", str(model.stat().st_size))
                self.send_header("Cache-Control", "private, max-age=2592000")
                self.end_headers()
                with model.open("rb") as source:
                    shutil.copyfileobj(source, self.wfile)
            except (OSError, ValueError) as exc:
                if not isinstance(exc, ConnectionError):
                    self.send_json(503, {"error": "Chưa tải được bộ nhận dạng tiếng Anh."})
            return
        if self.path == "/api/status":
            return self.send_json(200, {"app": "lingo-classroom", "aiReady": READY.is_set()})
        if self.path.startswith("/api/"):
            return self.account_request()
        super().do_GET()

    def account_request(self):
        if self.headers.get("Host") != f"127.0.0.1:{PORT}" or (
            self.command != "GET" and self.headers.get("Origin") != ORIGIN
        ):
            return self.send_json(403, {"error": "Vui lòng mở lớp học từ Start.cmd."})
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            return self.send_json(400, {"error": "Kích thước dữ liệu không hợp lệ."})
        if not 0 <= length <= 65_536:
            return self.send_json(413, {"error": "Dữ liệu quá dài."})
        headers = {name: self.headers[name] for name in ("Host", "Cookie", "Content-Type", "Origin") if name in self.headers}
        try:
            with contextlib.closing(http.client.HTTPConnection("127.0.0.1", self.server.account_port, timeout=15)) as api:
                api.request(self.command, self.path, self.rfile.read(length) if length else None, headers)
                upstream = api.getresponse()
                body = upstream.read()
                self.send_response(upstream.status)
                for name, value in upstream.getheaders():
                    if name.lower() in {"content-type", "set-cookie", "cache-control", "x-content-type-options"}:
                        self.send_header(name, value)
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                with contextlib.suppress(ConnectionError):
                    self.wfile.write(body)
        except (OSError, http.client.HTTPException):
            self.send_json(503, {"error": "Dịch vụ tài khoản chưa sẵn sàng. Vui lòng mở lại Start.cmd."})

    def do_PATCH(self):
        if self.path != "/api/progress":
            return self.send_json(404, {"error": "Không tìm thấy chức năng."})
        self.account_request()

    def send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        with contextlib.suppress(ConnectionError):
            self.wfile.write(body)

    def do_POST(self):
        if self.path != "/api/chat":
            if self.path.startswith("/api/account/"):
                return self.account_request()
            return self.send_json(404, {"error": "Không tìm thấy chức năng."})
        if self.headers.get("Host") != f"127.0.0.1:{PORT}" or self.headers.get("Origin") != ORIGIN:
            return self.send_json(403, {"error": "Mở ứng dụng từ đường dẫn cục bộ của Start.cmd."})
        try:
            length = int(self.headers.get("Content-Length", 0))
            if not 0 < length <= 64_000 or self.headers.get_content_type() != "application/json":
                raise ValueError
            prompt = chat_prompt(json.loads(self.rfile.read(length)))
        except (ValueError, TypeError):
            return self.send_json(400, {"error": "Tin nhắn chưa hợp lệ. Hãy nhập tối đa 3.000 ký tự."})
        if not READY.is_set():
            return self.send_json(503, {"error": setup_error or "Đang tải mô hình AI lần đầu (423 MB). Vui lòng thử lại sau."})
        if not INFERENCE.acquire(blocking=False):
            return self.send_json(429, {"error": "AI đang trả lời một lượt khác. Bạn thử lại sau nhé."})
        try:
            run = subprocess.run(
                [str(ENGINE), "-m", str(MODEL), "-p", prompt, "-n", "140", "-c", "8192",
                 "-t", "4", "--offline", "--no-display-prompt", "--no-conversation",
                 "--simple-io", "--color", "off", "--no-perf", "--no-warmup"],
                shell=False, cwd=CACHE, stdin=subprocess.DEVNULL, capture_output=True,
                encoding="utf-8", errors="replace", timeout=100, check=True,
            )
            reply = run.stdout.strip().removesuffix("[end of text]").strip()
            if not reply:
                raise ValueError("empty reply")
            self.send_json(200, {"reply": reply})
        except (OSError, ValueError, subprocess.SubprocessError):
            self.send_json(503, {"error": "AI chưa phản hồi. Hãy thử lại với một câu ngắn hơn."})
        finally:
            INFERENCE.release()


class LocalServer(ThreadingHTTPServer):
    allow_reuse_address = False

    def server_bind(self):
        if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


if __name__ == "__main__":
    import sys
    if "--grant-admin" in sys.argv:
        address = input("Email của tài khoản đã đăng ký trên máy này: ").strip()
        sys.exit(subprocess.call(["node", str(ROOT / "account" / "local.mjs"), "--grant-admin", address], cwd=ROOT))
    try:
        httpd = LocalServer(("127.0.0.1", PORT), Classroom)
    except OSError:
        with urllib.request.urlopen(f"{ORIGIN}/api/status", timeout=3) as status:
            if json.load(status).get("app") != "lingo-classroom":
                raise RuntimeError(f"Port {PORT} already in use")
        if "--open" in sys.argv:
            webbrowser.open(ORIGIN)
        sys.exit(0)
    with httpd as server, subprocess.Popen(
        ["node", str(ROOT / "account" / "local.mjs"), "--parent-pipe"], cwd=ROOT,
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, encoding="utf-8",
    ) as accounts:
        startup = accounts.stdout.readline()
        if not startup:
            raise RuntimeError("Account service needs Node.js 22.13+ with node:sqlite support.")
        server.account_port = int(json.loads(startup)["port"])
        threading.Thread(target=prepare_ai, daemon=True).start()
        print(f"English classroom: {ORIGIN}", flush=True)
        if "--open" in sys.argv:
            webbrowser.open(ORIGIN)
        try:
            with contextlib.suppress(KeyboardInterrupt):
                server.serve_forever()
        finally:
            accounts.terminate()
