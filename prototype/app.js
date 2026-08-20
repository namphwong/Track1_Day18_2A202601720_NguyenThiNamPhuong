// app.js — Logic cho Option A (Coach Query), Option B (AI Review Queue)
// và Option C (Proactive Agent).
// Không gọi model AI thật. Toàn bộ "phân tích" đọc từ data.js (canned fixture).

const PRIORITY_CLASS = { "Cao": "priority-high", "Trung bình": "priority-mid", "Thấp": "priority-low" };

// Tone chỉ là gợi ý TRÌNH BÀY để ba nhóm phân biệt được bằng mắt — KHÔNG phải
// mức độ chắc chắn của evidence và không phải kết luận của AI. Mọi giới hạn của
// evidence vẫn nằm nguyên trong note/uncertainty của từng tín hiệu.
const GROUP_TONE = {
  "group-07": "tone-warning",
  "group-09": "tone-accent",
  "group-03": "tone-calm",
};

const ACTIVITY_TONE = {
  auto_checkin: "tone-success",
  escalate_direct: "tone-warning",
  monitor: "tone-calm",
  coach_decision: "tone-accent",
  undo: "tone-danger",
  policy_change: "tone-calm",
};

// Quyết định cố định của AI cho từng nhóm ở Option C (dùng cho situation strip).
const C_AI_DECISION = {
  "group-07": "auto_checkin",
  "group-09": "escalate_direct",
  "group-03": "monitor",
};

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const groupById = (id) => GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === id);

// ---------- Theme ----------
// Mặc định theo cài đặt hệ điều hành; coach bấm nút để ghi đè. Lưu lựa chọn
// nếu localStorage dùng được — mở bằng file:// có thể bị chặn, không sao.
const THEME_KEY = "asr-theme";

function prefersLight() {
  // matchMedia vắng mặt ở vài môi trường (jsdom, browser rất cũ) — coi như tối.
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  );
}

function currentTheme() {
  const forced = document.documentElement.getAttribute("data-theme");
  if (forced === "light" || forced === "dark") return forced;
  return prefersLight() ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    /* file:// có thể chặn localStorage — chỉ mất việc nhớ lựa chọn */
  }
}

function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (e) {
    /* bỏ qua */
  }
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }
}

// ---------- Prose → bullets ----------
// Tách một đoạn thành từng câu để coach quét nhanh thay vì đọc khối chữ.
// CHỈ đổi cách xuống dòng, không đổi chữ: ghép các phần lại bằng một dấu
// cách phải ra đúng chuỗi gốc (smoke test kiểm tra điều này).
function sentenceBullets(text) {
  // Cắt sau dấu chấm, và trước dấu gạch ngang — vế sau gạch ngang gần như
  // luôn là một ý riêng ("... — không thể suy ra chắc chắn ..."). Cả hai chỗ
  // cắt đều nuốt đúng khoảng trắng, nên ghép lại bằng " " ra đúng chuỗi gốc.
  const parts = String(text)
    .split(/(?<=\.)\s+|\s+(?=—\s)/)
    .filter(Boolean);
  return parts.length > 1 ? parts : [];
}

// Nhiều câu → <ul> bullet. Một câu → thẻ thường, vì bullet đơn lẻ vô nghĩa.
function proseHTML(text, { tag = "p", cls = "", bulletCls = "bullets" } = {}) {
  const items = sentenceBullets(text);
  if (!items.length) return `<${tag} class="${cls}">${esc(text)}</${tag}>`;
  // Bỏ dấu gạch ngang mở đầu khi hiển thị — nó chỉ cần khi các vế nối liền.
  return `<ul class="${bulletCls}">${items
    .map((i) => `<li>${esc(i.replace(/^—\s*/, ""))}</li>`)
    .join("")}</ul>`;
}

// Quy tắc policy dạng lead + danh sách điều kiện. Bỏ dấu phẩy/chấm cuối mỗi
// điều kiện khi hiển thị — dấu câu chỉ cần khi các vế nối thành một câu.
function ruleBulletsHTML(part) {
  return `
    <p class="rule-lead">${esc(part.lead)}</p>
    <ul class="bullets bullets-md">
      ${part.conditions.map((c) => `<li>${esc(c.replace(/[,.]$/, ""))}</li>`).join("")}
    </ul>`;
}

