# Human–AI Decision Table — Day 18 (CP3: Human Control)

**Case:** C — AI Support Radar (VLearn)
**Trạng thái:** Option A và Option B đã implement thành prototype ([prototype-link.md](prototype-link.md)). Option C **chưa implement** trong nhánh này — bảng dưới đây ghi thiết kế dự kiến của Loan/Nam Phương theo [three-option-design-sheet.md](three-option-design-sheet.md), chưa có prototype để kiểm chứng.

| Tiêu chí | Option A — Coach Query | Option B — AI Review Queue | Option C — Proactive Agent |
| --- | --- | --- | --- |
| **Trạng thái** | ✅ Đã implement (prototype) | ✅ Đã implement (prototype) | ⏳ Chưa implement |
| **Expectation** — coach biết AI sắp làm gì trước khi AI chạy | Có banner cơ chế ở đầu trang: "AI chưa chạy gì. AI sẽ chỉ phân tích phạm vi bạn chọn, và chỉ khi bạn bấm yêu cầu." Nút "Kiểm tra nhóm đang chậm" chỉ bật sau khi chọn checkpoint, không có hành động ẩn. | Banner nêu rõ: "AI đã tự động gom tín hiệu và tạo review queue... AI không liên hệ learner cho tới khi bạn approve." Coach biết ngay khi mở tab rằng queue là do AI tự tạo, không phải coach yêu cầu. | (Thiết kế, chưa test) AI hiển thị trước hành động dự kiến và mức chắc chắn trước khi gửi check-in, theo policy coach đã đặt. |
| **Role & Agency** — User làm gì / AI làm gì | User: chọn phạm vi, bấm yêu cầu, đọc evidence, quyết định. AI: chỉ phân tích khi được lệnh, không tự xếp hạng toàn lớp. | User: mở case, đọc evidence + uncertainty, chỉnh priority, yêu cầu thêm evidence, approve/dismiss. AI: tự gom & xếp hạng, giải thích lý do, không tự hành động với learner. | (Thiết kế) User: đặt policy, giám sát exception, can thiệp. AI: theo dõi tín hiệu, có thể tự gửi check-in rủi ro thấp trong giới hạn policy. |
| **AI Act / Ask / Don't Act** | **Don't Act** cho tới khi coach yêu cầu; sau đó chỉ **Act** ở mức phân tích/tổng hợp, không hành động với learner. | **Act** để tạo và xếp review queue (không cần lệnh coach); **Ask** (chờ approve) trước khi tạo bước hỗ trợ hoặc chạm tới learner. | (Thiết kế) **Act** với check-in rủi ro thấp trong policy (có thể hoàn tác); **Ask** khi evidence mâu thuẫn, confidence thấp hoặc ảnh hưởng lớn. |
| **Ai giữ quyền quyết định cuối** | Coach — 100%, mọi bước. | Coach — mọi hành động chạm tới learner cần approve; AI chỉ tự chủ ở việc tạo/xếp queue nội bộ. | (Thiết kế) AI tự chủ trong phạm vi rủi ro thấp đã được coach cấu hình trước; coach giữ quyền với case nhạy cảm/không chắc chắn. |
| **Evidence & Uncertainty** — AI dựa vào tín hiệu nào, giới hạn ra sao | Evidence panel liệt kê 4 tín hiệu (thời gian dừng, yêu cầu trợ giúp, số lần mở tài liệu, lịch sử hỗ trợ), mỗi tín hiệu có ghi chú giới hạn riêng. Khối "Mức độ chắc chắn" nói rõ đây là tương quan, không phải bằng chứng chắc chắn mắc kẹt. | Cùng 4 tín hiệu + cùng khối uncertainty như Option A. Thêm: mỗi case trong queue có dòng lý do AI đề xuất priority (không chỉ số điểm), và nút "+ Yêu cầu thêm evidence" mở dữ liệu bổ sung kèm dòng "Giới hạn dữ liệu" tường minh. | (Thiết kế) Dự kiến hiển thị evidence + mức chắc chắn trước khi gửi check-in; chưa có prototype nên chưa kiểm chứng cách trình bày thật. |
| **Không trình bày "chậm checkpoint" như bằng chứng chắc chắn** | Đạt — mọi ghi chú tín hiệu đều dùng ngôn ngữ "có thể", "chưa chắc chắn", không kết luận thay coach. | Đạt — tương tự A; priority AI đề xuất luôn kèm lý do và giới hạn, không chỉ một con số. | (Thiết kế) Ba-option design sheet yêu cầu tương tự; cần kiểm chứng khi có prototype. |
| **Control & Recovery** | Approve/Reject: coach chọn Hỗ trợ ngay / Lên lịch / Bỏ qua. Edit: chọn lại nhóm/checkpoint khác. Back: nút quay lại checkpoint list, quay lại evidence. Reset: nút reset toàn cục đưa cả A và B về common context. | Approve/Reject: Hỗ trợ ngay / Lên lịch / Dismiss. Edit: dropdown chỉnh priority trước khi quyết định. Back: quay lại queue, quay lại case. Reset: nút reset toàn cục. | (Thiết kế) Coach có stop, undo, sửa policy, tắt theo dõi cho learner/nhóm; learner có quyền từ chối. Chưa có prototype để xác nhận thao tác thật. |
| **Nếu AI sai, coach vẫn tiếp tục task ban đầu** | Có — mọi trạng thái đều có đường quay lại, không có ngõ cụt; chọn "Bỏ qua — chưa đủ evidence" vẫn cho phép quay lại chọn checkpoint khác. | Có — dismiss một case không khóa các case khác trong queue; reset đưa toàn bộ về ban đầu. | (Thiết kế) Chưa kiểm chứng bằng prototype. |

## Ghi chú Gate 3 self-check (chỉ áp dụng cho A và B đã implement)

- [x] A và B thể hiện rõ AI Act/Ask/Don't Act khác nhau, không chỉ khác wording.
- [x] Evidence luôn đi kèm giới hạn/uncertainty, không trình bày như kết luận chắc chắn.
- [x] Coach có đường approve, reject/dismiss, edit (priority ở B, chọn lại phạm vi ở A), back và reset ở cả hai option.
- [x] AI không tự liên hệ learner ở cả A và B trong toàn bộ flow.
- [ ] Option C — chưa có prototype nên chưa tự kiểm tra được các tiêu chí Human Control cho C; chỉ ghi lại thiết kế dự kiến từ CP2.

**Kết luận:** Gate 3 tự kiểm được cho Option A và Option B dựa trên prototype đã chạy. Option C giữ nguyên trạng thái thiết kế (chưa implement, chưa tự kiểm tra) — không đánh dấu Gate 3 pass cho C.
