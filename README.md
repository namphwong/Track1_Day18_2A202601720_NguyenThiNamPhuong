# Track 1 — Day 18: Multiple Prototypes & Human–AI Design

## Nhóm Đường Bốn Mùa Xuân

| Thành viên | Mã học viên |
| --- | --- |
| Vũ Thế Lực | 2A202602008 |
| Hoàng Tuấn Hưng | 2A202601911 |
| Nguyễn Thị Nam Phương | 2A202601720 |
| Đỗ Thị Thanh Loan | 2A202601654 |

## Lab Information

- **Track:** Track 1 — AI Product
- **Day:** Day 18
- **Case:** C — AI Support Radar (VLearn)
- **Nhóm:** 4 thành viên
- **Nguồn evidence:** Day 17 — 2 learner interviews và 1 Lab Coach interview
- **Trạng thái:** CP1–CP3 hoàn thành; prototype A/B/C đã build, tự kiểm và có 12 phản hồi thật từ người ngoài nhóm (CP4/CP5 một phần — xem giới hạn phương pháp bên dưới); chưa validated

## Hypothesis Problem

> Khi **một phiên lab đông học viên đang diễn ra hoặc vừa kết thúc**, **Lab Coach** gặp khó khăn trong việc **xác định learner nào đang thực sự mắc kẹt và cần được ưu tiên hỗ trợ** vì **tín hiệu hiện tại nằm rải rác giữa quan sát tại lớp, tiến độ checkpoint/VLAB và việc learner tự lên tiếng**, dẫn đến **nguy cơ một số learner được phát hiện hoặc hỗ trợ muộn trong khi thời gian của coach bị phân tán**.

## Tài liệu hiện có

| Checkpoint | Tài liệu | Trạng thái |
| --- | --- | --- |
| CP1 — Evidence Continuity | [cp1-evidence-continuity.md](cp1-evidence-continuity.md) | Hoàn thành bản chuẩn bị |
| CP2 — Meaningful Options | [three-option-design-sheet.md](three-option-design-sheet.md) | Hoàn thành bản chuẩn bị |
| CP3 — Human Control | [human-ai-decision-table.md](human-ai-decision-table.md) | Tự kiểm xong cho A, B và C |
| CP4 — Test-ready | [prototype-link.md](prototype-link.md) | Prototype A/B/C chạy được local; đã có 12 phản hồi từ người ngoài nhóm tự dùng, nhưng ở dạng tự báo cáo qua tin nhắn, **không có facilitator quan sát trực tiếp** — xem [prototype-feedback-note.md](prototype-feedback-note.md) |
| CP5 — Learning | [group-feedback-synthesis.md](group-feedback-synthesis.md) | Đã tổng hợp pattern từ 12 phản hồi và chốt một Next Change có evidence |

## Cách chạy prototype (Option A, B & C)

Không cần build step, không cần backend, không cần cài package.

```bash
cd prototype
# Cách 1: mở trực tiếp
start index.html          # Windows
# Cách 2: qua static server nếu trình duyệt chặn file://
npx serve .
```

Chi tiết critical interaction của từng option xem tại [prototype-link.md](prototype-link.md).

## Trạng thái triển khai Option A, B và C

- **Option A — Coach Query:** Đã implement thành prototype (`prototype/`), tab "Option A". Coach chủ động chọn checkpoint và yêu cầu AI phân tích; AI không tự chạy trước khi có lệnh.
- **Option B — AI Review Queue:** Đã implement thành prototype (`prototype/`), tab "Option B". AI tự tạo review queue kèm priority + uncertainty; coach review, chỉnh priority, approve/dismiss trước khi có bước hỗ trợ tiếp theo.
- **Option C — Proactive Agent:** Đã implement thành prototype (`prototype/`), tab "Option C". AI có thể đã tự Act (gửi check-in rủi ro thấp, có thể thu hồi) hoặc tự Ask/chuyển thẳng coach — **trước khi coach mở tab** — tuỳ theo policy và guardrail; coach xem audit log, undo, mô phỏng phản hồi learner, tắt theo dõi theo nhóm, và luôn là người đóng case cuối cùng.
- Cả A, B và C đã được tự chạy và kiểm tra toàn bộ flow (chọn/quét/mở case, đổi trạng thái, các nút hành động, undo, mô phỏng phản hồi learner, toggle policy, back, reset) bằng smoke test nội bộ. Ngoài ra, đã có 12 phản hồi từ người ngoài nhóm tự mở prototype và báo lại lựa chọn + lý do qua tin nhắn — nhưng đây là tự báo cáo không đồng bộ, không có ai quan sát trực tiếp hành vi thao tác của họ, nên **chưa thể tuyên bố Gate 4 (test-ready) đã pass đúng theo luật facilitation gốc của bài**, dù đã có dữ liệu thật để tổng hợp Gate 5.

## Ba Solution Options

### Option A — Coach Query / On-demand Assist

