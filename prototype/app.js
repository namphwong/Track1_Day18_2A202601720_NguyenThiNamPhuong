// app.js — Logic cho Option A (Coach Query) và Option B (AI Review Queue).
// Không gọi model AI thật. Toàn bộ "phân tích" đọc từ data.js (canned fixture).

const PRIORITY_CLASS = { "Cao": "priority-high", "Trung bình": "priority-mid", "Thấp": "priority-low" };

// ---------- Shared header ----------
function renderClassBanner() {
  document.getElementById("class-name").textContent = CLASS_CONTEXT.className;
  document.getElementById("class-task").textContent = " — " + CLASS_CONTEXT.task;
  document.getElementById("class-size").textContent =
    `${CLASS_CONTEXT.totalLearners} learner · ${CLASS_CONTEXT.totalGroups} nhóm`;
  document.getElementById("class-time").textContent =
    `Bắt đầu ${CLASS_CONTEXT.sessionStarted} · Hiện tại ${CLASS_CONTEXT.now}`;
}

// ---------- Tabs ----------
function switchTab(tab) {
  ["A", "B", "C"].forEach((t) => {
    document.getElementById("panel-" + t).classList.toggle("hidden", tab !== t);
    document.getElementById("tab-btn-" + t).classList.toggle("active", tab === t);
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
    const card = document.createElement("div");
    card.className = "checkpoint-card" + (aSelectedCheckpoint === cp.id ? " selected" : "");
    card.innerHTML = `
      <span class="cp-name">${cp.name}</span>
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

  if (groups.length === 0) {
    list.innerHTML = `<p class="hint-text">Không có nhóm nào đang dừng lâu bất thường tại checkpoint này ngay lúc này.</p>`;
  } else {
    groups
      .slice()
      .sort((a, b) => b.stalledMinutes - a.stalledMinutes)
      .forEach((g) => {
        const card = document.createElement("div");
        card.className = "group-card" + (aSelectedGroup === g.id ? " selected" : "");
        card.innerHTML = `
          <div class="group-card-top">
            <span>${g.name}</span>
            <span class="badge badge-stalled">dừng ${g.stalledMinutes} phút</span>
          </div>
          <div class="group-card-sub">
            Yêu cầu trợ giúp: ${g.helpRequested ? "Đã gửi" : "Chưa gửi"} · Mở lại tài liệu: ${g.docsReopened} lần
          </div>
        `;
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
  }
}

function renderOptionAEvidence(group) {
  const ev = EVIDENCE_BY_GROUP[group.id];
  const panel = document.getElementById("a-evidence-panel");
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <h3>Evidence — ${group.name} (${group.members.join(", ")})</h3>
    ${ev.signals
      .map(
        (s) => `
      <div class="evidence-signal">
        <span class="evidence-signal-label">${s.label}
          <span class="evidence-signal-note">${s.note}</span>
        </span>
        <span class="evidence-signal-value">${s.value}</span>
      </div>`
      )
      .join("")}
    <div class="uncertainty-box">
      <strong>Mức độ chắc chắn của evidence</strong>
      ${ev.uncertainty}
    </div>
    <div class="case-actions">
      <button class="primary-btn" data-result="support_now">Hỗ trợ ngay</button>
      <button class="secondary-btn" data-result="schedule">Lên lịch / đưa vào queue</button>
      <button class="dismiss-btn" data-result="dismiss">Bỏ qua — chưa đủ evidence</button>
    </div>
  `;
  panel.querySelectorAll("[data-result]").forEach((btn) => {
    btn.addEventListener("click", () => recordOptionAResult(group, btn.dataset.result));
  });
}

function recordOptionAResult(group, result) {
  const summary = document.getElementById("a-result-summary");
  summary.className = "result-summary" + (result === "dismiss" ? " dismiss" : "");
  summary.innerHTML = `
    <strong>${RESULT_LABELS[result]}</strong>
    Coach đã chọn "<strong>${RESULT_LABELS[result]}</strong>" cho ${group.name} sau khi tự yêu cầu AI kiểm tra
    Checkpoint 1 — Cài đặt môi trường và đọc evidence + mức độ chắc chắn.
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
  document.getElementById("a-evidence-panel").classList.add("hidden");
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
  const list = document.getElementById("b-queue-list");
  list.innerHTML = "";
  const order = ["group-07", "group-09", "group-03"]; // AI's suggested order, highest priority first
  order.forEach((gid) => {
    const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === gid);
    const suggestion = AI_QUEUE_SUGGESTION[gid];
    const card = document.createElement("div");
    card.className = "queue-card";
    card.innerHTML = `
      <div class="queue-card-top">
        <span class="queue-group-name">${g.name} — Checkpoint 1 (Cài đặt môi trường)</span>
        <span class="priority-tag ${PRIORITY_CLASS[suggestion.priority]}">Ưu tiên đề xuất: ${suggestion.priority}</span>
      </div>
      <div class="queue-card-reason">${suggestion.reason}</div>
    `;
    card.addEventListener("click", () => openCase(gid));
    list.appendChild(card);
  });
}

function openCase(groupId) {
  bOpenCaseGroupId = groupId;
  bMoreEvidenceShown = false;
  const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === groupId);
  const ev = EVIDENCE_BY_GROUP[groupId];
  const suggestion = AI_QUEUE_SUGGESTION[groupId];

  document.getElementById("b-case-group-name").textContent = `${g.name} (${g.members.join(", ")})`;
  document.getElementById("b-priority-select").value = suggestion.priority;

  const panel = document.getElementById("b-evidence-panel");
  panel.innerHTML = `
    <h3>Evidence AI dùng để xếp hạng</h3>
    ${ev.signals
      .map(
        (s) => `
      <div class="evidence-signal">
        <span class="evidence-signal-label">${s.label}
          <span class="evidence-signal-note">${s.note}</span>
        </span>
        <span class="evidence-signal-value">${s.value}</span>
      </div>`
      )
      .join("")}
    <div class="uncertainty-box">
      <strong>Mức độ chắc chắn của evidence</strong>
      ${ev.uncertainty}
    </div>
  `;

  document.getElementById("b-more-evidence-panel").classList.add("hidden");
  document.getElementById("b-more-evidence-panel").innerHTML = "";
  document.getElementById("b-more-evidence-btn").disabled = !ev.moreEvidence;
  document.getElementById("b-more-evidence-btn").style.display = ev.moreEvidence ? "inline-block" : "none";

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
      .map((m) => `<div><strong>${m.label}:</strong> ${m.value}</div>`)
      .join("");
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
});

["b-support-now", "b-schedule", "b-dismiss"].forEach((id) => {
  document.getElementById(id).addEventListener("click", (e) => {
    recordOptionBResult(e.target.dataset.result);
  });
});

function recordOptionBResult(result) {
  const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === bOpenCaseGroupId);
  const chosenPriority = document.getElementById("b-priority-select").value;
  const suggestion = AI_QUEUE_SUGGESTION[bOpenCaseGroupId];
  const priorityChanged = chosenPriority !== suggestion.priority;

  const summary = document.getElementById("b-result-summary");
  summary.className = "result-summary" + (result === "dismiss" ? " dismiss" : "");

  let approvalNote = "";
  if (result === "dismiss") {
    approvalNote = "Case bị dismiss — AI sẽ không tạo bước hỗ trợ nào và không liên hệ learner.";
  } else {
    approvalNote = `Coach approve → bước hỗ trợ tiếp theo (${RESULT_LABELS[result]}) được tạo. AI chỉ được phép hành động sau bước approve này.`;
  }

  summary.innerHTML = `
    <strong>${RESULT_LABELS[result]}</strong>
    ${g.name}: mức ưu tiên coach chốt là "<strong>${chosenPriority}</strong>"
    ${priorityChanged ? `(đã chỉnh từ đề xuất ban đầu của AI là "${suggestion.priority}")` : "(giữ nguyên đề xuất của AI)"}.
    ${approvalNote}
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
  document.getElementById("c-policy-act-rule").textContent = POLICY_C.autoActRule;
  document.getElementById("c-policy-ask-rule").textContent = POLICY_C.alwaysEscalateRule;
  const list = document.getElementById("c-guardrail-list");
  list.innerHTML = POLICY_C.guardrails.map((g) => `<li>${g}</li>`).join("");
}

function addActivityEntry(type, groupId, summary) {
  cActivityCounter += 1;
  cActivityLog.unshift({ id: cActivityCounter, time: "vừa xong", groupId, type, summary });
}

function renderActivityFeed() {
  const list = document.getElementById("c-activity-list");
  list.innerHTML = "";
  cActivityLog.forEach((entry) => {
    const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === entry.groupId);
    const item = document.createElement("div");
    item.className = "activity-item activity-" + entry.type;
    item.innerHTML = `
      <div class="activity-top">
        <span class="activity-tag">${ACTIVITY_TYPE_LABEL[entry.type] || entry.type}</span>
        <span class="activity-time">${entry.time}</span>
      </div>
      <div class="activity-summary">${entry.summary}</div>
    `;
    if (g) {
      const btn = document.createElement("button");
      btn.className = "link-btn";
      btn.textContent = `Xem chi tiết — ${g.name} →`;
      btn.addEventListener("click", () => openCaseC(entry.groupId));
      item.appendChild(btn);
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

function renderEvidenceBlockC(groupId) {
  const ev = EVIDENCE_BY_GROUP[groupId];
  return `
    <h3>Evidence AI dùng để quyết định</h3>
    ${ev.signals
      .map(
        (s) => `
      <div class="evidence-signal">
        <span class="evidence-signal-label">${s.label}
          <span class="evidence-signal-note">${s.note}</span>
        </span>
        <span class="evidence-signal-value">${s.value}</span>
      </div>`
      )
      .join("")}
    <div class="uncertainty-box">
      <strong>Mức độ chắc chắn của evidence</strong>
      ${ev.uncertainty}
    </div>
  `;
}

function renderCaseC(groupId) {
  const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === groupId);
  document.getElementById("c-case-group-name").textContent = `${g.name} (${g.members.join(", ")})`;
  document.getElementById("c-optout-toggle").checked = cOptOutGroups.has(groupId);
  document.getElementById("c-evidence-panel").innerHTML = renderEvidenceBlockC(groupId);

  const actionBox = document.getElementById("c-ai-action-box");
  const simulateBlock = document.getElementById("c-simulate-block");
  const postSimNote = document.getElementById("c-post-sim-note");
  const manualActions = document.getElementById("c-manual-actions");

  simulateBlock.classList.add("hidden");
  postSimNote.classList.add("hidden");
  postSimNote.innerHTML = "";
  manualActions.classList.add("hidden");
  actionBox.innerHTML = "";

  const state = cCaseState[groupId];

  if (groupId === "group-07") {
    if (state === "sent" || state === "learner_yes" || state === "learner_no") {
      actionBox.className = "ai-action-box act";
      actionBox.innerHTML = `
        <div class="ai-action-tag">AI đã Act — tự động gửi check-in lúc 10:41</div>
        <div class="checkin-message">"${CHECKIN_MESSAGE["group-07"]}"</div>
        <div class="ai-action-meta">Độ tin cậy: Trung bình · Rủi ro: Thấp (một câu hỏi trung lập, có thể thu hồi, không ảnh hưởng điểm/đánh giá).<br>Quy tắc policy khớp: "${POLICY_C.autoActRule}"</div>
        ${state === "sent" ? `<button class="undo-btn" id="c-undo-btn">↺ Thu hồi check-in (undo)</button>` : ""}
      `;
      if (state === "sent") {
        document.getElementById("c-undo-btn").addEventListener("click", () => {
          cCaseState["group-07"] = "undone";
          addActivityEntry("undo", "group-07", `Coach đã thu hồi check-in gửi tới ${g.name} trước khi có phản hồi.`);
          renderCaseC("group-07");
        });
        simulateBlock.classList.remove("hidden");
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
      actionBox.className = "ai-action-box undone";
      actionBox.innerHTML = `
        <div class="ai-action-tag">Đã thu hồi (undo)</div>
        <div>Coach đã thu hồi check-in trước khi learner phản hồi. Case chuyển về xử lý thủ công, giống cơ chế Option A/B.</div>
      `;
      manualActions.classList.remove("hidden");
    } else if (state === "resolved") {
      actionBox.className = "ai-action-box act";
      actionBox.innerHTML = `<div class="ai-action-tag">Case đã được coach đóng</div><div>Xem lại quyết định ở bước 3, hoặc quay lại nhật ký.</div>`;
    }
  } else if (groupId === "group-09") {
    actionBox.className = "ai-action-box ask";
    actionBox.innerHTML = `
      <div class="ai-action-tag">AI Ask — không tự trả lời</div>
      <div>${g.name} đã chủ động gửi yêu cầu trợ giúp lúc 10:38. Theo guardrail, một yêu cầu trực tiếp từ learner luôn được coi là "ảnh hưởng lớn" — AI không tự soạn hay gửi phản hồi thay, mà chuyển thẳng cho coach xử lý.</div>
      <div class="ai-action-meta">Quy tắc policy khớp: "${POLICY_C.alwaysEscalateRule}"</div>
    `;
    if (state !== "resolved") manualActions.classList.remove("hidden");
  } else if (groupId === "group-03") {
    actionBox.className = "ai-action-box monitor";
    actionBox.innerHTML = `
      <div class="ai-action-tag">Don't Act — chỉ theo dõi</div>
      <div>Các tín hiệu của ${g.name} nằm trong ngưỡng bình thường so với các nhóm đã qua checkpoint, nên AI không tạo hành động hay check-in nào. Coach vẫn có thể can thiệp thủ công nếu có lý do khác mà AI không thấy được (ví dụ quan sát trực tiếp tại lớp).</div>
    `;
    if (state !== "resolved") manualActions.classList.remove("hidden");
  }
}

["c-sim-yes", "c-sim-no"].forEach((id) => {
  document.getElementById(id).addEventListener("click", () => {
    if (cOpenCaseGroupId !== "group-07" || cCaseState["group-07"] !== "sent") return;
    const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === "group-07");
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
  const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === cOpenCaseGroupId);
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
    recordOptionCResult(e.target.dataset.result);
  });
});

function recordOptionCResult(result) {
  const groupId = cOpenCaseGroupId;
  const g = GROUPS_AT_INSTALL_CHECKPOINT.find((x) => x.id === groupId);
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
  summary.className = "result-summary" + (result === "dismiss" ? " dismiss" : "");
  summary.innerHTML = `
    <strong>${RESULT_LABELS[result]}</strong>
    Coach đã chọn "<strong>${RESULT_LABELS[result]}</strong>" cho ${g.name}, ${pathNote}.
    Toàn bộ hành động của AI và quyết định của coach cho case này đã được ghi vào nhật ký (audit log).
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
  renderActivityFeed();
}

// ---------- Init ----------
renderClassBanner();
renderCheckpointList();
renderQueue();
resetOptionC();
switchTab("A");
