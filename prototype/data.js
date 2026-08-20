// data.js — Data fixture dùng chung cho Option A, Option B và Option C.
// Đây là dữ liệu cố định (canned), không gọi model AI thật.

const CLASS_CONTEXT = {
  className: "Lớp Backend Cấp tốc — Ca sáng",
  totalLearners: 50,
  totalGroups: 10,
  task: "Lab: Cài đặt môi trường & Kết nối Database",
  sessionStarted: "09:30",
  now: "10:42",
};

const CHECKPOINTS = [
  {
    id: "cp-install",
    name: "Checkpoint 1 — Cài đặt môi trường",
    groupsTotal: 10,
    groupsPassed: 7,
    groupsInProgress: 3,
    medianMinutesToPass: 9,
  },
  {
    id: "cp-db",
    name: "Checkpoint 2 — Kết nối Database",
    groupsTotal: 10,
    groupsPassed: 4,
    groupsInProgress: 2,
    medianMinutesToPass: 12,
  },
  {
    id: "cp-api",
    name: "Checkpoint 3 — Gọi API đầu tiên",
    groupsTotal: 10,
    groupsPassed: 0,
    groupsInProgress: 0,
    medianMinutesToPass: null,
  },
];

// Các nhóm đang dừng tại Checkpoint 1 — dùng chung cho A và B.
// Nhóm 07 là trường hợp trọng tâm của scenario, nhưng Nhóm 03/09 được giữ lại
// để coach phải tự so sánh, không bị dẫn sẵn tới một đáp án.
//
// LƯU Ý EVIDENCE: "Nhóm 07", "18 phút", "mở tài liệu 4 lần" là fixture thiết kế
// để prototype test được, lấy cảm hứng từ câu chuyện chung của PN3 (Lab Coach
// "May" kể một learner — số ít, không phải một nhóm — kẹt ở cài đặt môi trường
// trong khi các nhóm khác đã sang checkpoint mới). Các con số cụ thể này KHÔNG
// xuất hiện trong transcript gốc — không dùng chúng như bằng chứng evidence.
const GROUPS_AT_INSTALL_CHECKPOINT = [
  {
    id: "group-03",
    name: "Nhóm 03",
    members: ["Nguyễn Văn Bảo", "Đặng Thị Yến"],
    stalledMinutes: 6,
    helpRequested: false,
    docsReopened: 1,
    priorSupportThisSession: 0,
  },
  {
    id: "group-07",
    name: "Nhóm 07",
    members: ["Trần Minh Khôi", "Lê Thu Hà", "Phạm Đức Anh"],
    stalledMinutes: 18,
    helpRequested: false,
    docsReopened: 4,
    priorSupportThisSession: 0,
  },
  {
    id: "group-09",
    name: "Nhóm 09",
    members: ["Vũ Ngọc Mai", "Hoàng Gia Bảo"],
    stalledMinutes: 9,
    helpRequested: true,
    docsReopened: 2,
    priorSupportThisSession: 0,
  },
];