// ---------- Shared header ----------
function renderClassBanner() {
  document.getElementById("class-name").textContent = CLASS_CONTEXT.className;
  document.getElementById("class-task").textContent = CLASS_CONTEXT.task;
  document.getElementById("class-size").textContent =
    `${CLASS_CONTEXT.totalLearners} learner · ${CLASS_CONTEXT.totalGroups} nhóm`;
  document.getElementById("class-time").textContent =
    `Bắt đầu ${CLASS_CONTEXT.sessionStarted} · Hiện tại ${CLASS_CONTEXT.now}`;
}

// ---------- Shared components ----------

function statHTML(label, value, note, tone) {
  return `
    <div class="stat ${tone ? "stat-tone-" + tone : ""}">
      <span class="stat-label">${esc(label)}</span>
      <span class="stat-value">${esc(value)}</span>
      <span class="stat-note">${esc(note)}</span>
    </div>`;
}

// Tất cả số liệu dưới đây được suy ra từ data fixture đã có, không thêm dữ liệu mới.
function installCheckpointFacts() {
  const groups = GROUPS_AT_INSTALL_CHECKPOINT;
  const cp = CHECKPOINTS.find((c) => c.id === "cp-install");
  const slowest = groups.slice().sort((a, b) => b.stalledMinutes - a.stalledMinutes)[0];
  const asked = groups.filter((g) => g.helpRequested);
  return { groups, cp, slowest, asked };
}

function renderSituationStripA() {
  const { groups, cp, slowest, asked } = installCheckpointFacts();
  document.getElementById("a-situation").innerHTML =
    statHTML("Nhóm đang dừng", String(groups.length), "tại " + cp.name.split(" — ")[0], null) +
    statHTML("Dừng lâu nhất", slowest.name, `${slowest.stalledMinutes} phút`, "warning") +
    statHTML(
      "Đã xin trợ giúp",
      String(asked.length),
      asked.length ? asked.map((g) => g.name).join(", ") : "chưa nhóm nào",
      asked.length ? "accent" : null
    ) +
    statHTML("Trung vị lớp", `${cp.medianMinutesToPass} phút`, "thời gian qua checkpoint", null);
}

function renderSituationStripB() {
  const { groups, cp, asked } = installCheckpointFacts();
  const high = Object.values(AI_QUEUE_SUGGESTION).filter((s) => s.priority === "Cao").length;
  document.getElementById("b-situation").innerHTML =
    statHTML("Case trong queue", String(groups.length), "do AI tự tạo", null) +
    statHTML("AI đề xuất ưu tiên Cao", String(high), "cần coach xem trước", "warning") +
    statHTML(
      "Đã xin trợ giúp",
      String(asked.length),
      asked.length ? asked.map((g) => g.name).join(", ") : "chưa nhóm nào",
      asked.length ? "accent" : null
    ) +
    statHTML("Trung vị lớp", `${cp.medianMinutesToPass} phút`, "thời gian qua checkpoint", null);
}

function renderSituationStripC() {
  const counts = { auto_checkin: 0, escalate_direct: 0, monitor: 0 };
  Object.values(C_AI_DECISION).forEach((t) => (counts[t] += 1));
  document.getElementById("c-situation").innerHTML =
    statHTML("Nhóm AI đang theo dõi", String(Object.keys(C_AI_DECISION).length), "tại Checkpoint 1", null) +
    statHTML("AI đã tự hành động", String(counts.auto_checkin), "check-in đã gửi (Act)", "success") +
    statHTML("AI chuyển cho coach", String(counts.escalate_direct), "không tự trả lời (Ask)", "warning") +
    statHTML("Chỉ theo dõi", String(counts.monitor), "không hành động (Don't Act)", null);
}

function chipsHTML(g) {
  return `
    <div class="chips">
      <span class="chip">Dừng ${g.stalledMinutes} phút</span>
      <span class="chip ${g.helpRequested ? "chip-accent" : ""}">${
        g.helpRequested ? "Đã xin trợ giúp" : "Chưa xin trợ giúp"
      }</span>
      <span class="chip">Mở tài liệu ${g.docsReopened} lần</span>
    </div>`;
}

