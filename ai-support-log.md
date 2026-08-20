# AI Support Log — Day 18

**Người nộp:** Nguyễn Thị Nam Phương — 2A202601720  
**Case:** C — AI Support Radar (VLearn)  

## 1. AI đã giúp tôi ở đâu?

- Đọc và đối chiếu tài liệu Day 17 với rubric năm gate của Day 18.
- Tổng hợp ba Practice Notes thành Evidence Huddle, tách observation khỏi interpretation.
- Gợi ý cấu trúc Hypothesis Problem đủ situation, user, job, barrier và consequence.
- Gợi ý Solution Parking Lot, Comparison Contract và ba cơ chế phân quyền User–AI cho Option A/B/C.
- Soạn khung README, checklist CP1/CP2 và cấu trúc repo nộp bài.
- Hỗ trợ xây dựng micro-prototype HTML/CSS/JS thuần cho cả ba option A, B và C (đặc biệt là Option C — Proactive Support Agent thuộc nhánh 2), dùng chung một data fixture (lớp 50 learner, Checkpoint 1 — Cài đặt môi trường, Nhóm 03/07/09) theo đúng Comparison Contract ở CP2.
- Viết smoke test nội bộ (jsdom) để tự kiểm tra toàn bộ flow của cả 3 option trước khi hoàn thiện: chọn checkpoint, quét, mở evidence, đổi priority, yêu cầu thêm evidence, approve/dismiss, các luồng Act/Ask/Don't-Act của Option C, undo, mô phỏng phản hồi learner, toggle pause/opt-out, back, reset — không phát hiện lỗi JS runtime.
- Soạn và hoàn thiện `human-ai-decision-table.md`, `prototype-link.md`, cập nhật README theo đúng trạng thái thật.
- Đọc lại trực tiếp 3 transcript Day 17 để audit ngược CP1/CP2/CP3, thay vì chỉ tin bản tóm tắt sẵn có. Từ đó ghi nhận 3 điểm quan trọng: thứ nhất, Hypothesis Problem đang gộp hai giai đoạn "đang diễn ra" và "vừa kết thúc" nhưng evidence cho hai giai đoạn này khác loại nhau; thứ hai, câu hỏi kiểm chứng cốt lõi — coach có từng bỏ sót ai không — đã được hỏi trong transcript May nhưng chưa có câu trả lời; thứ ba, các con số cụ thể trong Common Scenario (Nhóm 07, 18 phút) không xuất hiện trong transcript gốc — đó là fixture thiết kế, không phải số liệu thật.
- Áp dụng các bổ sung an toàn từ audit: thêm disclaimer fixture-vs-evidence vào `three-option-design-sheet.md` và `prototype/data.js`; sửa câu "AI chưa chạy gì" thành diễn đạt chính xác hơn ("AI chưa phân tích/tổng hợp evidence") ở `prototype-link.md`/`human-ai-decision-table.md`; thêm nuance "đã hỏi, chưa có câu trả lời" vào `cp1-evidence-continuity.md` mục Still Unproven.

## 2. AI sai, hồi hộp hoặc làm các option giống nhau ở đâu?

- Phân tích ban đầu nghiêng về giả định coach thiếu tín hiệu, trong khi evidence cho thấy coach đã đi từng bàn và dùng VLAB/checkpoint.
- Có nguy cơ biến A/B/C thành ba phiên bản dashboard khác nhau. Nhóm đã yêu cầu khác nhau ở người khởi tạo, quyền hành động và điểm phê duyệt.
- AI ban đầu tạo thư mục Day 18 nhóm trong repo Day 17, không đúng repo cá nhân đã được tạo sẵn.
- Khi viết CSS ban đầu cho badge priority của Option B, AI viết một selector class sai cú pháp cho giá trị có dấu cách ("Trung bình") khiến style không áp dụng đúng — đã phát hiện và đổi sang mapping tên class an toàn (`priority-high/mid/low`) trước khi test.
- Khi làm Option C, toggle "tạm dừng hành động tự động" ghi log vào mảng dữ liệu nhưng quên gọi lại hàm render, nên audit log hiển thị không cập nhật ngay — nhóm tự kiểm phát hiện và đã sửa bằng cách gọi render lại activity feed ngay sau khi ghi log.
- AI chưa có feedback tester thật; mọi failure assumption và Next Change ban đầu chỉ là kế hoạch test, không phải kết quả. Smoke test chỉ xác nhận flow không lỗi kỹ thuật, không thay thế được việc quan sát người dùng thật quyết định như thế nào.

