# Triển khai TN English AI

Tài liệu dành cho người vận hành source https://github.com/ducthong12/english_course. Cập nhật ngày 18/11/2026, đối chiếu với source và tài liệu HUONG-DAN-THEM-SUBDOMAIN.md do chủ hệ thống cung cấp.

Domain đang chạy là **https://english.ducthong.online**. Route Published application đã được tạo và xác nhận mở HTTPS trên Chrome ngày 18/11/2026. Giao diện, admin và API dùng cùng hostname. Các ví dụ chạy từ G:/work/lingo-studio trong PowerShell.

## 1. Chọn cách chạy

| Cách chạy | Dữ liệu học viên | Hội thoại AI CLI | Khi máy cá nhân tắt |
| --- | --- | --- | --- |
| pnpm dev trên Windows | SQLite của máy đó | Có, Windows x64 | Dừng |
| Windows + Nginx Docker + Cloudflare Tunnel | SQLite trên Windows | Có, dùng CLI của Windows | Domain mất origin |
| Cloudflare Worker + D1 | D1 trên Cloudflare | Chưa có backend AI CLI từ xa | Web tiếp tục hoạt động |

Luyện đọc có thu âm và đối chiếu dùng Vosk trong trình duyệt, hoạt động cả trên Worker và bản Windows. Gia sư AI gọi POST /api/chat và cần mô hình chạy trong server.py. Worker hiện trả aiReady=false và HTTP 503 cho hội thoại.

Source hiện tải llama.cpp bản Windows x64. Đóng gói nguyên server.py vào container Linux sẽ không tạo được Gia sư AI. Cấu hình Docker bên dưới chạy gateway và tunnel, ứng dụng cùng AI vẫn chạy trên Windows.

## 2. Source, bài học và dữ liệu