function evidenceHTML(groupId, heading) {
  const ev = EVIDENCE_BY_GROUP[groupId];
  return `
    <div class="evidence">
      <h3>${esc(heading)}</h3>
      <div class="metrics">
        ${ev.signals
          .map(
            (s) => `
          <div class="metric">
            <span class="metric-label">${esc(s.label)}</span>
            <span class="metric-value">${esc(s.value)}</span>
            ${proseHTML(s.note, { tag: "span", cls: "metric-note" })}
          </div>`
          )
          .join("")}
      </div>
      <div class="uncertainty">
        <span class="overline">Mức độ chắc chắn của evidence</span>
        ${proseHTML(ev.uncertainty, { bulletCls: "bullets bullets-md" })}
      </div>
    </div>`;
}

// ---------- Tabs ----------
function switchTab(tab) {
  ["A", "B", "C"].forEach((t) => {
    document.getElementById("panel-" + t).classList.toggle("hidden", tab !== t);
    document.getElementById("tab-btn-" + t).setAttribute("aria-selected", String(tab === t));
  });
}

document.getElementById("tab-btn-A").addEventListener("click", () => switchTab("A"));
document.getElementById("tab-btn-B").addEventListener("click", () => switchTab("B"));
document.getElementById("tab-btn-C").addEventListener("click", () => switchTab("C"));

document.getElementById("global-reset").addEventListener("click", () => {
  resetOptionA();
  resetOptionB();
  resetOptionC();
});

// =====================================================================
// OPTION A — Coach Query / On-demand Assist
// =====================================================================

let aSelectedCheckpoint = null;
let aSelectedGroup = null;

function renderCheckpointList() {
  const list = document.getElementById("a-checkpoint-list");
  list.innerHTML = "";
  CHECKPOINTS.forEach((cp) => {
    const pct = cp.groupsTotal ? Math.round((cp.groupsPassed / cp.groupsTotal) * 100) : 0;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cp-card";
    card.setAttribute("aria-pressed", String(aSelectedCheckpoint === cp.id));
    card.innerHTML = `
      <span class="cp-name">${esc(cp.name)}</span>
      <span class="cp-bar"><span style="width:${pct}%"></span></span>
      <span class="cp-stats">${cp.groupsPassed}/${cp.groupsTotal} nhóm đã qua · ${cp.groupsInProgress} đang làm</span>
    `;
    card.addEventListener("click", () => {
      aSelectedCheckpoint = cp.id;
      document.getElementById("a-scan-btn").disabled = false;
      renderCheckpointList();
    });
    list.appendChild(card);
  });
}

document.getElementById("a-scan-btn").addEventListener("click", () => {
  if (!aSelectedCheckpoint) return;
  runOptionAScan();
});

function runOptionAScan() {
  const cp = CHECKPOINTS.find((c) => c.id === aSelectedCheckpoint);
  document.getElementById("a-scan-checkpoint-name").textContent = cp.name;

  const groups = aSelectedCheckpoint === "cp-install" ? GROUPS_AT_INSTALL_CHECKPOINT : [];
  const list = document.getElementById("a-group-list");
  list.innerHTML = "";

  const situation = document.getElementById("a-situation");
  if (groups.length === 0) {
    situation.classList.add("hidden");
    list.innerHTML = `<p class="hint">Không có nhóm nào đang dừng lâu bất thường tại checkpoint này ngay lúc này.</p>`;
    document.getElementById("a-evidence-panel").innerHTML = "";
  } else {
    situation.classList.remove("hidden");
    renderSituationStripA();
    groups
      .slice()
      .sort((a, b) => b.stalledMinutes - a.stalledMinutes)
      .forEach((g) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "case-card " + GROUP_TONE[g.id];
        card.setAttribute("aria-pressed", String(aSelectedGroup === g.id));
        card.innerHTML = `
          <div class="case-body">
            <div class="case-top">
              <span class="case-name">${esc(g.name)}</span>
              <span class="case-sub">${g.members.length} learner</span>
            </div>
            ${chipsHTML(g)}
          </div>`;
        card.addEventListener("click", () => {
          aSelectedGroup = g.id;
          renderOptionAEvidence(g);
          runOptionAScan(); // re-render list to show selection highlight
        });
        list.appendChild(card);
      });
  }

  document.getElementById("a-state-context").classList.add("hidden");
  document.getElementById("a-state-scan").classList.remove("hidden");

  if (aSelectedGroup) {
    const g = groups.find((x) => x.id === aSelectedGroup);
    if (g) renderOptionAEvidence(g);
  } else if (groups.length) {
    document.getElementById("a-evidence-panel").innerHTML =
      `<div class="empty-detail">Chọn một nhóm bên trái để xem evidence chi tiết và mức độ chắc chắn.</div>`;
  }
}

