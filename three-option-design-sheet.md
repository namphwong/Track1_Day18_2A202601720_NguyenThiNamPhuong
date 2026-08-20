# Day 18 — CP2: Three-Option Design Sheet

**Nhóm:** Đường Bốn Mùa Xuân — 4 thành viên  
**Case:** C — AI Support Radar (VLearn)  
**Checkpoint:** Gate 2 — Meaningful Options  
**Trạng thái:** Ba solution hypotheses để prototype và test; chưa có option nào được validated

## 1. Hypothesis Problem kế thừa từ CP1

> Khi **một phiên lab đông học viên đang diễn ra hoặc vừa kết thúc**, **Lab Coach** gặp khó khăn trong việc **xác định learner nào đang thực sự mắc kẹt và cần được ưu tiên hỗ trợ** vì **tín hiệu hiện tại nằm rải rác giữa quan sát tại lớp, tiến độ checkpoint/VLAB và việc learner tự lên tiếng**, dẫn đến **nguy cơ một số learner được phát hiện hoặc hỗ trợ muộn trong khi thời gian của coach bị phân tán**.

### Evidence Day 17 dẫn tới bài toán thiết kế

- Coach đã phát hiện khó khăn bằng cách đi từng bàn và xem VLAB/checkpoint; vì vậy không thể giả định coach hoàn toàn thiếu tín hiệu.
- Một lượt hỗ trợ có thể mất khoảng 5–10 phút và việc chưa giải quyết xong có thể chuyển sang Discord, giờ nghỉ hoặc sau buổi.
- Hai learner đã tự dùng slide, AI hoặc bạn bè; một workaround được mô tả là giải quyết khá nhanh.
- Do đó, ba option cần kiểm tra cả **cách gom/diễn giải tín hiệu** lẫn **chi phí để coach hành động**, không chỉ thay giao diện của một dashboard.

## 2. Solution Parking Lot

Các hướng được mở trước khi chọn A/B/C:

| # | Hướng giải pháp | Cơ chế chính | Quyết định chọn/không chọn |
| --- | --- | --- | --- |
| 1 | Coach Query / On-demand Scan | Coach chủ động chọn lớp hoặc checkpoint; AI chỉ phân tích khi được hỏi | **Chọn làm Option A** — đại diện user-led |
| 2 | AI Review Queue | AI gom và xếp các trường hợp cần xem; coach duyệt từng trường hợp | **Chọn làm Option B** — đại diện co-create |
| 3 | Proactive Support Agent | AI chủ động phát hiện và chuẩn bị/thực hiện check-in theo giới hạn | **Chọn làm Option C** — đại diện AI-led |
| 4 | Learner Self Check-in | Learner tự báo mức độ hiểu và xin hỗ trợ | Không chọn — phụ thuộc learner chủ động, chưa xử lý trường hợp im lặng |
| 5 | Peer Support Matching | Ghép learner đang kẹt với bạn đã qua checkpoint | Không chọn — chuyển actor và tạo rủi ro chất lượng hỗ trợ |
| 6 | Coach Office-hour Scheduler | Tự gom learner vào slot Discord/giờ nghỉ/sau buổi | Không chọn — tối ưu hành động sau phát hiện nhưng chưa giải quyết ưu tiên ai |
| 7 | Checkpoint Heatmap | Tổng hợp tiến độ theo nhóm/lớp | Không chọn độc lập — có nguy cơ chỉ trình bày lại VLAB hiện có |

Ba option được chọn không nhằm tạo một option “tệ” để hai option còn lại thắng. Mỗi option là một giả thuyết hợp lý về mức phân quyền User–AI.

## 3. Comparison Contract — những thứ bắt buộc giữ nguyên

| Thành phần | Quyết định chung cho A/B/C |
| --- | --- |
| Target user | Lab Coach đang phụ trách một phiên lab đông học viên |
| Situation | Phiên lab đang diễn ra, nhiều nhóm đang làm cùng một task và tiến qua các checkpoint |
| Job | Xác định learner/nhóm thực sự mắc kẹt và cần được ưu tiên hỗ trợ |
| Outcome task cho tester | “Hãy xác định một learner cần được ưu tiên hỗ trợ và quyết định bước hỗ trợ tiếp theo.” |
| Desired outcome | Coach chọn được trường hợp cần ưu tiên dựa trên evidence, với thời gian và sự gián đoạn thấp |
| Data fixture | Cùng một lớp 50 learner, cùng danh sách nhóm, checkpoint, thời gian dừng, yêu cầu trợ giúp và lịch sử hỗ trợ |
| Common scenario | Nhóm 07 dừng ở checkpoint cài đặt 18 phút; chưa gửi yêu cầu trợ giúp; một learner đã mở lại tài liệu nhiều lần |
| Common visual/component | Cùng header lớp, learner card, evidence panel, action buttons và trạng thái hỗ trợ |
| Result choices | Hỗ trợ ngay; lên lịch/đưa vào queue; bỏ qua/chưa đủ evidence |
| Recovery path | Coach có thể quay lại, sửa quyết định và reset về common context |
| Prototype scope | 2–3 trạng thái: Common Context → Critical Interaction → Result/User Decision |

