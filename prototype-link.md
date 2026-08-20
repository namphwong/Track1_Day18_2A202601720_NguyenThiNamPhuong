# Prototype Link — Day 18

**Người thực hiện:** Vũ Thế Lực (Option A, Option B, repo/common context)
**Trạng thái:** Prototype chạy được local; **chưa test với người thật, chưa có feedback**.

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
3. Trang mở sẵn ở tab **Option A**. Dùng thanh tab trên header để chuyển sang **Option B**. Nút **"↺ Reset về common context"** ở góc phải header sẽ đưa cả hai option về trạng thái ban đầu bất cứ lúc nào.

## Link deploy

Chưa deploy online. Chỉ chạy local theo hướng dẫn trên.

## Đường dẫn file

| Option | File / entry point |
| --- | --- |
| Common context, tab switcher, layout | [prototype/index.html](prototype/index.html) |
| Style dùng chung cho A và B | [prototype/styles.css](prototype/styles.css) |
| Logic Option A + Option B | [prototype/app.js](prototype/app.js) |
| Data fixture dùng chung (lớp 50 learner, Checkpoint cài đặt, Nhóm 03/07/09, evidence) | [prototype/data.js](prototype/data.js) |

## Critical interaction — Option A (Coach Query / On-demand Assist)

1. Coach thấy danh sách 3 checkpoint của lớp, **AI chưa chạy gì**.
2. Coach chọn "Checkpoint 1 — Cài đặt môi trường" → nút "Kiểm tra nhóm đang chậm" mới bật lên.
3. Coach bấm nút → AI chỉ phân tích phạm vi checkpoint đó → trả về danh sách nhóm đang dừng (Nhóm 03, 07, 09), sắp theo thời gian dừng.
4. Coach bấm vào Nhóm 07 → xem evidence chi tiết (thời gian dừng, yêu cầu trợ giúp, số lần mở tài liệu, lịch sử hỗ trợ) kèm khối "Mức độ chắc chắn" giải thích rõ đây là tín hiệu gián tiếp.
5. Coach chọn **Hỗ trợ ngay / Lên lịch / Bỏ qua — chưa đủ evidence**. Có nút quay lại từng bước và nút reset toàn cục.

## Critical interaction — Option B (AI Review Queue / Coach Approves)

1. Coach mở tab, **AI đã tự tạo sẵn review queue** với 3 case (Nhóm 07, 09, 03), mỗi case có mức ưu tiên AI đề xuất kèm lý do — AI chưa liên hệ learner nào.
2. Coach mở case Nhóm 07 → đọc evidence + khối "Mức độ chắc chắn" giống Option A.
3. Coach có thể **chỉnh lại mức ưu tiên** (dropdown) và **bấm "+ Yêu cầu thêm evidence"** để xem dữ liệu bổ sung (so sánh với nhóm khác, lịch sử checkpoint trước, giới hạn dữ liệu).
4. Coach **Approve** (Hỗ trợ ngay / Lên lịch) hoặc **Dismiss — chưa đủ evidence**. Chỉ sau khi approve, hệ thống mới "tạo bước hỗ trợ tiếp theo" — điều này được nêu rõ trong kết quả.
5. Có nút quay lại queue, quay lại case, và nút reset toàn cục.

## Điểm khác biệt cơ chế (không chỉ wording/layout)

- A: **Coach khởi tạo** phân tích, phạm vi do coach chọn, AI không tự xếp hạng gì trước khi được hỏi.
- B: **AI khởi tạo** review queue trước, tự xếp priority + giải thích, coach review/sửa/approve từng case; AI vẫn không tự liên hệ learner nếu chưa approve.
- Cả hai dùng chung: user (Lab Coach), lớp 50 learner, task, data fixture (Nhóm 03/07/09 tại Checkpoint 1), visual style, result choices, và reset path.