function renderOptionAEvidence(group) {
  const panel = document.getElementById("a-evidence-panel");
  panel.innerHTML = `
    ${evidenceHTML(group.id, `Evidence — ${group.name} (${group.members.join(", ")})`)}
    <div class="rail mt-12">
      <span class="overline">Quyết định của bạn</span>
      <div class="rail-actions">
        <button class="btn btn-decide decide-go" data-result="support_now">Hỗ trợ ngay</button>
        <button class="btn btn-decide decide-info" data-result="schedule">Lên lịch / đưa vào queue</button>
        <button class="btn btn-decide decide-calm" data-result="dismiss">Bỏ qua — chưa đủ evidence</button>
      </div>
    </div>`;
  panel.querySelectorAll("[data-result]").forEach((btn) => {
    btn.addEventListener("click", () => recordOptionAResult(group, btn.dataset.result));
  });
}

function recordOptionAResult(group, result) {
  const summary = document.getElementById("a-result-summary");
  summary.className = "result" + (result === "dismiss" ? " dismiss" : "");
  summary.innerHTML = `
    <span class="result-title">${esc(RESULT_LABELS[result])}</span>
    <p>Coach đã chọn "<strong>${esc(RESULT_LABELS[result])}</strong>" cho ${esc(group.name)} sau khi tự yêu cầu AI kiểm tra
    Checkpoint 1 — Cài đặt môi trường và đọc evidence + mức độ chắc chắn.</p>
  `;
  document.getElementById("a-state-scan").classList.add("hidden");
  document.getElementById("a-state-result").classList.remove("hidden");
}

document.getElementById("a-back-to-context").addEventListener("click", () => {
  document.getElementById("a-state-scan").classList.add("hidden");
  document.getElementById("a-state-context").classList.remove("hidden");
});

document.getElementById("a-result-back").addEventListener("click", () => {
  document.getElementById("a-state-result").classList.add("hidden");
  document.getElementById("a-state-scan").classList.remove("hidden");
});

function resetOptionA() {
  aSelectedCheckpoint = null;
  aSelectedGroup = null;
  document.getElementById("a-scan-btn").disabled = true;
  document.getElementById("a-evidence-panel").innerHTML = "";
  document.getElementById("a-state-result").classList.add("hidden");
  document.getElementById("a-state-scan").classList.add("hidden");
  document.getElementById("a-state-context").classList.remove("hidden");
  renderCheckpointList();
}

// =====================================================================
// OPTION B — AI Review Queue / Coach Approves
// =====================================================================

let bOpenCaseGroupId = null;
let bMoreEvidenceShown = false;

function renderQueue() {
  renderSituationStripB();
  const list = document.getElementById("b-queue-list");
  list.innerHTML = "";
  const order = ["group-07", "group-09", "group-03"]; // AI's suggested order, highest priority first
  order.forEach((gid) => {
    const g = groupById(gid);
    const suggestion = AI_QUEUE_SUGGESTION[gid];
    const card = document.createElement("button");
    card.type = "button";
    card.className = "case-card " + GROUP_TONE[gid];
    card.innerHTML = `
      <div class="case-body">
        <div class="case-top">
          <span class="case-name">${esc(g.name)} — Checkpoint 1 (Cài đặt môi trường)</span>
          <span class="pill ${PRIORITY_CLASS[suggestion.priority]}">Ưu tiên đề xuất: ${esc(suggestion.priority)}</span>
        </div>
        ${chipsHTML(g)}
        ${proseHTML(suggestion.reason, { cls: "case-reason", bulletCls: "bullets bullets-md" })}
      </div>`;
    card.addEventListener("click", () => openCase(gid));
    list.appendChild(card);
  });
}