> **Lưu ý evidence:** Các con số trong Common Scenario ("Nhóm 07", "18 phút", "mở tài liệu nhiều lần") là **fixture thiết kế** để prototype test được, lấy cảm hứng từ câu chuyện của PN3 (Lab Coach kể một learner — số ít, không phải một nhóm — kẹt ở cài đặt môi trường trong khi các nhóm khác đã sang checkpoint mới). Các con số cụ thể này không xuất hiện trong transcript Day 17 gốc; không dùng chúng như bằng chứng evidence khi trình bày CP1.

## 4. Những thứ được phép khác

| Thành phần | Option A | Option B | Option C |
| --- | --- | --- | --- |
| Solution mechanism | Coach yêu cầu AI phân tích một phạm vi đã chọn | AI tự tạo review queue, coach duyệt | AI chủ động phát hiện và chuẩn bị/thực hiện check-in theo policy |
| Người khởi tạo | Coach | AI tạo queue; coach mở và duyệt | AI |
| User làm gì? | Chọn lớp/checkpoint, yêu cầu phân tích, đọc evidence, quyết định | Review từng case, chỉnh priority, approve/reject | Đặt policy, giám sát exception, can thiệp khi cần |
| AI làm gì? | Chỉ phân tích khi có lệnh; không tự xếp hạng toàn lớp | Gom tín hiệu, xếp hạng và giải thích; không tự liên hệ learner | Theo dõi tín hiệu, tạo hành động; có thể gửi check-in rủi ro thấp trong giới hạn |
| Trigger | Nút “Kiểm tra checkpoint này” của coach | Ngưỡng tín hiệu tạo case trong review queue | Policy và ngưỡng chủ động đã được coach cấu hình |
| Quyền quyết định cuối | Coach cho mọi trường hợp | Coach trước mọi hành động với learner | AI trong phạm vi rủi ro thấp; coach với trường hợp nhạy cảm/không chắc chắn |
| Trade-off chính | Kiểm soát cao nhưng tốn thao tác và phụ thuộc coach nhớ kiểm tra | Cân bằng độ phủ và kiểm soát nhưng tạo thêm queue cần review | Phản ứng nhanh và phủ rộng nhưng tăng false positive, privacy và automation risk |

## 5. Option A — Coach Query / On-demand Assist

### Solution hypothesis

Nếu coach được quyền chủ động chọn phạm vi và yêu cầu AI tổng hợp evidence khi cần, coach có thể giảm thời gian rà soát mà vẫn giữ toàn bộ quyền quyết định.

### Critical interaction

1. Coach nhìn danh sách lớp hoặc checkpoint.
2. Coach chọn “Checkpoint cài đặt” và bấm **Kiểm tra nhóm đang chậm**.
3. AI trả về các tín hiệu của Nhóm 07: dừng 18 phút, chưa yêu cầu giúp, mở tài liệu nhiều lần.
4. Coach chọn hỗ trợ ngay, lên lịch sau hoặc bỏ qua.

### Phân quyền Human–AI

- **AI: Don't Act** cho tới khi coach yêu cầu.
- AI chỉ tổng hợp và giải thích evidence trong phạm vi coach chọn.
- AI không tự xếp learner vào danh sách ưu tiên toàn lớp và không liên hệ learner.
- Coach chịu trách nhiệm quyết định ai cần hỗ trợ và hành động nào phù hợp.

### Trade-off

Cách này có thể ít gây bất ngờ do AI tự hành động, vì AI chỉ chạy khi coach yêu cầu — phù hợp nếu coach chưa tin tín hiệu tự động hoặc muốn giữ kiểm soát cao. Đổi lại, coach vẫn phải tự nhớ đi kiểm tra, tốn thêm thao tác khi lớp đông, và những learner ngoài phạm vi coach chọn có thể tiếp tục bị bỏ sót.

## 6. Option B — AI Review Queue / Coach Approves

### Solution hypothesis

Nếu AI chủ động gom các tín hiệu rời rạc thành một queue có evidence và độ không chắc chắn, coach có thể ưu tiên nhanh hơn mà vẫn duyệt trước mọi hành động.

### Critical interaction

1. AI tạo review queue từ checkpoint, thời gian dừng, yêu cầu trợ giúp và lịch sử hỗ trợ.
2. Coach mở case Nhóm 07 và thấy lý do xếp hạng cùng cảnh báo “chưa chắc chắn”.
3. Coach có thể chỉnh priority, yêu cầu thêm evidence, approve hỗ trợ hoặc dismiss.
4. Chỉ sau khi coach approve, hệ thống mới tạo bước hỗ trợ tiếp theo.

### Phân quyền Human–AI

- **AI: Act** để tạo và xếp review queue.
- **AI: Ask** trước khi biến đề xuất thành hành động với learner.
- Coach kiểm chứng evidence và quyết định cuối.
- Feedback dismiss/chỉnh priority không tự động được coi là ground truth nếu coach chưa xác nhận lý do.

### Trade-off

