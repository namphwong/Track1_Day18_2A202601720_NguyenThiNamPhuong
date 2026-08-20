# Prototype Link — Day 18

**Người thực hiện:** Nhánh 1 (Vũ Thế Lực, Hoàng Tuấn Hưng — Option A, Option B, repo/common context); Nhánh 2 (Đỗ Thị Thanh Loan, Nguyễn Thị Nam Phương — Option C, Human–AI Decision Table, test setup & feedback synthesis).  
**Trạng thái:** Prototype A/B/C chạy được local; đã thu thập 12 phản hồi tự báo cáo qua tin nhắn từ người ngoài nhóm (xem [prototype-feedback-note.md](prototype-feedback-note.md)); chưa có phiên test quan sát trực tiếp (facilitated test).

## Cách chạy local

Không cần build step, không cần backend, không cần cài package.

1. Mở thư mục `prototype/` trong repo.
2. Mở file `index.html` trực tiếp bằng trình duyệt (double-click, hoặc `start index.html` trên Windows), **hoặc** chạy một static server đơn giản nếu trình duyệt chặn `file://`:
   ```bash
   cd prototype
   npx serve .
   # hoặc: python -m http.server 8000
   ```
   rồi mở `http://localhost:3000` (hoặc cổng tương ứng).
3. Trang mở sẵn ở tab **Option A**. Dùng thanh tab trên header để chuyển sang **Option B** hoặc **Option C**. Nút **"↺ Reset về common context"** ở góc phải header sẽ đưa cả ba option về trạng thái ban đầu bất cứ lúc nào.
4. Giao diện có **hai chế độ sáng/tối**. Mặc định chạy theo cài đặt của hệ điều hành; nút mặt trời/mặt trăng cạnh nút Reset cho phép đổi thủ công. Lựa chọn được nhớ lại giữa các lần mở (nếu trình duyệt cho phép `localStorage` với `file://` — không nhớ được cũng không ảnh hưởng flow). Khi test với người thật nên **cố định một chế độ cho tất cả tester** để không thêm biến số ngoài cơ chế A/B/C.

## Link deploy

Chưa deploy online. Chỉ chạy local theo hướng dẫn trên.

## Đường dẫn file

| Option | File / entry point |
| --- | --- |
| Common context, tab switcher, layout | [prototype/index.html](prototype/index.html) |
| Style dùng chung cho A, B và C | [prototype/styles.css](prototype/styles.css) |
| Logic Option A + Option B + Option C | [prototype/app.js](prototype/app.js) |
| Data fixture dùng chung (lớp 50 learner, Checkpoint cài đặt, Nhóm 03/07/09, evidence) | [prototype/data.js](prototype/data.js) |

## Critical interaction — Option A (Coach Query / On-demand Assist)

1. Coach thấy danh sách 3 checkpoint của lớp (kèm số liệu tổng hợp kiểu-VLAB đã có sẵn, ví dụ "7/10 nhóm đã qua"), **AI chưa phân tích hay tổng hợp evidence gì ở mức nhóm**.
2. Coach chọn "Checkpoint 1 — Cài đặt môi trường" → nút "Kiểm tra nhóm đang chậm" mới bật lên.
3. Coach bấm nút → AI chỉ phân tích phạm vi checkpoint đó → trả về danh sách nhóm đang dừng (Nhóm 03, 07, 09), sắp theo thời gian dừng.
4. Coach bấm vào Nhóm 07 → xem evidence chi tiết (thời gian dừng, yêu cầu trợ giúp, số lần mở tài liệu, lịch sử hỗ trợ) kèm khối "Mức độ chắc chắn" giải thích rõ đây là tín hiệu gián tiếp.
5. Coach chọn **Hỗ trợ ngay / Lên lịch / Bỏ qua — chưa đủ evidence**. Có nút quay lại từng bước và nút reset toàn cục.