function openCase(groupId) {
  bOpenCaseGroupId = groupId;
  bMoreEvidenceShown = false;
  const g = groupById(groupId);
  const ev = EVIDENCE_BY_GROUP[groupId];
  const suggestion = AI_QUEUE_SUGGESTION[groupId];

  document.getElementById("b-case-group-name").textContent = `${g.name} (${g.members.join(", ")})`;
  document.getElementById("b-priority-select").value = suggestion.priority;
  document.getElementById("b-evidence-panel").innerHTML = evidenceHTML(groupId, "Evidence AI dùng để xếp hạng");

  document.getElementById("b-more-evidence-panel").classList.add("hidden");
  document.getElementById("b-more-evidence-panel").innerHTML = "";
  document.getElementById("b-more-evidence-btn").disabled = !ev.moreEvidence;
  document.getElementById("b-more-evidence-btn").classList.toggle("hidden", !ev.moreEvidence);

  document.getElementById("b-state-queue").classList.add("hidden");
  document.getElementById("b-state-case").classList.remove("hidden");
}

document.getElementById("b-more-evidence-btn").addEventListener("click", () => {
  const ev = EVIDENCE_BY_GROUP[bOpenCaseGroupId];
  const panel = document.getElementById("b-more-evidence-panel");
  if (!ev.moreEvidence) return;
  bMoreEvidenceShown = !bMoreEvidenceShown;
  if (bMoreEvidenceShown) {
    panel.innerHTML = ev.moreEvidence
      .map((m) => `<div><strong>${esc(m.label)}:</strong> ${esc(m.value)}</div>`)
      .join("");
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
});

["b-support-now", "b-schedule", "b-dismiss"].forEach((id) => {
  document.getElementById(id).addEventListener("click", (e) => {
    recordOptionBResult(e.currentTarget.dataset.result);
  });
});

function recordOptionBResult(result) {
  const g = groupById(bOpenCaseGroupId);
  const chosenPriority = document.getElementById("b-priority-select").value;
  const suggestion = AI_QUEUE_SUGGESTION[bOpenCaseGroupId];
  const priorityChanged = chosenPriority !== suggestion.priority;

  const summary = document.getElementById("b-result-summary");
  summary.className = "result" + (result === "dismiss" ? " dismiss" : "");

  let approvalNote = "";
  if (result === "dismiss") {
    approvalNote = "Case bị dismiss — AI sẽ không tạo bước hỗ trợ nào và không liên hệ learner.";
  } else {
    approvalNote = `Coach approve → bước hỗ trợ tiếp theo (${RESULT_LABELS[result]}) được tạo. AI chỉ được phép hành động sau bước approve này.`;
  }

  summary.innerHTML = `
    <span class="result-title">${esc(RESULT_LABELS[result])}</span>
    <p>${esc(g.name)}: mức ưu tiên coach chốt là "<strong>${esc(chosenPriority)}</strong>"
    ${priorityChanged ? `(đã chỉnh từ đề xuất ban đầu của AI là "${esc(suggestion.priority)}")` : "(giữ nguyên đề xuất của AI)"}.
    ${esc(approvalNote)}</p>
  `;

  document.getElementById("b-state-case").classList.add("hidden");
  document.getElementById("b-state-result").classList.remove("hidden");
}

document.getElementById("b-back-to-queue").addEventListener("click", () => {
  document.getElementById("b-state-case").classList.add("hidden");
  document.getElementById("b-state-queue").classList.remove("hidden");
});

document.getElementById("b-result-back").addEventListener("click", () => {
  document.getElementById("b-state-result").classList.add("hidden");
  document.getElementById("b-state-case").classList.remove("hidden");
});

function resetOptionB() {
  bOpenCaseGroupId = null;
  bMoreEvidenceShown = false;
  document.getElementById("b-state-result").classList.add("hidden");
  document.getElementById("b-state-case").classList.add("hidden");
  document.getElementById("b-state-queue").classList.remove("hidden");
  renderQueue();
}

// =====================================================================
// OPTION C — Proactive Support Agent with Guardrails
// =====================================================================
// Khác A/B: AI có thể đã Act (tự gửi check-in rủi ro thấp, có thể undo)
// hoặc tự quyết định Ask/chuyển thẳng coach — TRƯỚC KHI coach mở tab này.
// Coach chỉ xem lại, can thiệp (undo/override), đặt policy và đóng case.

let cActivityLog = [];
let cActivityCounter = 100; // id cho entry mới coach/tự thêm trong phiên demo
let cCaseState = {}; // groupId -> "sent" | "undone" | "learner_yes" | "learner_no" | "escalated" | "monitored" | "resolved"
let cOptOutGroups = new Set();
let cOpenCaseGroupId = null;

function renderPolicyPanel() {
  document.getElementById("c-policy-act-rule").innerHTML = ruleBulletsHTML(POLICY_C_BULLETS.autoAct);
  document.getElementById("c-policy-ask-rule").innerHTML = ruleBulletsHTML(POLICY_C_BULLETS.alwaysEscalate);
  document.getElementById("c-guardrail-list").innerHTML = POLICY_C.guardrails
    .map((g) => `<li>${esc(g)}</li>`)
    .join("");
}

function addActivityEntry(type, groupId, summary) {
  cActivityCounter += 1;
  cActivityLog.unshift({ id: cActivityCounter, time: "vừa xong", groupId, type, summary });
}

function renderActivityFeed() {
  const list = document.getElementById("c-activity-list");
  list.innerHTML = "";
  cActivityLog.forEach((entry) => {
    const g = entry.groupId ? groupById(entry.groupId) : null;
    const item = document.createElement("div");
    item.className = "tl-item " + (ACTIVITY_TONE[entry.type] || "tone-calm");
    item.innerHTML = `
      <div class="tl-marker" aria-hidden="true"></div>
      <div class="tl-body">
        <div class="tl-top">
          <span class="tl-tag">${esc(ACTIVITY_TYPE_LABEL[entry.type] || entry.type)}</span>
          <span class="tl-time">${esc(entry.time)}</span>
        </div>
        <p class="tl-summary">${esc(entry.summary)}</p>
      </div>`;
    if (g) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn tl-link";
      btn.textContent = `Xem chi tiết — ${g.name}`;
      btn.addEventListener("click", () => openCaseC(entry.groupId));
      item.querySelector(".tl-body").appendChild(btn);
    }
    list.appendChild(item);
  });
}

