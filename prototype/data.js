// data.js — Data fixture dùng chung cho Option A và Option B.
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