## 3. Tôi và nhóm đã tự sửa hoặc quyết định lại điều gì?

- Giữ evidence coach đã có cơ chế phát hiện, không viết rằng coach hoàn toàn không có tín hiệu.
- Chọn Hypothesis Problem trung lập hơn: tín hiệu rải rác và khó ưu tiên, thay vì khẳng định pain chỉ là thiếu tín hiệu.
- Giữ A là user-led, B là co-create và C là proactive agent để tạo khác biệt cơ chế thật.
- Quyết định tổ chức công việc nhóm thành hai nhánh: Nhánh 1 (Lực & Hưng) phụ trách Option A, B, repo setup & common fixture; Nhánh 2 (Loan & Nam Phương) phụ trách Option C, CP3 Human–AI Control, chuẩn hóa test và tổng hợp feedback CP5.
- Trong prototype, quyết định giữ cả Nhóm 03 và Nhóm 09 bên cạnh Nhóm 07 (thay vì chỉ hiện một nhóm "đúng đáp án"), để tester phải tự so sánh evidence và tự quyết định ai cần ưu tiên, đúng yêu cầu outcome task chứ không bị dẫn sẵn.
- Quyết định trung thực về phương pháp thu thập feedback: chỉ ghi nhận 12 phản hồi tự báo cáo qua tin nhắn ở phần có dữ liệu thật (lựa chọn, lý do, điểm khó chịu), không bịa thêm dữ liệu quan sát hành vi trực tiếp (first action, chỗ do dự) khi chưa có người facilitate ngồi cạnh.
- Không tự ý tuyên bố solution nào đã validated hay chọn option "thắng", mà giữ đúng tinh thần Gate 5: học hỏi từ feedback để chốt một Next Change có evidence rõ nhất.

## 4. Xây dựng và hoàn thiện Option C (Proactive Support Agent)

