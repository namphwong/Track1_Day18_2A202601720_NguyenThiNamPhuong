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
  document.getElementById("panel-A").classList.toggle("hidden", tab !== "A");
  document.getElementById("panel-B").classList.toggle("hidden", tab !== "B");
  document.getElementById("tab-btn-A").classList.toggle("active", tab === "A");
  document.getElementById("tab-btn-B").classList.toggle("active", tab === "B");
}

document.getElementById("tab-btn-A").addEventListener("click", () => switchTab("A"));
document.getElementById("tab-btn-B").addEventListener("click", () => switchTab("B"));

document.getElementById("global-reset").addEventListener("click", () => {
  resetOptionA();
  resetOptionB();
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

// ---------- Init ----------
renderClassBanner();
renderCheckpointList();
renderQueue();
switchTab("A");