## Critical interaction — Option B (AI Review Queue / Coach Approves)

1. Coach mở tab, **AI đã tự tạo sẵn review queue** với 3 case (Nhóm 07, 09, 03), mỗi case có mức ưu tiên AI đề xuất kèm lý do — AI chưa liên hệ learner nào.
2. Coach mở case Nhóm 07 → đọc evidence + khối "Mức độ chắc chắn" giống Option A.
3. Coach có thể **chỉnh lại mức ưu tiên** (dropdown) và **bấm "+ Yêu cầu thêm evidence"** để xem dữ liệu bổ sung (so sánh với nhóm khác, lịch sử checkpoint trước, giới hạn dữ liệu).
4. Coach **Approve** (Hỗ trợ ngay / Lên lịch) hoặc **Dismiss — chưa đủ evidence**. Chỉ sau khi approve, màn hình mới hiện dòng xác nhận "bước hỗ trợ tiếp theo được tạo" — trong bản demo này đó chỉ là một câu xác nhận trên giao diện, chưa có hành động gửi thật nào chạy phía sau.
5. Có nút quay lại queue, quay lại case, và nút reset toàn cục.

## Critical interaction — Option C (Proactive Support Agent with Guardrails)

1. Coach mở tab, **AI có thể đã tự hành động từ trước** — màn hình đầu tiên không phải danh sách chờ lệnh (như A) hay queue chờ duyệt (như B), mà là **policy đang áp dụng** (khi nào AI được tự Act, khi nào AI luôn phải Ask/chuyển coach) cộng với một **nhật ký hành động (audit log)** liệt kê những gì AI đã tự làm hoặc tự quyết định không làm.
2. Trong log đã có sẵn 3 dòng cho 3 nhóm quen thuộc: Nhóm 07 — AI đã tự gửi một check-in trung lập lúc 10:41 (Act, rủi ro thấp, có thể thu hồi); Nhóm 09 — learner tự gửi yêu cầu trợ giúp nên AI không tự trả lời, chuyển thẳng coach (Ask); Nhóm 03 — tín hiệu bình thường nên AI không làm gì (Don't Act).
3. Coach bấm "Xem chi tiết" một dòng log để mở case đó, đọc evidence + "Mức độ chắc chắn" giống hệt A/B, và thấy khối "Hành động AI" giải thích rõ AI đã Act/Ask/Không hành động vì quy tắc policy nào, độ tin cậy bao nhiêu, rủi ro ra sao.
4. Riêng case Nhóm 07: coach có thể **"Thu hồi check-in" (undo)** trước khi có phản hồi, hoặc dùng khối "Mô phỏng phản hồi learner" (gắn nhãn rõ đây là mô phỏng để test, không phải phản hồi thật) để xem hai nhánh — learner xác nhận cần giúp (case chuyển cho coach) hoặc learner từ chối (AI không làm phiền thêm, nhưng case vẫn mở để coach có thể vẫn can thiệp nếu không đồng ý).
5. Ở mọi case, quyết định đóng case cuối cùng — Hỗ trợ ngay / Lên lịch / Bỏ qua — luôn do coach bấm; AI không tự đóng case của một learner cụ thể trong bất kỳ nhánh nào.
6. Coach có thể **tắt hành động/theo dõi chủ động cho một nhóm** (toggle trong case) hoặc **tạm dừng toàn bộ hành động tự động của AI** (toggle ở màn hình policy) — cả hai đều được ghi vào audit log ngay lập tức.

## Điểm khác biệt cơ chế (không chỉ wording/layout)

- A: **Coach khởi tạo** phân tích, phạm vi do coach chọn, AI không tự xếp hạng gì trước khi được hỏi.
- B: **AI khởi tạo** review queue trước, tự xếp priority + giải thích, coach review/sửa/approve từng case; AI vẫn không tự liên hệ learner nếu chưa approve.
- C: **AI có thể đã hành động trước khi coach mở tab** — tự gửi check-in rủi ro thấp trong policy (Act), hoặc tự quyết định không trả lời và chuyển thẳng coach khi learner đã lên tiếng trực tiếp (Ask), hoặc không làm gì khi tín hiệu bình thường (Don't Act). Coach giám sát bằng audit log, có thể undo/stop/opt-out, nhưng không cần duyệt trước từng hành động rủi ro thấp như ở B.
- Cả ba dùng chung: user (Lab Coach), lớp 50 learner, task, data fixture (Nhóm 03/07/09 tại Checkpoint 1), visual style, result choices, và reset path.

## Prototype annotation (nội bộ facilitator — không đọc/hiện cho tester)

**OPTION A — Coach Query**
- We expect the tester to: chủ động chọn checkpoint rồi bấm "Kiểm tra nhóm đang chậm" *trước khi* mong đợi thấy danh sách nhóm/evidence — nếu họ ngồi chờ thông tin tự hiện ra, đó là dấu hiệu cơ chế "on-demand" chưa rõ với họ.
- Watch for: tester có tự nhớ/biết phải bấm yêu cầu không hay cần được nhắc; mất bao lâu để chọn đúng checkpoint; họ có đọc khối "Mức độ chắc chắn" trước khi quyết định hay bỏ qua thẳng tới nút hành động; họ có so sánh cả 3 nhóm (03/07/09) hay chỉ nhìn Nhóm 07 vì thấy trước.
- Do not explain: không giải thích vì sao nút "Kiểm tra nhóm đang chậm" bị mờ ban đầu; không gợi ý nên chọn checkpoint nào; không đọc hộ nội dung evidence panel.

**OPTION B — AI Review Queue**
- We expect the tester to: mở tab thấy ngay review queue đã có sẵn, không cần bấm gì — nếu họ đi tìm một nút "quét"/"phân tích" như ở A, đó là dấu hiệu họ đang áp cơ chế A vào B.
- Watch for: tester có nhận ra queue là do AI tự tạo (đọc banner) hay coi đó là hiển nhiên; họ có bấm "+ Yêu cầu thêm evidence" trước khi quyết định hay chỉ nhìn priority AI đề xuất rồi làm theo; họ có tự đổi priority hay giữ nguyên đề xuất AI; họ có đọc dòng "chỉ sau khi approve mới tạo bước hỗ trợ" hay tưởng bấm là learner được liên hệ ngay.
- Do not explain: không giải thích vì sao Nhóm 07 được xếp priority Cao; không nói trước rằng có thể chỉnh priority; không diễn giải hộ khối "Mức độ chắc chắn".

**OPTION C — Proactive Agent**
- We expect the tester to: mở tab và nhận ra AI **đã hành động rồi**, không chỉ chờ sẵn như B — nếu họ đọc log mà nghĩ đó là "việc cần làm" (như một to-do list) thay vì "việc AI đã làm/đã quyết định", đó là dấu hiệu họ đang áp cơ chế B vào C.
- Watch for: phản ứng đầu tiên của tester khi biết AI đã tự gửi tin nhắn cho Nhóm 07 trước khi họ mở tab — có thấy bất ngờ/khó chịu không, hay thấy hợp lý vì rủi ro thấp và có thể thu hồi; họ có đọc kỹ vì sao Nhóm 09 lại không được AI tự trả lời (khác với Nhóm 07) hay coi cả hai case là giống nhau; họ có chủ động tìm nút undo/tắt theo dõi khi không đồng ý với hành động của AI, hay chỉ chấp nhận và bỏ qua; họ có đọc audit log như một công cụ giám sát thật hay lướt qua.
- Do not explain: không giải thích trước vì sao Nhóm 07 được Act còn Nhóm 09 được Ask; không gợi ý họ nên bấm undo hay không; không diễn giải hộ ý nghĩa của toggle "tạm dừng toàn bộ hành động tự động".