Coach chủ động chọn phạm vi và yêu cầu AI phân tích. AI không tự tạo queue hoặc liên hệ learner. Coach giữ toàn bộ quyền quyết định.

### Option B — AI Review Queue / Coach Approves

AI chủ động gom tín hiệu và xếp các trường hợp vào review queue. Coach đọc evidence, chỉnh mức ưu tiên và duyệt trước mọi hành động với learner.

### Option C — Proactive Support Agent with Guardrails

AI được phép gửi check-in rủi ro thấp trong policy do coach đặt. Trường hợp không chắc chắn hoặc ảnh hưởng lớn phải chuyển cho coach. Coach có stop, undo và audit log; learner có quyền từ chối.

## Phân công thực hiện

Nhóm tổ chức thành hai nhánh triển khai để phù hợp tình hình làm việc hiện tại. Mọi artifact vẫn ghi nhận đúng người phụ trách gốc và đóng góp thực tế.

| Nhánh thực hiện | Thành viên/phần được phụ trách | Công việc chính | Đầu ra |
| --- | --- | --- | --- |
| Nhánh 1 — Vũ Thế Lực | Phần của Lực + hỗ trợ hoàn thành phần của Hoàng Tuấn Hưng | Option A — Coach Query; Option B — AI Review Queue; quản lý repo và chuẩn hóa common context/data fixture | Prototype A, Prototype B, README, prototype links và integration |
| Nhánh 2 — Đỗ Thị Thanh Loan | Phần của Loan + hỗ trợ hoàn thành phần của Nguyễn Thị Nam Phương | Option C — Proactive Agent; Human–AI Design; chuẩn hóa test và tổng hợp feedback | Prototype C, Human–AI Decision Table, test script và Group Feedback Synthesis |

### Trách nhiệm chung

- Người test phải trải nghiệm cả ba option, không chỉ mang option mình build đi test.
- Mỗi observation phải tách khỏi interpretation, không tạo feedback giả.
- Mỗi người ghi rõ phần đóng góp thực tế trong repo cá nhân và trong AI Support Log.

## Still Unproven

- Có bao nhiêu learner thực sự bị bỏ sót hoặc được hỗ trợ muộn?
- Nút thắt chính là thiếu tín hiệu, tín hiệu không đáng tin hay coach thiếu thời gian hành động?
- VLAB/checkpoint dự đoán tình trạng mắc kẹt chính xác đến đâu?
- Learner có chấp nhận việc được chủ động tiếp cận dựa trên dữ liệu hành vi không?
- Option nào giúp coach xử lý nhanh hơn mà vẫn duy trì quyền kiểm soát?

## Nguyên tắc của bài

- Cả A/B/C dùng cùng user, situation, task, desired outcome và data fixture.
- Khác biệt phải nằm ở cơ chế và quyền quyết định User–AI, không chỉ màu sắc hoặc layout.
- Mỗi tester phải trải nghiệm cả ba option với cùng một outcome task.
- Feedback được dùng để chọn iteration tiếp theo, không dùng để tuyên bố solution đã validated.
- Mọi AI support phải được ghi trung thực trong `ai-support-log.md` khi hoàn thiện bài.

## Cấu trúc dự kiến khi nộp

```text
Track1_Day18_DuongBonMuaXuan/
├── README.md
├── cp1-evidence-continuity.md
├── three-option-design-sheet.md
├── human-ai-decision-table.md
├── prototype/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── data.js
├── prototype-link.md
├── prototype-feedback-note.md
├── group-feedback-synthesis.md
└── ai-support-log.md
```

## Trạng thái Gate

- [x] Gate 1 — Evidence Continuity
- [x] Gate 2 — Meaningful Options
- [x] Gate 3 — Human Control — tự kiểm xong cho Option A, B và C ([human-ai-decision-table.md](human-ai-decision-table.md)); chỉ là tự kiểm nội bộ bằng smoke test, chưa có tester ngoài nhóm xác nhận.
- [ ] Gate 4 — Test-ready — prototype A/B/C đã tự kiểm toàn bộ flow và có 12 phản hồi thật (xem [prototype-feedback-note.md](prototype-feedback-note.md)), nhưng ở dạng tự báo cáo qua tin nhắn, không có facilitator quan sát hành vi trực tiếp như luật gốc của bài yêu cầu; file đó còn có một phụ lục mock/dry-run dùng để luyện format trước khi có phản hồi thật, không tính vào đánh giá này. Chưa đủ điều kiện đánh dấu pass đầy đủ.
- [x] Gate 5 — Learning, not praise — có [group-feedback-synthesis.md](group-feedback-synthesis.md) tổng hợp pattern từ 12 phản hồi thật, một Next Change có evidence cụ thể, và Still Unproven cập nhật sau feedback — chưa tuyên bố solution nào đã validated.

> Gate 1 và Gate 2 hiện là tài liệu chuẩn bị dựa trên evidence Day 17. Trạng thái có thể được điều chỉnh sau khi coach review và sau khi nhóm prototype-test.
