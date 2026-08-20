# Prototype Feedback Note

**Người thu thập:** Vũ Thế Lực
**Hình thức:** 12 người ngoài nhóm tự mở link prototype (https://claude.ai/code/artifact/fce7227a-a027-47b1-9282-2ebf58048e26), tự bấm qua cả 3 tab A/B/C, rồi tự trả lời qua tin nhắn — **không có người facilitate ngồi cạnh quan sát trực tiếp**.

## Giới hạn về phương pháp — đọc trước khi dùng bảng dưới

Luật facilitation gốc của bài (tester tự thao tác trong lúc facilitator quan sát và hỏi trực tiếp) giả định một phiên đồng bộ, có người ghi lại hành vi thời gian thực (first action, chỗ dừng/do dự, cách lấy lại control). 12 phản hồi này là **tự báo cáo không đồng bộ** (async self-report): mỗi người tự mở, tự dùng, rồi tự gõ câu trả lời gửi lại — không ai quan sát được họ thao tác thế nào lúc đó.

Vì vậy bảng dưới đây **chỉ điền được** cột "Option chọn" và "Lý do & điểm khó chịu" — cột hành vi quan sát được (first action, evidence đọc/bỏ qua, cách sửa) để trống vì không có dữ liệu thật, không suy đoán thêm.

## 12 phản hồi thô

| # | Option chọn | Lý do & điểm khó chịu (nguyên văn/gần nguyên văn) |
| --- | --- | --- |
| 1 | B | AI đã gom sẵn thông tin nhưng mình vẫn là người quyết định cuối. A hơi mất công, C thì chủ động quá. Khó chịu nhất là chưa rõ mức "priority" được tính như thế nào. |
| 2 | C | Trong lớp đông thì muốn AI tự phát hiện trước, không thể lúc nào cũng ngồi kiểm tra từng nhóm. Hơi lo AI gửi check-in nhầm cho người học không thực sự gặp vấn đề. |
| 3 | B | Cảm giác cân bằng nhất giữa tự động và kiểm soát. Thích việc AI đưa queue nhưng vẫn cần approve. Phần khó hiểu là chưa rõ khi nào một nhóm được đưa lên High Priority. |
| 4 | A | Muốn tự chủ động kiểm tra khi cần, không thích hệ thống theo dõi liên tục. Điểm khó chịu là phải thao tác nhiều và có thể quên kiểm tra nếu đang bận. |
| 5 | C | Nếu AI chỉ tự làm các hành động rủi ro thấp thì hợp lý. Thích có Undo và Stop. Muốn biết learner có được thông báo rằng AI đang theo dõi tín hiệu của họ hay không. |
| 6 | B | AI giúp giảm tải nhưng không vượt quyền Coach. Không thích C vì cảm giác AI chủ động can thiệp trước khi xem evidence. B vẫn hơi mất thời gian nếu queue quá dài. |
| 7 | A | Muốn kiểm tra evidence trước rồi mới cho AI xử lý — cảm giác an toàn hơn. Nhưng nếu lớp 50–60 người thì cách này có vẻ khó scale. |
| 8 | C | Ưu tiên tốc độ. Nếu learner đang bị kẹt thì check-in sớm có thể tốt hơn chờ Coach phát hiện. Điểm khó chịu là không rõ false positive sẽ được xử lý thế nào. |
| 9 | B | Thích việc AI chủ động phát hiện nhưng không tự nhắn learner — mức automation thoải mái nhất. Muốn có nút xem "Why?" ngay bên cạnh mỗi priority. |
| 10 | C | Phù hợp nếu Audit Log minh bạch và Coach có quyền tắt. Nhưng nếu AI dựa quá nhiều vào thời gian dừng checkpoint thì có thể hiểu nhầm learner đang suy nghĩ là learner đang mắc. |
| 11 | A | Không muốn AI chủ động tác động vào learner — AI nên là công cụ phân tích khi được gọi. Nhược điểm rõ nhất là thao tác thủ công nhiều. |
| 12 | B | Phương án trung gian, ít rủi ro hơn C nhưng đỡ mất công hơn A. Hơi khó hiểu phần khác nhau giữa "AI Review Queue" và "Proactive Agent" nếu chỉ nhìn nhanh giao diện. |

## Bốn lớp

```
OBSERVED
12 người tự mở prototype qua link, dùng cả A/B/C, tự báo cáo lựa chọn + lý do + điểm khó chịu qua tin nhắn.
Phân bố lựa chọn: B = 5/12, C = 4/12, A = 3/12.

INTERPRETED
- B được chọn nhiều nhất trong nhóm 12 người này vì cảm giác "cân bằng giữa tự động và kiểm soát" —
  đây là cảm nhận của mẫu nhỏ, không suy ra B là lựa chọn đúng hay tốt hơn A/C nói chung.
- Cả 3 người chọn A đều tự nêu đúng nhược điểm "tốn thao tác/khó scale" mà nhóm đã dự đoán từ
  three-option-design-sheet.md — dấu hiệu cho thấy trade-off của A được cảm nhận đúng như thiết kế.
- 4/12 người (chọn cả B lẫn C) cùng thắc mắc về cách priority được tính — lặp lại đủ nhiều lần để
  coi là một pattern, không phải ý kiến đơn lẻ.
- Các lo ngại về Option C (false positive, learner có biết đang bị theo dõi không, dễ hiểu nhầm thời
  gian dừng là mắc kẹt) trùng với đúng những điều cp1-evidence-continuity.md đã liệt vào Still Unproven
  từ trước — không phải phát hiện mới, nhưng là xác nhận độc lập rằng lo ngại đó có thật với người dùng.

DECIDED / NEXT CHANGE
Xem group-feedback-synthesis.md.

STILL UNPROVEN
- Cách giải thích/tính priority nên hiển thị thế nào để đủ rõ — biết là thiếu, chưa biết cách sửa nào đúng.
- False positive ở Option C nên được xử lý/phục hồi ra sao — chưa có cơ chế cụ thể, mới chỉ có Undo.
- Learner có cần được thông báo AI đang theo dõi tín hiệu hành vi của họ không — câu hỏi consent
  chưa được trả lời, không nằm trong phạm vi 3 prototype hiện tại.
- Vì đây là tự báo cáo không đồng bộ, không biết hành vi thao tác thật của 12 người này khi dùng —
  chỉ biết họ nói gì sau khi dùng xong, không biết họ có thực sự làm đúng outcome task hay bỏ qua bước nào.
```

---

## Phụ lục — Mock / Dry-run (tài liệu tham khảo, không tính vào Gate 4)

Trước khi có 12 phản hồi thật ở trên, nhóm dùng một bản mock/dry-run để luyện format ghi feedback. **Đây là template dùng chung** — Hưng cũng dùng đúng bản này (chỉ đổi tên) trong repo của Hưng để luyện trước khi có phản hồi thật, nên hai bản gần như giống hệt nhau về câu chữ. Không phải hai lần luyện độc lập ra trùng nhau ngẫu nhiên — ghi rõ ở đây để không ai đọc nhầm là trùng hợp.

**Loại feedback:** Mock/Synthetic — Lực tự đóng vai tester để luyện format, không phải người ngoài nhóm.

**Preferred option (mock):** B — AI Review Queue, vì cảm giác cân bằng nhất giữa automation và human control; vẫn muốn xem evidence trước khi đồng ý với recommendation của AI.

**Main friction (mock):** chưa rõ vì sao AI xếp một nhóm vào High Priority nếu không hiển thị evidence ngay trên giao diện.

**Next Change gợi ý từ mock:** hiển thị 2–3 evidence chính ngay trên priority card, thay vì phải bấm sâu vào case detail mới hiểu recommendation.

**Đối chiếu với dữ liệu thật:** bản mock này dự đoán đúng đúng pattern mà 4/12 phản hồi thật ở trên cũng nêu ra độc lập (mục Bốn lớp, INTERPRETED) — mock không phải evidence, nhưng việc nó dự đoán đúng hướng cho thấy trade-off của Option B (thiếu giải thích priority) là điểm dễ thấy, không cần chờ 12 phản hồi mới nhận ra.