- AI đã giúp thiết kế và code prototype Option C trong cùng bộ file `prototype/` (data.js, app.js, index.html, styles.css) để giữ đúng data fixture chung với A/B (Nhóm 03/07/09, Checkpoint 1), theo đúng phân công của Nhánh 2 (Loan & Nam Phương).
- Quyết định cơ chế cụ thể để tránh việc C chỉ là "B đổi tên": Nhóm 07 (tín hiệu mạnh nhưng mâu thuẫn — dừng lâu và mở tài liệu nhiều lần, nhưng chưa xin giúp) được AI **tự Act** — tự gửi một check-in trung lập, rủi ro thấp, có thể thu hồi, ngay cả trước khi coach mở tab; Nhóm 09 (learner đã tự gửi yêu cầu trợ giúp) được coi là **ảnh hưởng lớn** nên AI **không tự trả lời**, chuyển thẳng cho coach (Ask); Nhóm 03 (tín hiệu bình thường) thì AI **không hành động** (Don't Act), chỉ ghi log theo dõi. Đây là diễn giải cụ thể hoá quy tắc "Act rủi ro thấp / Ask khi mâu thuẫn hoặc ảnh hưởng lớn" đã có trong `three-option-design-sheet.md`, áp dụng đúng lên ba case sẵn có thay vì bịa thêm dữ liệu mới.
- Thêm các cơ chế Control & Recovery mà thiết kế CP2/CP3 yêu cầu: audit log hiển thị mọi hành động AI đã tự làm/tự quyết định không làm, nút thu hồi (undo) check-in trước khi có phản hồi, mô phỏng phản hồi learner (gắn nhãn rõ là mô phỏng, không phải dữ liệu thật), toggle tắt theo dõi chủ động theo từng nhóm, và toggle tạm dừng toàn bộ hành động tự động ở cấp policy.
- Tự kiểm tra kỹ lưỡng các kịch bản của Option C: chuyển tab, mở case theo 3 nhánh Act/Ask/Don't-Act, undo, mô phỏng learner đồng ý/từ chối, toggle opt-out và pause có ghi log đúng không, reset đưa log về đúng 3 dòng ban đầu, và kiểm tra hồi quy — xác nhận Option A/B vẫn chạy đúng sau khi thêm Option C.
- Hoàn thiện `human-ai-decision-table.md` và `prototype-link.md` (thêm Critical interaction và facilitator annotation cho C) để phản ánh đầy đủ cơ chế Human–AI Control.

## 5. Thông tin tham khảo từ buổi demo với mentor/stakeholder (không tính là test Chặng 6)

Trong quá trình làm bài, thành viên trong nhóm (Lực) đã có một buổi demo prototype Option C cho một stakeholder/mentor trong chương trình (gọi là "anh" trong đoạn trao đổi). Đây là **buổi demo có người dẫn**: người trình bày thao tác và giải thích trong lúc người xem quan sát và phản hồi — không phải tester tự thao tác độc lập. Nhóm ghi nhận lại các quan sát này làm tài liệu tham khảo nội bộ, tách bạch rõ giữa quan sát và diễn giải:

**Observed — người xem thực sự nói/hỏi gì:**
- Hỏi "tại sao lại phải đưa vào hàng đợi?" khi thấy AI đã tổng hợp tín hiệu — ban đầu nhầm lẫn cơ chế giữa Option A và B.
- Sau khi nghe giải thích Act/Ask/Don't-Act ở Option C, tự đưa ra ví von: AI như "siêu xe không phanh trên cao tốc"; nêu lý do ủng hộ nút dừng khẩn cấp là AI có thể "ảo giác" và việc hỗ trợ học viên ảnh hưởng trực tiếp tới công việc của Lab Coach nên không thể để AI toàn quyền.
- Xem case Nhóm 07 (Act), nhận xét giao diện "hơi nhiều text quá, nhìn phát chưa nắm được tình hình" — muốn dạng bullet point để quét nhanh.
- Hỏi rõ hệ thống "có thay thế được Lab Coach không?" — xác nhận không, chỉ hỗ trợ.
- Kết luận "về mặt ý tưởng là ok", đề xuất áp dụng vào VLAB thật; hỏi thêm về dashboard tổng quan tiến độ từng nhóm.

**Interpreted — không coi là fact:**
- "Hữu ích" là phản ứng của một người xem demo có người dẫn, chưa phải learner hay Lab Coach thật tự dùng độc lập.
- Việc hiểu đúng Act/Ask/Don't-Act sau khi được giải thích cho thấy nếu không có người dẫn giải, người dùng rất dễ nhầm cơ chế giữa các option — đây là điểm cần kiểm chứng kỹ trong phiên test độc lập.

## 6. Xử lý và tổng hợp 12 phản hồi thật từ người ngoài nhóm

- Nhóm thu thập 12 phản hồi thật (người ngoài nhóm tự mở link prototype live, tự dùng cả A/B/C, tự báo lại lựa chọn + lý do qua tin nhắn) và đưa vào `prototype-feedback-note.md` cùng `group-feedback-synthesis.md`.
- AI ban đầu nghi ngờ tính chân thực do cấu trúc phản hồi khá đồng đều; nhóm đã xác nhận đây là phản hồi từ người thật gửi qua tin nhắn sau khi tự trải nghiệm link live.
- Giữ nguyên tắc phương pháp: chỉ ghi nhận phần có dữ liệu thực tế (lựa chọn, lý do, điểm khó chịu), để trống các cột hành vi quan sát (first action, cách lấy lại control...) vì đây là tự báo cáo không đồng bộ, không có ai quan sát trực tiếp — tuyệt đối không suy đoán thêm hành vi không có thật.
- Tổng hợp pattern chỉ từ những điểm lặp lại ở nhiều phản hồi ($\ge 3$), không dùng ý kiến đơn lẻ làm kết luận chung; chốt một Next Change (thêm giải thích "vì sao priority này" ngay ở màn hình queue của Option B) dựa trên pattern có evidence rõ nhất (4/12 phản hồi cùng vướng).
- Tuyệt đối không tạo feedback giả; duy trì tính trung thực về dữ liệu nghiên cứu người dùng theo đúng yêu cầu của môn học.

## Cam kết minh bạch

AI hỗ trợ tôi ở phần phân tích, cấu trúc tài liệu, gợi ý mã nguồn prototype và soạn thảo câu chữ. Evidence gốc vẫn là từ ba transcript Day 17, không phải AI tạo ra. Tôi và nhóm chịu trách nhiệm kiểm tra lại toàn bộ nội dung, vận hành prototype, thu thập feedback thật và ghi nhận đúng như thực tế diễn ra.