// Evidence chi tiết + uncertainty cho từng nhóm — dùng chung cho A và B.
const EVIDENCE_BY_GROUP = {
  "group-03": {
    signals: [
      { label: "Thời gian dừng tại checkpoint", value: "6 phút", note: "Thấp hơn trung vị lớp (~9 phút). Chưa có dấu hiệu bất thường rõ ràng." },
      { label: "Yêu cầu trợ giúp", value: "Chưa gửi", note: "Im lặng không đồng nghĩa với đang mắc kẹt." },
      { label: "Mở lại tài liệu hướng dẫn", value: "1 lần", note: "Trong khoảng bình thường." },
      { label: "Lịch sử hỗ trợ trong buổi", value: "Chưa có lượt nào", note: "Không có dữ liệu nền để so sánh." },
    ],
    uncertainty: "Tín hiệu hiện tại không khác biệt nhiều so với các nhóm đã qua checkpoint bình thường. Chưa đủ căn cứ để coi đây là trường hợp cần ưu tiên.",
  },
  "group-07": {
    signals: [
      { label: "Thời gian dừng tại checkpoint", value: "18 phút", note: "Gấp đôi trung vị lớp (~9 phút). Đây là tương quan thời gian, không phải bằng chứng trực tiếp về lỗi kỹ thuật." },
      { label: "Yêu cầu trợ giúp", value: "Chưa gửi", note: "Có thể nhóm đang tự xử lý hoặc ngại lên tiếng — không thể suy ra chắc chắn nhóm đang mắc kẹt chỉ từ việc này." },
      { label: "Mở lại tài liệu hướng dẫn", value: "4 lần trong 18 phút", note: "Có thể là dấu hiệu bối rối, hoặc đơn thuần đang đọc kỹ từng bước." },
      { label: "Lịch sử hỗ trợ trong buổi", value: "Chưa có lượt nào", note: "Không có dữ liệu nền để so sánh mức độ bất thường." },
    ],
    uncertainty: "Thời gian dừng lâu và số lần mở tài liệu là tín hiệu gián tiếp, không phải bằng chứng chắc chắn rằng nhóm đang mắc kẹt. Có thể nhóm đang thảo luận kỹ hoặc gặp lỗi môi trường cụ thể — evidence hiện tại chưa phân biệt được hai khả năng này.",
    moreEvidence: [
      { label: "So với các nhóm khác cùng checkpoint", value: "Chậm nhất trong 3 nhóm đang dừng tại Checkpoint 1." },
      { label: "Lịch sử checkpoint trước đó", value: "Nhóm 07 hoàn thành phần giới thiệu công cụ đúng tiến độ, không có dấu hiệu chậm trước đây." },
      { label: "Giới hạn dữ liệu", value: "Hệ thống không biết nội dung cụ thể nhóm đang đọc hoặc đang gặp lỗi gì — chỉ biết thời lượng và tần suất thao tác." },
    ],
  },
  "group-09": {
    signals: [
      { label: "Thời gian dừng tại checkpoint", value: "9 phút", note: "Xấp xỉ trung vị lớp." },
      { label: "Yêu cầu trợ giúp", value: "Đã gửi lúc 10:38", note: "Nhóm đã chủ động lên tiếng — tín hiệu rõ ràng hơn so với suy luận từ hành vi." },
      { label: "Mở lại tài liệu hướng dẫn", value: "2 lần", note: "Trong khoảng bình thường." },
      { label: "Lịch sử hỗ trợ trong buổi", value: "Chưa có lượt nào", note: "Đây là yêu cầu đầu tiên của nhóm." },
    ],
    uncertainty: "Yêu cầu trợ giúp trực tiếp là tín hiệu đáng tin hơn tín hiệu hành vi suy luận, nhưng chưa rõ mức độ khẩn cấp hay nhóm đã tự thử cách nào trước khi gửi yêu cầu.",
  },
};

// Priority đề xuất ban đầu của AI cho Option B (AI phải giải thích, không chỉ đưa số).
const AI_QUEUE_SUGGESTION = {
  "group-07": {
    priority: "Cao",
    reason: "Thời gian dừng gấp đôi trung vị lớp và mở lại tài liệu nhiều lần, nhưng chưa gửi yêu cầu trợ giúp — AI không chắc đây là mắc kẹt kỹ thuật hay chỉ đang đọc kỹ.",
  },
  "group-09": {
    priority: "Trung bình",
    reason: "Đã chủ động gửi yêu cầu trợ giúp — tín hiệu đáng tin hơn, nhưng thời gian dừng chỉ ở mức trung bình nên mức độ khẩn cấp chưa rõ.",
  },
  "group-03": {
    priority: "Thấp",
    reason: "Các chỉ số đều trong khoảng bình thường so với nhóm đã qua checkpoint. AI đề xuất theo dõi thêm, chưa có tín hiệu bất thường.",
  },
};

const RESULT_LABELS = {
  support_now: "Hỗ trợ ngay",
  schedule: "Lên lịch / đưa vào queue",
  dismiss: "Bỏ qua — chưa đủ evidence",
};

// =====================================================================
// Data riêng cho Option C — Proactive Support Agent with Guardrails
// Dùng chung Nhóm 03/07/09 và evidence ở trên. Khác Option A/B ở chỗ:
// AI đã có thể tự hành động (Act) trong giới hạn policy TRƯỚC KHI coach
// mở tab, hoặc tự quyết định chuyển thẳng cho coach (Ask) mà không tự
// trả lời learner, hoặc không làm gì cả (Don't Act).
// =====================================================================

