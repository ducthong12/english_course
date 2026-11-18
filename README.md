# TN

Giao diện học, trang quản trị, API tài khoản, cơ sở dữ liệu và cầu nối AI CLI nằm trong cùng workspace.

## Chạy trên máy tính

Cài Node.js 22.13 trở lên, pnpm 10 và Python 3.9 trở lên. Bản AI cục bộ dùng Windows x64. Mở terminal tại thư mục chứa `package.json` và chạy:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Mở [TN](http://127.0.0.1:8765). Cũng có thể nhấp đúp `Start.cmd` trên Windows để mở trang trong trình duyệt. Dừng máy chủ bằng Ctrl+C.

## Cấp quyền quản trị

1. Đăng ký tài khoản trong giao diện học.
2. Mở terminal thứ hai tại workspace và thay địa chỉ mẫu bằng email vừa đăng ký:

   ```sh
   pnpm admin ban@example.com
   ```

3. Tải lại trang bằng tài khoản đó để mở giao diện quản trị. Trên Windows, lệnh `Start.cmd admin` cũng cho phép nhập email để cấp quyền.

Tài khoản, phiên đăng nhập, bài đã hoàn thành và bản nháp được lưu trong SQLite tại `%LOCALAPPDATA%\LingoStudio\learners.sqlite`. Có thể đặt biến môi trường `LINGO_DATA_DIR` trước khi chạy để chọn thư mục dữ liệu. Lệnh cấp quyền và máy chủ phải dùng cùng thư mục này.

## Hội thoại AI

Lần đầu chạy, máy chủ tải khoảng 423 MB cho llama.cpp CLI và mô hình Qwen2.5-0.5B-Instruct. Máy chủ kiểm tra SHA-256 từng tệp trước khi cài đặt. Các bài học dùng được trong lúc chuẩn bị AI. Mô hình được lưu ở `%LOCALAPPDATA%\LingoEnglish\ai-b12496`. Sau khi tải xong, CLI xử lý hội thoại trên máy và hoạt động ngoại tuyến. Nguồn tải nằm trong `server.py`. Mô hình nhỏ phù hợp để thực hành, không phải công cụ chấm điểm IELTS.

Máy chủ cục bộ chỉ lắng nghe tại `127.0.0.1`. Giao diện tự điều chỉnh theo kích thước màn hình. Bản triển khai web dùng Worker và D1 cho tài khoản, tách biệt với SQLite và mô hình AI trên máy cá nhân.

## Mã nguồn

| Thành phần | Vị trí |
| --- | --- |
| Giao diện học, quản trị và học liệu | `dist/` |
| Máy chủ cục bộ và AI CLI | `server.py` |
| Xử lý API tài khoản, tiến độ và quản trị | `account/worker.mjs` |
| Dịch vụ SQLite và lệnh cấp quyền | `account/local.mjs` |
| Lược đồ dữ liệu | `drizzle/0000_accounts.sql` |

Các API dùng cùng origin với trang web. Đăng nhập tạo cookie HttpOnly. `GET /api/progress` và `PATCH /api/progress` làm việc với dữ liệu của người đang đăng nhập. `GET /api/admin/users` yêu cầu quyền quản trị. `POST /api/chat` gọi AI CLI của bản cục bộ.

## Học liệu và cơ sở thiết kế

Bộ học liệu hiện có 240 chủ đề mới, 480 video luyện nghe/phát âm, 240 hội thoại và 30 bài viết chuyển soạn từ sách Writing 1. Mỗi bài có một video nghe, một video hướng dẫn phát âm, IPA, câu hỏi và hoạt động thực hành.

- A1–B2 dùng tình huống đời thường có độ khó tăng dần, từ gọi cà phê đến thảo luận chuyện đi làm. Cách tổ chức theo trình độ và nghe rồi làm bài tập được tham khảo từ [British Council Listening](https://learnenglish.britishcouncil.org/free-resources/listening).
- IELTS có bài tập lập luận 250 từ theo định dạng Academic Writing Task 2. Bộ đếm từ giúp theo dõi độ dài bài, chưa đánh giá bốn tiêu chí chấm band. [IELTS Academic Writing](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing)
- Tiếng Anh văn phòng dùng một cuộc họp để kết nối ba việc thường đi cùng nhau: nghe hạn gửi, luyện lời đề nghị lịch sự và viết email xác nhận. [British Council Business Magazine](https://learnenglish.britishcouncil.org/business-english/business-magazine)
- Bé 3–6 tuổi nghe, chỉ hình, nhắc lại và chơi với người lớn. Bé 6–10 tuổi nghe truyện, chọn chi tiết rồi viết hai câu ngắn. [Học tiếng Anh tại nhà](https://learnenglishkids.britishcouncil.org/parents/helping-your-child/how-start-teaching-kids-english-home) · [LearnEnglish Kids Short Stories](https://learnenglishkids.britishcouncil.org/listen-watch/short-stories)

Tiến độ được tính theo từng bài trong năm kỹ năng. Mỗi lộ trình có tối thiểu 30 bài cho mỗi kỹ năng. Phần nghe hiểu và ngữ pháp ghi nhận khi trả lời đúng. Bài chính tả so khớp theo số từ thêm, thiếu hoặc thay đổi. Phần phát âm do người học tự xác nhận.


## Bản mở rộng học liệu

Kho từ có 3.895 đầu mục khác nhau, gồm 782 A1, 756 A2, 1.202 B1 và 1.155 B2. Mỗi từ có nghĩa tiếng Việt, IPA và từ loại. Nguồn và giấy phép nằm ở dist/word-source/README.md. Kho thẻ hình có 96 từ thuộc tám chủ đề, kèm âm thanh và ba cách luyện. Thẻ từ của hai nhóm trẻ em có hình minh họa.

Ngữ pháp có 57 chủ điểm và 285 câu mới. Mỗi bài nhỏ gồm hai câu luyện trong cùng chủ điểm, có quy tắc và giải thích đáp án. Danh mục hỗ trợ tìm kiếm và lọc theo chủ điểm. Cách tổ chức tham khảo [DOL](https://www.dolenglish.vn/blog/web-hoc-ngu-phap-tieng-anh) và [British Council](https://learnenglish.britishcouncil.org/free-resources/grammar).

Speaking có 240 hội thoại bốn lượt. Người học chọn vai và thu âm hai lượt. Vosk nhận dạng trên thiết bị rồi đối chiếu lời đọc với câu mẫu theo số từ thêm, thiếu và thay thế. Điểm khớp từ chưa đánh giá âm vị, trọng âm hay ngữ điệu. Mức hoàn thành mặc định 80% ở cả hai lượt. Lần đầu tải mô hình tiếng Anh khoảng 41 MB. HTTPS hoặc địa chỉ 127.0.0.1 cùng quyền micro là điều kiện để ghi âm. Bản thu được xử lý trong trình duyệt. [Vosk Browser](https://github.com/ccoreilly/vosk-browser)

Gợi ý học tập sử dụng Bayesian Knowledge Tracing với tham số ban đầu chưa hiệu chỉnh bằng dữ liệu thực tế. Hệ thống ghi lượt trả lời đầu, nhận diện các chủ điểm có nhiều câu sai và nhắc ôn sau bảy ngày. Các kỹ năng thiếu dữ liệu hiện là chưa đánh giá. Writing dùng mục tiêu số từ và checklist tự rà soát, chưa chấm chất lượng văn bản. [Nghiên cứu Knowledge Tracing](https://doi.org/10.1007/BF01099821)

Writing 1 gồm 30 đề chuyển soạn theo 30 chủ đề của Chắp bút 1000 câu Writing – Tập 1, mỗi đề có hướng dẫn mới và trang tham khảo trong sách người dùng cung cấp. Các mức học là lựa chọn biên tập của dự án.

Minh họa thẻ từ sử dụng Microsoft Fluent Emoji qua bản WebP LobeHub. Điều khoản MIT được lưu ở dist/art/words. Vosk Browser theo Apache-2.0, bản giấy phép được lưu ở dist/vendor.

## Ngữ pháp theo sách và luyện nghe từng câu

Mục Ngữ pháp có nút "Học theo sách Giải thích ngữ pháp". Bản chuyển soạn gồm 37 chủ điểm, 74 câu mới trong chín chương, dựa trên mục lục và các trang lý thuyết đã kiểm tra của sách Mai Lan Hương – Hà Thanh Uyên, tái bản 2015. Mỗi bài ghi trang in và trang PDF. Mức A1–B2 do TN đề xuất. Đây là phần chuyển soạn các chủ điểm, chưa số hóa toàn bộ bài tập hoặc đáp án của sách.

Tham khảo luồng nghe chép và shadowing của [Parroto](https://parroto.app/vi), hội thoại hiện có chỉnh tốc độ 0,75×–1,25×, lặp một câu, ẩn lời thoại và nghe chép từng lượt. Bản nháp được lưu theo từng tài khoản và bài. Phần đối chiếu đo mức khớp từ bằng thuật toán hiện tại. Học liệu âm thanh vẫn là các bản thu đi kèm dự án.


## Khảo sát Parroto và bản mở rộng thư viện

Đã khảo sát các mục công khai về từ vựng, nghe–nói, truyện, podcast và trò chơi của Parroto ngày 18/11/2026. Nội dung từ vựng và bài đọc mới của TN được biên soạn cho dự án.

| Nội dung khảo sát | Chức năng trong TN |
| --- | --- |
| Bộ thẻ theo chủ đề và trình độ | 25 bộ với 375 mục theo chủ đề. Tổng kho 4.226 đầu mục riêng biệt, gồm từ và cụm từ. Nhãn mức của các bộ biên tập là gợi ý học tập. |
| Lật thẻ và ôn tập | Lật thẻ, phát âm bằng giọng đọc của trình duyệt và ôn nghĩa. |
| Lưu từ trong ngữ cảnh | Bấm từ trong bản chép lời hoặc bài đọc, xem nghĩa và lưu từ cùng câu gốc vào sổ tay. Từ chưa có nghĩa cần được người học bổ sung. |
| Ôn từ đến hạn | Lịch mặc định lần nhớ đầu sau một ngày, các lần nhớ sau nhân đôi khoảng cách tối đa 60 ngày. Chưa nhớ thì gặp lại sau 10 phút. Lịch này là quy tắc ban đầu, chưa hiệu chỉnh bằng dữ liệu người học. |
| Trò chơi | Nghe viết từ, nhìn nghĩa chọn từ và xếp câu. Có kết quả và danh sách cần ôn sau lượt. |
| Đọc và nghe | Tám bài đọc nguyên bản theo tám lộ trình, 48 câu có bản dịch và mốc thời gian âm thanh. Bấm nghe từng câu, chỉnh tốc độ, ẩn dịch và tra từ ngay trong bài. |
| Podcast và nghe liên tục | Danh sách phát 30 hội thoại của mỗi lộ trình, tự chuyển bài, hiện lượt nói đang phát, bấm tua đến lượt nói. |
| Shadowing và dictation | Đã có nghe chép từng câu, lặp câu, chỉnh tốc độ và thu âm đối chiếu với lời mẫu. |
| Bài yêu thích | Đánh dấu bài, mở lại từ thư viện, lưu riêng theo tài khoản. |
| Theo dõi học tập | Tiến độ từng bài và mô hình gợi ý ôn từ kết quả đã làm. |

Các nội dung ghép cặp người học, thi đấu nhiều người, tạo bài tự động từ YouTube và đề thi mô phỏng đầy đủ chưa được triển khai. Phản hồi Speaking hiện đo mức khớp từ sau nhận dạng. Các bản đọc mới dùng giọng đọc tổng hợp Microsoft Zira trên máy biên soạn.

Nguồn khảo sát
- [Từ vựng Parroto](https://parroto.app/vi/vocabulary)
- [Truyện](https://parroto.app/stories)
- [Podcast](https://podcast.parroto.app/vi)
- [Trò chơi](https://parroto.app/blog/vi/3-game-moi-tren-parroto-hoc-tu-vung-chua-bao-gio-thu-vi-en-the)

Sổ tay, lịch ôn và bài yêu thích dùng API tiến độ hiện có, lưu riêng từng tài khoản trong SQLite/D1. Dữ liệu học viên và mô hình AI được lưu trong thư mục dữ liệu người dùng. Git chỉ theo dõi source và học liệu tĩnh.


Trang thư viện có đường dẫn #library, giao diện riêng theo desktop/mobile, tìm đồng thời từ vựng và bài của lộ trình đang chọn. Đóng bài học sẽ trở về thư viện. Bộ source được quản lý tại https://github.com/ducthong12/english_course.