document.getElementById("c-pause-toggle").addEventListener("change", (e) => {
  addActivityEntry(
    "policy_change",
    null,
    e.target.checked
      ? "Coach tạm dừng toàn bộ hành động tự động của AI (policy-level stop). Các case đang mở vẫn giữ nguyên, nhưng AI sẽ không tự Act với case mới cho tới khi được bật lại."
      : "Coach bật lại hành động tự động của AI."
  );
  renderActivityFeed();
});

function openCaseC(groupId) {
  cOpenCaseGroupId = groupId;
  renderCaseC(groupId);
  document.getElementById("c-state-context").classList.add("hidden");
  document.getElementById("c-state-case").classList.remove("hidden");
}

function renderCaseC(groupId) {
  const g = groupById(groupId);
  document.getElementById("c-case-group-name").textContent = `${g.name} (${g.members.join(", ")})`;
  document.getElementById("c-optout-toggle").checked = cOptOutGroups.has(groupId);
  document.getElementById("c-evidence-panel").innerHTML = evidenceHTML(groupId, "Evidence AI dùng để quyết định");

  const actionBox = document.getElementById("c-ai-action-box");
  const simulateBlock = document.getElementById("c-simulate-block");
  const postSimNote = document.getElementById("c-post-sim-note");
  const manualActions = document.getElementById("c-manual-actions");
  const railHint = document.getElementById("c-rail-hint");

  simulateBlock.classList.add("hidden");
  postSimNote.classList.add("hidden");
  postSimNote.innerHTML = "";
  manualActions.classList.add("hidden");
  railHint.textContent = "";
  actionBox.innerHTML = "";
  actionBox.className = "";

  const state = cCaseState[groupId];

  if (groupId === "group-07") {
    if (state === "sent" || state === "learner_yes" || state === "learner_no") {
      actionBox.className = "ai-action tone-success";
      actionBox.innerHTML = `
        <span class="overline">AI đã Act — tự động gửi check-in lúc 10:41</span>
        <div class="checkin">"${esc(CHECKIN_MESSAGE["group-07"])}"</div>
        <div class="ai-meta">
          <span>Độ tin cậy: <strong>Trung bình</strong></span>
          <span>Rủi ro: <strong>Thấp</strong> (một câu hỏi trung lập, có thể thu hồi, không ảnh hưởng điểm/đánh giá).</span>
        </div>
        <div class="rule-match">
          <span class="overline">Quy tắc policy khớp</span>
          ${ruleBulletsHTML(POLICY_C_BULLETS.autoAct)}
        </div>
        ${state === "sent" ? `<button type="button" class="btn btn-danger mt-12" id="c-undo-btn">Thu hồi check-in (undo)</button>` : ""}
      `;
      if (state === "sent") {
        document.getElementById("c-undo-btn").addEventListener("click", () => {
          cCaseState["group-07"] = "undone";
          addActivityEntry("undo", "group-07", `Coach đã thu hồi check-in gửi tới ${g.name} trước khi có phản hồi.`);
          renderCaseC("group-07");
        });
        simulateBlock.classList.remove("hidden");
        railHint.textContent = "Check-in đang chờ phản hồi. Bạn vẫn có thể quyết định ngay, hoặc thu hồi trước.";
        manualActions.classList.remove("hidden");
      } else if (state === "learner_yes") {
        postSimNote.classList.remove("hidden");
        postSimNote.innerHTML = `<strong>Learner đã phản hồi:</strong> xác nhận cần trợ giúp. Case được chuyển cho coach quyết định bước tiếp theo — AI không tự xử lý thay.`;
        manualActions.classList.remove("hidden");
      } else if (state === "learner_no") {
        postSimNote.classList.remove("hidden");
        postSimNote.innerHTML = `<strong>Learner đã phản hồi:</strong> không cần hỗ trợ thêm. AI ghi nhận lý do tối thiểu và không làm phiền thêm trong phiên này — nhưng case vẫn mở, coach vẫn có thể can thiệp nếu không đồng ý.`;
        manualActions.classList.remove("hidden");
      }
    } else if (state === "undone") {
      actionBox.className = "ai-action tone-calm";
      actionBox.innerHTML = `
        <span class="overline">Đã thu hồi (undo)</span>
        <p>Coach đã thu hồi check-in trước khi learner phản hồi. Case chuyển về xử lý thủ công, giống cơ chế Option A/B.</p>`;
      manualActions.classList.remove("hidden");
    } else if (state === "resolved") {
      actionBox.className = "ai-action tone-success";
      actionBox.innerHTML = `
        <span class="overline">Case đã được coach đóng</span>
        <p>Xem lại quyết định ở bước 3, hoặc quay lại nhật ký.</p>`;
      railHint.textContent = "Case này đã đóng.";
    }
  } else if (groupId === "group-09") {
    actionBox.className = "ai-action tone-warning";
    actionBox.innerHTML = `
      <span class="overline">AI Ask — không tự trả lời</span>
      ${proseHTML(
        `${g.name} đã chủ động gửi yêu cầu trợ giúp lúc 10:38. Theo guardrail, một yêu cầu trực tiếp từ learner luôn được coi là "ảnh hưởng lớn" — AI không tự soạn hay gửi phản hồi thay, mà chuyển thẳng cho coach xử lý.`,
        { bulletCls: "bullets bullets-md" }
      )}
      <div class="rule-match">
        <span class="overline">Quy tắc policy khớp</span>
        ${ruleBulletsHTML(POLICY_C_BULLETS.alwaysEscalate)}
      </div>`;
    if (state !== "resolved") manualActions.classList.remove("hidden");
    else railHint.textContent = "Case này đã đóng.";
  } else if (groupId === "group-03") {
    actionBox.className = "ai-action tone-calm";
    actionBox.innerHTML = `
      <span class="overline">Don't Act — chỉ theo dõi</span>
      ${proseHTML(
        `Các tín hiệu của ${g.name} nằm trong ngưỡng bình thường so với các nhóm đã qua checkpoint, nên AI không tạo hành động hay check-in nào. Coach vẫn có thể can thiệp thủ công nếu có lý do khác mà AI không thấy được (ví dụ quan sát trực tiếp tại lớp).`,
        { bulletCls: "bullets bullets-md" }
      )}`;
    if (state !== "resolved") manualActions.classList.remove("hidden");
    else railHint.textContent = "Case này đã đóng.";
  }
}