const POLICY_C = {
  autoActRule:
    "Được phép tự động gửi một check-in trung tính (không kết luận, không đánh giá) nếu: nhóm dừng lâu bất thường so với trung vị lớp VÀ có tín hiệu hành vi bất thường khác, NHƯNG chưa có ai trong nhóm chủ động liên hệ coach.",
  alwaysEscalateRule:
    "Luôn chuyển thẳng cho coach xử lý, AI không tự soạn hay gửi phản hồi thay — khi: learner/nhóm đã chủ động gửi yêu cầu trợ giúp, evidence mâu thuẫn nhau đến mức AI không phân biệt được nguyên nhân, hoặc hành động có ảnh hưởng lớn tới trải nghiệm learner.",
  guardrails: [
    "Check-in luôn có thể thu hồi (undo) trước khi learner hoặc coach phản hồi.",
    "AI không tự đóng case liên quan tới một learner cụ thể — chỉ coach mới được đóng case đó.",
    "Coach có thể tắt hành động tự động cho một nhóm bất kỳ lúc nào.",
    "Learner có quyền từ chối check-in mà không bị hỏi lại trong cùng phiên.",
    "Mọi hành động của AI đều được ghi lại kèm thời gian, lý do và mức tin cậy trong audit log bên dưới.",
  ],
};

// Nội dung check-in AI đã tự soạn cho Nhóm 07 (Act — rủi ro thấp, trung lập,
// không kết luận nhóm đang gặp lỗi gì).
const CHECKIN_MESSAGE = {
  "group-07": "Nhóm mình dừng ở bước cài đặt hơi lâu — có cần gợi ý hay tài liệu bổ sung không? Chỉ cần trả lời có/không nhé, không sao nếu đang làm bình thường.",
};

// Audit log ban đầu — mỗi lần reset sẽ trả về bản sao mới của log này.
// type: "auto_checkin" (AI đã Act), "escalate_direct" (AI Ask/chuyển thẳng
// coach, không tự trả lời), "monitor" (Don't Act, chỉ theo dõi).
function getInitialProactiveLog() {
  return [
    {
      id: 3,
      time: "10:41",
      groupId: "group-07",
      type: "auto_checkin",
      summary: "AI tự động gửi check-in tới Nhóm 07 — trong policy, rủi ro thấp, có thể thu hồi.",
    },
    {
      id: 2,
      time: "10:38",
      groupId: "group-09",
      type: "escalate_direct",
      summary: "Nhóm 09 tự gửi yêu cầu trợ giúp — AI không tự trả lời, chuyển thẳng cho coach.",
    },
    {
      id: 1,
      time: "10:36",
      groupId: "group-03",
      type: "monitor",
      summary: "AI theo dõi Nhóm 03 — tín hiệu trong ngưỡng bình thường, chưa có hành động nào.",
    },
  ];
}

// Cùng nội dung với POLICY_C.autoActRule / alwaysEscalateRule ở trên, nhưng
// tách sẵn thành lead + từng điều kiện để hiển thị dạng bullet cho coach quét
// nhanh. KHÔNG đổi một chữ nào: ghép lead + conditions bằng dấu cách phải ra
// đúng chuỗi gốc — smoke test kiểm tra điều này để tránh trôi nội dung.
const POLICY_C_BULLETS = {
  autoAct: {
    lead: "Được phép tự động gửi một check-in trung tính (không kết luận, không đánh giá) nếu:",
    conditions: [
      "nhóm dừng lâu bất thường so với trung vị lớp",
      "VÀ có tín hiệu hành vi bất thường khác,",
      "NHƯNG chưa có ai trong nhóm chủ động liên hệ coach.",
    ],
  },
  alwaysEscalate: {
    lead: "Luôn chuyển thẳng cho coach xử lý, AI không tự soạn hay gửi phản hồi thay — khi:",
    conditions: [
      "learner/nhóm đã chủ động gửi yêu cầu trợ giúp,",
      "evidence mâu thuẫn nhau đến mức AI không phân biệt được nguyên nhân,",
      "hoặc hành động có ảnh hưởng lớn tới trải nghiệm learner.",
    ],
  },
};

const ACTIVITY_TYPE_LABEL = {
  auto_checkin: "AI đã hành động (Act)",
  escalate_direct: "AI chuyển cho coach (Ask)",
  monitor: "Chỉ theo dõi (Don't Act)",
  coach_decision: "Coach đã quyết định",
  undo: "Coach đã thu hồi",
  policy_change: "Coach đổi policy",
};