Kỳ vọng là độ phủ cao hơn Option A vì coach không phải tự nhớ kiểm tra từng checkpoint, và việc luôn kèm evidence/uncertainty giúp coach không nhầm priority AI đề xuất với một kết luận chắc chắn. Nhưng đây vẫn là kỳ vọng chưa test: queue có thể tạo thêm việc thay vì giảm việc (alert fatigue), false positive có thể làm coach mất niềm tin, và nếu coach đã biết ai cần giúp nhưng chỉ thiếu thời gian thì queue chỉ đang trình bày lại vấn đề cũ.

## 7. Option C — Proactive Support Agent with Guardrails

### Solution hypothesis

Nếu AI được phép chủ động xử lý các trường hợp rủi ro thấp trong giới hạn rõ ràng và chuyển exception cho coach, learner có thể nhận check-in sớm mà không buộc coach duyệt từng case.

### Critical interaction

1. AI phát hiện Nhóm 07 có nhiều tín hiệu mắc kẹt nhưng chưa xin giúp.
2. AI hiển thị trước hành động dự kiến và mức chắc chắn.
3. Với policy đã đặt, AI gửi một check-in trung tính: “Nhóm có cần gợi ý cho checkpoint cài đặt không?”
4. Nếu learner xác nhận cần giúp, case được đưa lên coach; nếu từ chối, AI đóng case và lưu lý do tối thiểu.
5. Coach có thể stop, undo, sửa policy hoặc tắt theo dõi cho learner/nhóm.

### Phân quyền Human–AI

- **AI: Act** với check-in rủi ro thấp, có thể hoàn tác và nằm trong policy.
- **AI: Ask** coach khi evidence mâu thuẫn, confidence thấp hoặc hành động có ảnh hưởng lớn.
- Coach đặt giới hạn, xem audit log và có quyền dừng/undo.
- Learner có quyền từ chối, dismiss và không nhận check-in tiếp trong phiên.

### Trade-off

Ý tưởng là phản ứng nhanh hơn khi coach đang bận, giảm số case coach phải tự duyệt, và xác nhận trực tiếp nhu cầu của learner trước khi dùng thời gian coach — nhưng đây hoàn toàn là kỳ vọng thiết kế, chưa có prototype để kiểm chứng. Rủi ro rõ nhất: learner có thể thấy bị theo dõi hoặc bị gắn nhãn "yếu", false positive gây gián đoạn và giảm niềm tin, chính sách đặt sai có thể khiến AI hành động quá mức — nên cần đường recovery, audit log và opt-out rõ ràng ngay từ đầu.

## 8. Distance Check — kiểm tra khoảng cách giữa A/B/C

### A khác B vì

Option A chỉ phân tích sau khi coach chủ động chọn phạm vi và yêu cầu. Option B tự gom tín hiệu và tạo review queue trước, nhưng coach vẫn duyệt trước khi có hành động với learner.

### B khác C vì

Option B dừng ở đề xuất: AI không liên hệ learner nếu chưa có coach approve. Option C được phép gửi check-in rủi ro thấp trong policy và chỉ chuyển những case cần con người xử lý.

### A khác C vì

Option A ưu tiên quyền kiểm soát và tránh việc AI tự hành động ngoài dự kiến, đổi lại độ phủ phụ thuộc hoàn toàn vào sự chú ý của coach. Option C ưu tiên tốc độ và độ phủ, đổi lại rủi ro false positive, riêng tư và mất quyền tự quyết cao hơn.

### Kiểm tra không dùng khác biệt bề mặt

- Khác biệt không nằm ở màu sắc, wording hay layout.
- Cả ba dùng cùng user, situation, task, outcome và data fixture.
- Mỗi option thay đổi người khởi tạo, việc AI được phép làm, điểm coach phải quyết định và hậu quả nếu AI sai.

## 9. Failure assumptions cần quan sát khi test

| Option | Giả định dễ sai nhất | Hành vi cần quan sát |
| --- | --- | --- |
| A | Coach sẵn sàng chủ động kiểm tra khi bận | Tester có nhớ/bấm kiểm tra không; mất bao lâu để chọn đúng phạm vi |
| B | Queue giúp ưu tiên thay vì tạo thêm việc | Tester có đọc evidence/uncertainty không; có hiểu vì sao case được xếp hạng không |
| C | Check-in chủ động được chấp nhận và policy đủ an toàn | Tester có muốn AI tự gửi không; họ tìm stop/undo/opt-out ở đâu; điều gì làm họ không thoải mái |

## 10. Gate 2 self-check

- [x] A/B/C cùng giải quyết một Hypothesis Problem.
- [x] A/B/C dùng cùng target user, situation, task, desired outcome và data fixture.
- [x] Có ít nhất năm hướng trong Solution Parking Lot trước khi chọn ba.
- [x] Ba option khác nhau về mechanism và cách chia việc/quyền giữa User–AI.
- [x] Có trade-off thật cho từng option; không có option giả tạo để làm nền.
- [x] Distance Check không nhắc màu, layout hoặc wording.
- [x] Chưa tuyên bố option nào thắng hoặc được validated.

**Kết luận:** Đủ điều kiện trình bày **GATE 2 — Meaningful Options** và chuyển sang Human–AI Design Pass.