["c-sim-yes", "c-sim-no"].forEach((id) => {
  document.getElementById(id).addEventListener("click", () => {
    if (cOpenCaseGroupId !== "group-07" || cCaseState["group-07"] !== "sent") return;
    const g = groupById("group-07");
    if (id === "c-sim-yes") {
      cCaseState["group-07"] = "learner_yes";
      addActivityEntry("coach_decision", "group-07", `[Mô phỏng] ${g.name} phản hồi check-in: cần trợ giúp. Case chuyển cho coach.`);
    } else {
      cCaseState["group-07"] = "learner_no";
      addActivityEntry("coach_decision", "group-07", `[Mô phỏng] ${g.name} phản hồi check-in: không cần hỗ trợ thêm.`);
    }
    renderCaseC("group-07");
  });
});

document.getElementById("c-optout-toggle").addEventListener("change", (e) => {
  if (!cOpenCaseGroupId) return;
  const g = groupById(cOpenCaseGroupId);
  if (e.target.checked) {
    cOptOutGroups.add(cOpenCaseGroupId);
    addActivityEntry("policy_change", cOpenCaseGroupId, `Coach tắt hành động/theo dõi chủ động của AI cho ${g.name}.`);
  } else {
    cOptOutGroups.delete(cOpenCaseGroupId);
    addActivityEntry("policy_change", cOpenCaseGroupId, `Coach bật lại theo dõi chủ động của AI cho ${g.name}.`);
  }
});