| Thành phần | Vị trí |
| --- | --- |
| Giao diện, từ vựng và đề bài | dist/*.js, dist/index.html, dist/*.css |
| Hình, âm thanh và video | dist/art, dist/media |
| API và mô hình AI cục bộ | server.py |
| API tài khoản và tiến độ dùng chung | account/worker.mjs |
| Bộ chuyển đổi SQLite, lệnh admin | account/local.mjs |
| Lược đồ SQLite/D1 | drizzle/*.sql |
| Build Worker và static assets | pnpm build → dist/server và dist/client |

Bài học được phân phối theo phiên bản Git. SQLite/D1 lưu tài khoản, phiên đăng nhập, tiến độ, bài nháp, sổ tay, lịch ôn, bài yêu thích và kết quả dùng để gợi ý ôn tập.

Ba thư mục cần phân biệt khi sao lưu

- Source tại G:/work/lingo-studio.
- Mặc định dữ liệu học viên tại %LOCALAPPDATA%/LingoStudio/learners.sqlite.
- Mặc định cache AI tại %LOCALAPPDATA%/LingoEnglish/ai-b12496.

Các tên thư mục Lingo được giữ trong cơ chế lưu trữ để tương thích dữ liệu đã tạo. Biến LINGO_DATA_DIR và LINGO_AI_DIR cho phép chọn vị trí rõ ràng trên máy triển khai.

## 3. Chạy source và kiểm tra trên Windows

Cài Git, Node.js từ 22.13 trở lên, pnpm 10 và Python từ 3.9 trở lên. Bản AI cần Windows x64. Nên dùng Node.js 24 LTS, kiểm tra cả node -v và pnpm exec node -v nếu pnpm báo lệch phiên bản.

~~~powershell
git clone https://github.com/ducthong12/english_course.git G:/work/lingo-studio
Set-Location G:/work/lingo-studio
pnpm install --frozen-lockfile
pnpm build
~~~

Nếu thư mục source đã có, dùng git status và git pull --ff-only sau khi đã lưu thay đổi riêng của máy.

Chọn thư mục dữ liệu trước lần chạy đầu của môi trường mới

~~~powershell
$env:LINGO_DATA_DIR = 'G:/data/tn-english'
$env:LINGO_AI_DIR = 'G:/data/tn-english-ai'
$env:LINGO_PORT = '8765'
pnpm dev
~~~

Máy đã có tài khoản cần giữ đường dẫn dữ liệu đang dùng hoặc sao lưu/chuyển dữ liệu trước khi đổi biến môi trường. Chọn thư mục trống sẽ khởi tạo một cơ sở dữ liệu mới.

Mở http://127.0.0.1:8765. Lần đầu AI tải khoảng 423 MB, sau đó dùng cache. Vosk tải khoảng 41 MB khi bắt đầu luyện thu âm.

~~~powershell
Invoke-RestMethod http://127.0.0.1:8765/api/status
~~~

Kết quả aiReady=true xác nhận mô hình hội thoại đã sẵn sàng. Bộ kiểm tra trạng thái dùng định danh app=lingo-classroom để tương thích API.

### Cấp quyền admin

1. Đăng ký tài khoản trong giao diện.
2. Mở terminal thứ hai tại source.
3. Đặt cùng LINGO_DATA_DIR như terminal chạy server rồi cấp quyền.

~~~powershell
$env:LINGO_DATA_DIR = 'G:/data/tn-english'
pnpm admin admin@example.com
~~~

Đăng nhập bằng tài khoản đó, mở mục quản trị hoặc /#admin. Lệnh admin chỉ tác động cơ sở dữ liệu trên máy đang chạy lệnh.

## 4. Đưa máy Windows lên subdomain qua Docker

Luồng chạy

~~~text
Trình duyệt HTTPS
  → Cloudflare DNS/Tunnel
  → container cloudflared
  → http://tn-gateway:8080
  → host.docker.internal:8765
  → Windows server.py
  → dịch vụ tài khoản SQLite và AI CLI
~~~

Source hiện chỉ chấp nhận Host và Origin cục bộ cho API. Gateway đã chuẩn bị sẽ kiểm tra Origin công khai trước, rồi chuyển Host/Origin thành địa chỉ cục bộ cho upstream. Cookie đăng nhập ra ngoài có Secure, HttpOnly và SameSite=Lax.

Đường dẫn FE và API cùng domain. Cấu hình này dùng một public hostname, Path để trống.

### 4.1 Chạy gateway trên máy công ty hiện tại

Đã xác nhận container zalo_bot-tunnel-1 chạy trong mạng Docker zalo_bot_default. File compose.company.yaml chọn đúng mạng này. Nó dành cho máy công ty có tunnel sẵn.

~~~powershell
Set-Location G:/work/lingo-studio
docker compose -p tn-english-gateway -f docs/deploy/compose.gateway.yaml -f docs/deploy/compose.company.yaml up -d
docker compose -p tn-english-gateway -f docs/deploy/compose.gateway.yaml -f docs/deploy/compose.company.yaml exec -T tn-gateway nginx -t
curl.exe -fsS -H "Host: english.ducthong.online" http://127.0.0.1:8780/api/status
~~~

Gateway dùng tên mạng tn-gateway và cổng nội bộ 8080. Cổng 8780 chỉ publish ở 127.0.0.1 để chẩn đoán trên máy.

### 4.2 Máy mới với mạng edge riêng

Nếu máy chưa có tunnel, tạo một tunnel được quản lý từ dashboard Cloudflare. Lưu token trong thư mục vận hành ngoài repo, ví dụ G:/deploy/cloudflared/.tunnel-token. Sao chép compose.tunnel.example.yaml thành G:/deploy/cloudflared/compose.yaml.

~~~powershell
Set-Location G:/deploy/cloudflared
docker compose up -d
docker compose logs --tail 30 tunnel
~~~

Khi log có Registered tunnel connection và dashboard báo Healthy, chạy gateway với cấu hình edge mặc định

~~~powershell
Set-Location G:/work/lingo-studio
docker compose -p tn-english-gateway -f docs/deploy/compose.gateway.yaml up -d
~~~

Ở máy này dùng file gateway mặc định. File company chọn mạng zalo_bot_default của máy công ty và chỉ dùng khi mạng đó tồn tại.

### 4.3 Domain và route trong Cloudflare

Domain ducthong.online phải Active trên Cloudflare. Nameserver trong file tham khảo là hal.ns.cloudflare.com và perla.ns.cloudflare.com. Xác nhận trạng thái zone hiện tại trên dashboard trước khi cấu hình một môi trường mới.

Trong Networking → Tunnels → tunnel của máy đang phục vụ → Routes → Add route → Published application

| Trường | Giá trị |
| --- | --- |
| Subdomain | english |
| Domain | ducthong.online |
| Path | Để trống |
| Service URL | http://tn-gateway:8080 |

Cloudflare sẽ tạo DNS route cho hostname khi lưu thành công. Kiểm tra bản ghi english trước nếu hostname đã phục vụ một ứng dụng khác. Domain này nên có một origin được chọn rõ ràng tại một thời điểm.

Trong file tham khảo, localhost của container cloudflared là chính container đó. Với TN, Service URL phải trỏ tới gateway cùng mạng. Trỏ thẳng vào server.py sẽ làm các API bị 403 do Host/Origin công khai.

### 4.4 Khi đổi domain hoặc cổng app

Trong tn-gateway.conf, đổi tất cả english.ducthong.online sang hostname mới. Khi đổi LINGO_PORT, đổi đồng thời địa chỉ proxy_pass, header Host và Origin cục bộ từ 8765 sang cổng mới. Sau đó chạy nginx -t rồi recreate gateway.

### 4.5 Giới hạn vận hành

- Máy Windows phải bật, không sleep, ứng dụng và Docker Desktop phải chạy.
- restart: unless-stopped chỉ tự khởi động container. Tiến trình pnpm dev trên Windows cần được khởi động riêng.
- Để tự chạy ứng dụng sau đăng nhập, có thể tạo Windows Task Scheduler với chương trình PowerShell, thư mục làm việc G:/work/lingo-studio và một script đặt đủ ba biến LINGO_DATA_DIR, LINGO_AI_DIR, LINGO_PORT rồi chạy pnpm dev. Dùng cùng tài khoản Windows sở hữu dữ liệu.
- Source hiện dùng máy chủ Python phục vụ ứng dụng và một lượt AI đồng thời. Cần đo tải và điều chỉnh kiến trúc trước khi nhận lượng lớn học viên.
- Endpoint hội thoại hiện cho khách dùng được. Domain public sẽ cho người ngoài gọi AI trên máy. Có thể giới hạn toàn hostname bằng Cloudflare Access nếu chỉ chia sẻ nội bộ.
- HTTPS là điều kiện cho micro ở domain công khai. Trình duyệt vẫn cần người học cấp quyền micro.

## 5. Kiểm tra sau deploy

~~~powershell
Resolve-DnsName english.ducthong.online -Server 1.1.1.1
curl.exe -I https://english.ducthong.online
Invoke-RestMethod https://english.ducthong.online/api/status
~~~

Kiểm tra trong Chrome

1. Trang TN English AI tải đầy đủ logo, hình và video.
2. Đăng ký/đăng nhập, làm một bài, tải lại trang và kiểm tra tiến độ.
3. Tài khoản thường không mở được danh sách admin.
4. Gia sư AI trả lời một tin nhắn ngắn. aiReady phải true.
5. Luyện nói nhận micro, phát mẫu và đối chiếu bản thu.
6. Sổ tay và bài nháp được khôi phục sau tải lại.
7. Developer Tools → Application → Cookies xác nhận cookie lingo_session có Secure, HttpOnly và SameSite=Lax.
8. Đăng xuất rồi kiểm tra /api/account/me trả user=null.

Học liệu và API đều cùng origin. Khi dùng Cloudflare Access, lệnh curl có thể nhận trang đăng nhập Access, cần kiểm tra trong Chrome đã xác thực.

## 6. Cập nhật và quay lại phiên bản trước

Trước khi cập nhật, lưu commit đang chạy và sao lưu dữ liệu như phần 7.

~~~powershell
Set-Location G:/work/lingo-studio
git status --short
git rev-parse HEAD
git pull --ff-only
pnpm install --frozen-lockfile
pnpm build
~~~

Dừng terminal chạy app cũ bằng Ctrl+C rồi chạy lại với cùng biến môi trường. Khi thay gateway.conf, dùng lại đúng lệnh compose đã chọn ở phần 4 và thêm up -d --force-recreate.

Nếu cần quay lại, chọn commit đã ghi và chạy trong checkout triển khai sạch

~~~powershell
git switch --detach COMMIT_TRUOC
pnpm install --frozen-lockfile
pnpm build
~~~

Khởi động lại app. Nếu phiên bản mới đã thay lược đồ dữ liệu, phải kiểm tra tương thích hoặc phục hồi bản sao lưu tương ứng. Quay lại source tự nó không đảo ngược dữ liệu đã thay đổi.

## 7. Sao lưu và phục hồi SQLite

Dữ liệu học viên cần được sao lưu tách khỏi Git và cache mô hình AI.

Ví dụ sao lưu nhất quán bằng SQLite backup API ngay khi ứng dụng đang chạy

~~~powershell
New-Item -ItemType Directory -Force G:/backups/tn-english | Out-Null
$env:TN_BACKUP_SOURCE = 'G:/data/tn-english/learners.sqlite'
$env:TN_BACKUP_DEST = 'G:/backups/tn-english/learners-2026-11-18.sqlite'
python -c "import os,sqlite3;src=sqlite3.connect('file:'+os.environ['TN_BACKUP_SOURCE']+'?mode=ro',uri=True);dst=sqlite3.connect(os.environ['TN_BACKUP_DEST']);src.backup(dst);print(dst.execute('PRAGMA integrity_check').fetchone()[0]);dst.close();src.close()"
~~~

Kết quả kiểm tra phải là ok. Đặt tên file mới cho mỗi bản sao lưu. Khi phục hồi, dừng app và dịch vụ SQLite, giữ bản cơ sở dữ liệu hiện tại làm bản dự phòng, rồi thay toàn bộ bộ dữ liệu đang dùng bằng bản đã kiểm tra. Không giữ các file -wal/-shm cũ đi kèm một learners.sqlite vừa phục hồi.

Một cách phục hồi dễ kiểm soát là đặt bản sao lưu vào một thư mục mới chỉ có learners.sqlite, trỏ LINGO_DATA_DIR tới thư mục đó và khởi động app. Kiểm tra tài khoản và tiến độ trước khi dùng chính thức.

## 8. Hai máy luân phiên

Hiện chưa triển khai đồng bộ dữ liệu hai máy. Cùng commit Git sẽ có cùng bài học, còn mỗi SQLite vẫn có tài khoản và tiến độ riêng.

Cloudflare có hỗ trợ hai connector dùng cùng tunnel dưới dạng replica. Khi một connector ngắt, connector còn lại có thể nhận lưu lượng. Cả hai phải có cùng route/service có thể truy cập được. Đây là tính năng hạ tầng, không đồng bộ SQLite.

Nếu bàn giao máy thủ công, dừng ghi ở máy cũ, tạo backup nhất quán, chuyển backup sang máy mới rồi khởi động app ở máy mới. Tránh chạy đồng thời hai bản SQLite độc lập cho cùng hostname nếu cần một tiến độ thống nhất. Không đặt file SQLite đang hoạt động trong thư mục đồng bộ đám mây để thay cơ chế bàn giao.

## 9. Phương án Worker + D1

Phương án này đưa web, admin và dữ liệu học lên Cloudflare. Hội thoại AI CLI vẫn cần một backend riêng trong tương lai. Source hiện chưa nối Worker với máy AI từ xa.

~~~powershell
Set-Location G:/work/lingo-studio
pnpm build
Copy-Item docs/deploy/wrangler.example.jsonc docs/deploy/wrangler.local.jsonc
pnpm dlx wrangler@4 login
pnpm dlx wrangler@4 d1 create tn-english
~~~

Điền database_id do Cloudflare trả về vào wrangler.local.jsonc. Config đã có binding DB, ASSETS và custom domain english.ducthong.online. Nếu hostname đang trỏ Tunnel, phải chọn phương án chuyển đổi và xử lý route cũ trước khi đưa Worker lên cùng hostname.

Khởi tạo lược đồ

~~~powershell
pnpm dlx wrangler@4 d1 execute tn-english --remote --config docs/deploy/wrangler.local.jsonc --file drizzle/0000_accounts.sql
pnpm dlx wrangler@4 d1 execute tn-english --remote --config docs/deploy/wrangler.local.jsonc --file drizzle/0001_evidence.sql
pnpm dlx wrangler@4 deploy --config docs/deploy/wrangler.local.jsonc
~~~

Các đường dẫn assets/main trong cấu hình tính từ thư mục docs/deploy. Các đường dẫn --file ở ví dụ trên tính từ thư mục source đang chạy lệnh.

Đăng ký tài khoản trên web Worker, sau đó cấp admin trong D1 của đúng môi trường

~~~powershell
pnpm dlx wrangler@4 d1 execute tn-english --remote --config docs/deploy/wrangler.local.jsonc --command "UPDATE users SET role='admin' WHERE email='admin@example.com';"
~~~

Kiểm tra số hàng thay đổi. Lệnh pnpm admin trên Windows chỉ tác động SQLite.

Xuất bản sao D1

~~~powershell
pnpm dlx wrangler@4 d1 export tn-english --remote --config docs/deploy/wrangler.local.jsonc --output G:/backups/tn-english/d1-2026-11-18.sql
~~~

Sites đang dùng .openai/hosting.json để gắn dự án và DB. Nếu triển khai qua Sites, dùng pipeline Sites và binding DB hiện có. Nếu dùng Wrangler, quản lý D1/config theo phương án này. Dữ liệu SQLite, D1 của Sites và D1 tạo bằng Wrangler là các môi trường riêng.

## 10. Chẩn đoán lỗi

| Triệu chứng | Kiểm tra |
| --- | --- |
| Cloudflare 1033 | Tunnel có connector Healthy không, máy và container cloudflared có đang chạy không |
| Cloudflare 502 | App/gateway có chạy, service URL/cổng đúng, gateway và tunnel có cùng mạng Docker |
| GET trang được nhưng đăng nhập/chat 403 | Route có đi qua gateway, domain và Origin có đúng danh sách trong tn-gateway.conf |
| Cookie đăng nhập không được gửi | HTTPS, tên host thống nhất, cookie Secure và app cùng origin |
| AI trả 503, aiReady=false | Chờ tải mô hình, kiểm tra Windows x64, cache và log app; Worker hiện chưa có AI CLI |
| AI trả 429 | Mô hình đang xử lý một lượt khác, chờ rồi gửi lại |
| Không thấy tài khoản cũ | LINGO_DATA_DIR hoặc cơ sở dữ liệu môi trường đã đổi |
| Mất quyền admin sau chuyển máy | Kiểm tra đúng SQLite và email, hoặc đúng D1 của web đang dùng |
| Chặn micro | Mở HTTPS, cấp quyền micro trong Chrome, đóng ứng dụng khác đang giữ thiết bị |
| SSL vừa thêm domain chưa hoạt động | Kiểm tra Universal SSL/Edge Certificates Active và DNS |
| Trình duyệt thấy phiên bản cũ | Kiểm tra commit, restart app, tải lại trang và cache Cloudflare |
| curl lỗi kiểm tra thu hồi chứng chỉ ở máy công ty | Dùng Chrome để xác minh trước; chỉ dùng --ssl-no-revoke để chẩn đoán theo chính sách mạng của đơn vị |

## 11. Bảo vệ cấu hình

Token tunnel là bí mật cho phép chạy connector của tunnel, cần lưu ngoài Git. Khi lộ token, rotate trên dashboard và cập nhật các connector đang dùng. API token Cloudflare có phạm vi quản trị khác, giữ riêng và giới hạn quyền theo tác vụ.

Các file .env, .tunnel-token, wrangler.local.jsonc và bản sao lưu dữ liệu phải được loại khỏi Git. Cấu hình mẫu trong docs/deploy không chứa token. Các sample image Docker dùng tag thuận tiện cho cài đặt, khi vận hành lâu dài nên ghi nhận image digest đã kiểm thử để cập nhật có kiểm soát.

## 12. Những phần đã kiểm tra

- pnpm build trên source Windows.
- Kết nối từ container Docker Desktop tới app Windows qua host.docker.internal.
- Nginx kiểm tra cấu hình thành công.
- Gateway thử nghiệm với cơ sở dữ liệu QA riêng đã qua đăng ký, cookie Secure/HttpOnly/SameSite, lưu tiến độ, chặn Origin sai và hội thoại AI thực tế.
- Cấu hình Compose gateway phân tích được.
- Cloudflare đã trả Route added successfully và tự tạo CNAME english.ducthong.online. Trang TN English AI đã tải được qua HTTPS trên Google Chrome. API trạng thái công khai trả aiReady=true.
- Phương án Worker/Wrangler là cấu hình tham khảo theo entrypoint hiện có, chưa tạo thêm D1 hoặc triển khai thêm Worker trong quá trình viết tài liệu.

## 13. Nguồn đối chiếu

- HUONG-DAN-THEM-SUBDOMAIN.md trong Downloads, dùng làm ngữ cảnh hệ thống tại ngày người dùng cung cấp.
- [Cloudflare Tunnel và replicas](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-availability/)
- [Custom Domains cho Workers](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Lệnh D1 Wrangler](https://developers.cloudflare.com/d1/wrangler-commands/)
- [Nginx proxy và cookie flags](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cookie_flags)
