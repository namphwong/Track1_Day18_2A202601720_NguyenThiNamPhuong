# Group Feedback Synthesis

**Người tổng hợp:** Nhánh 2 (Đỗ Thị Thanh Loan, Nguyễn Thị Nam Phương) — Nhóm Đường Bốn Mùa Xuân  
**Nguồn:** 12 phản hồi tự báo cáo (async, không có facilitator quan sát trực tiếp) từ người ngoài nhóm, tự dùng prototype qua link live. Chi tiết từng phản hồi ở [prototype-feedback-note.md](prototype-feedback-note.md).
**Giới hạn cần đọc trước:** đây là 12 phản hồi tự trả lời sau khi dùng, không phải phiên có người ngồi quan sát hành vi theo đúng luật facilitation gốc của bài — vẫn là evidence thật, nhưng thiếu lớp quan sát hành vi (first action, chỗ dừng, cách lấy lại control).

## Phân bố lựa chọn

| Option | Số phản hồi chọn | Ghi chú |
| --- | --- | --- |
| B — AI Review Queue | 5/12 | Được chọn nhiều nhất trong mẫu này |
| C — Proactive Agent | 4/12 | |
| A — Coach Query | 3/12 | |

Không dùng con số này như bằng chứng "B thắng" — mẫu 12 phản hồi tự chọn qua tin nhắn, không phải khảo sát đại diện, và cách hỏi (chọn 1 trong 3) khác với cách outcome task gốc yêu cầu (xác định nhóm cần ưu tiên rồi quyết định bước tiếp theo).

## Pattern lặp lại (xuất hiện ở ≥ 3 phản hồi, không phải ý kiến đơn lẻ)

| Pattern | Xuất hiện ở | Diễn giải |
| --- | --- | --- |
| Không rõ priority (Option B) được tính từ đâu | #1, #3, #9, #12 (4 phản hồi) | Cả người thích B lẫn người phân vân giữa B/C đều vấp cùng một chỗ — không phải vấn đề của riêng ai |
| Option A "an toàn hơn" nhưng tốn thao tác / khó scale cho lớp 50–60 | #4, #7, #11 (cả 3 phản hồi chọn A) | Khớp đúng trade-off nhóm đã dự đoán trong three-option-design-sheet.md — được xác nhận độc lập, không phải nhóm tự nghĩ ra |
| Lo ngại Option C: false positive, learner có biết đang bị AI theo dõi không, dễ nhầm "đang suy nghĩ" với "đang mắc kẹt" | #2, #5, #8, #10 (4 phản hồi) | Trùng với Still Unproven đã ghi trong cp1-evidence-continuity.md từ trước khi có feedback này |
| B và C dễ bị nhầm cơ chế nếu chỉ nhìn nhanh giao diện | #12 | Chỉ 1 phản hồi nói thẳng, nhưng đáng chú ý vì đây đúng là ranh giới quan trọng nhất giữa hai option |

## Một Next Change nhóm chốt

**Next Change:** Thêm một điểm giải thích ngắn ("Vì sao mức ưu tiên này?") gắn liền ngay cạnh mỗi priority tag ở Option B — hiện tại lý do priority đã có trong `AI_QUEUE_SUGGESTION.reason` (data.js) và hiển thị trong case detail, nhưng chưa hiển thị ngay ở màn hình queue tổng, nơi coach nhìn thấy priority đầu tiên. Đây là pattern có evidence rõ nhất (4/12 phản hồi, cả người thích lẫn không thích B đều vấp cùng chỗ), nên ưu tiên sửa trước các ý kiến đơn lẻ.

**Evidence dẫn tới quyết định này:** phản hồi #1, #3, #9, #12 — bốn phản hồi độc lập cùng nêu cùng một điểm mơ hồ, dù ba trong số họ chọn B (tức là ngay cả người thích option này vẫn không hiểu rõ cơ chế xếp hạng của nó).

## Still Unproven sau 12 phản hồi

- Cách hiển thị/giải thích priority nên như thế nào để đủ rõ mà không quá dài dòng — biết vấn đề, chưa biết giải pháp đúng.
- False positive ở Option C nên được xử lý/phục hồi ra sao ngoài Undo hiện có.
- Learner có cần được thông báo là AI đang theo dõi tín hiệu hành vi của họ không (câu hỏi consent, chưa nằm trong scope 3 prototype hiện tại).
- 12 phản hồi này có thực sự xuất phát từ việc làm đúng outcome task (xác định nhóm cần ưu tiên, quyết định bước hỗ trợ) hay chỉ đang so sánh 3 cơ chế trừu tượng — vì không có ai quan sát trực tiếp, không chắc chắn được.
- Chưa test với Lab Coach thật đang trong ca dạy bận rộn — 12 phản hồi này là từ người ngoài nhóm nói chung, không rõ có ai từng làm vai trò tương tự Lab Coach không.

## Nguyên tắc khi đọc bảng trên

- Không dùng "5/12 chọn B" như bằng chứng B tốt hơn — chỉ là phân bố phản hồi thật, không phải kết quả đã kiểm định.
- Không tuyên bố solution đã được validated — 12 phản hồi giúp chọn Next Change tiếp theo, không chứng minh product value.
- Nếu có mâu thuẫn trong phản hồi (ví dụ #6 không thích C vì "can thiệp trước khi xem evidence" trong khi #2/#5/#8/#10 chọn C), giữ nguyên mâu thuẫn đó thay vì chọn bên đa số làm "sự thật".