["c-support-now", "c-schedule", "c-dismiss"].forEach((id) => {
  document.getElementById(id).addEventListener("click", (e) => {
    recordOptionCResult(e.currentTarget.dataset.result);
  });
});

function recordOptionCResult(result) {
  const groupId = cOpenCaseGroupId;
  const g = groupById(groupId);
  const priorState = cCaseState[groupId];
  cCaseState[groupId] = "resolved";

  let pathNote = "";
  if (groupId === "group-07") {
    if (priorState === "learner_yes") pathNote = "sau khi AI tự gửi check-in và learner xác nhận cần trợ giúp";
    else if (priorState === "learner_no") pathNote = "sau khi learner phản hồi không cần hỗ trợ nhưng coach vẫn chọn can thiệp";
    else if (priorState === "undone") pathNote = "sau khi coach thu hồi check-in AI đã tự gửi";
    else pathNote = "trong khi check-in AI vẫn đang chờ phản hồi";
  } else if (groupId === "group-09") {
    pathNote = "sau khi AI Ask/chuyển case vì learner đã chủ động yêu cầu trợ giúp, không phải AI tự trả lời";
  } else {
    pathNote = "dù AI đánh giá tín hiệu bình thường và không chủ động hành động (coach can thiệp thủ công)";
  }

  addActivityEntry("coach_decision", groupId, `Coach chọn "${RESULT_LABELS[result]}" cho ${g.name} (${pathNote}).`);

  const summary = document.getElementById("c-result-summary");
  summary.className = "result" + (result === "dismiss" ? " dismiss" : "");
  summary.innerHTML = `
    <span class="result-title">${esc(RESULT_LABELS[result])}</span>
    <p>Coach đã chọn "<strong>${esc(RESULT_LABELS[result])}</strong>" cho ${esc(g.name)}, ${esc(pathNote)}.
    Toàn bộ hành động của AI và quyết định của coach cho case này đã được ghi vào nhật ký (audit log).</p>
  `;
  document.getElementById("c-state-case").classList.add("hidden");
  document.getElementById("c-state-result").classList.remove("hidden");
}

document.getElementById("c-back-to-context").addEventListener("click", () => {
  document.getElementById("c-state-case").classList.add("hidden");
  document.getElementById("c-state-context").classList.remove("hidden");
  renderActivityFeed();
});

document.getElementById("c-result-back").addEventListener("click", () => {
  document.getElementById("c-state-result").classList.add("hidden");
  document.getElementById("c-state-case").classList.remove("hidden");
  renderCaseC(cOpenCaseGroupId);
});

function resetOptionC() {
  cActivityLog = getInitialProactiveLog();
  cActivityCounter = 100;
  cCaseState = { "group-07": "sent", "group-09": "escalated", "group-03": "monitored" };
  cOptOutGroups = new Set();
  cOpenCaseGroupId = null;
  document.getElementById("c-pause-toggle").checked = false;
  document.getElementById("c-state-result").classList.add("hidden");
  document.getElementById("c-state-case").classList.add("hidden");
  document.getElementById("c-state-context").classList.remove("hidden");
  renderPolicyPanel();
  renderSituationStripC();
  renderActivityFeed();
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
});

// ---------- Init ----------
initTheme();
renderClassBanner();
renderCheckpointList();
renderQueue();
resetOptionC();
switchTab("A");
