"use strict";

const STORAGE_KEY = "fieldops-deployment-studio-v1";

const scenarios = {
  edgeVision: {
    name: "Edge computer vision",
    checklist: [
      {
        id: "siteContact",
        label: "A named customer site lead is available during installation.",
        note: "Confirms access, decisions, and escalation ownership.",
        critical: true
      },
      {
        id: "network",
        label: "Network access, firewall rules, and bandwidth are confirmed.",
        note: "Validate the actual production network, not a guest connection.",
        critical: true
      },
      {
        id: "power",
        label: "Power, mounting, ventilation, and physical access are ready.",
        note: "Check the installation position and safe cable routing.",
        critical: true
      },
      {
        id: "data",
        label: "Camera views and data handling have customer approval.",
        note: "Confirm purpose, retention, access, and any masking requirements.",
        critical: true
      },
      {
        id: "baseline",
        label: "A pre-deployment baseline and success measure are recorded.",
        note: "Agree how the team will judge the pilot's performance.",
        critical: false
      },
      {
        id: "rollback",
        label: "A tested rollback path and system owner are identified.",
        note: "Know how to restore normal operations if the pilot fails.",
        critical: true
      },
      {
        id: "training",
        label: "Operators have a short training and support handoff scheduled.",
        note: "Cover normal use, common faults, and who to contact.",
        critical: false
      }
    ],
    risks: [
      {
        id: "networkOutage",
        title: "Network or connectivity interruption",
        detail: "A link failure could interrupt monitoring or create blind spots.",
        mitigation: "Test reconnect behavior and define a manual fallback."
      },
      {
        id: "falseAlerts",
        title: "False alerts disrupt site operations",
        detail: "Poorly tuned detections can create alert fatigue.",
        mitigation: "Run a shadow-mode trial and agree alert thresholds."
      },
      {
        id: "dataExposure",
        title: "Unintended capture or access to sensitive data",
        detail: "Camera placement or permissions may exceed the approved scope.",
        mitigation: "Limit the field of view, access, and retention to the approved purpose."
      }
    ]
  },
  supportAgent: {
    name: "Customer support AI agent",
    checklist: [
      {
        id: "siteContact",
        label: "A named customer product owner is available for decisions.",
        note: "Confirms scope, acceptance criteria, and escalation ownership.",
        critical: true
      },
      {
        id: "network",
        label: "Required integrations, credentials, and network access are tested.",
        note: "Use approved test credentials and verify least-privilege access.",
        critical: true
      },
      {
        id: "power",
        label: "Service limits, monitoring, and incident contacts are documented.",
        note: "Know who monitors availability and responds to failures.",
        critical: false
      },
      {
        id: "data",
        label: "Allowed data sources and sensitive-data handling are approved.",
        note: "Confirm what the agent may see, retain, and disclose.",
        critical: true
      },
      {
        id: "baseline",
        label: "A test set and human-reviewed quality baseline are prepared.",
        note: "Measure useful answers, incorrect answers, and escalation behavior.",
        critical: false
      },
      {
        id: "rollback",
        label: "Human handoff and a tested disable or rollback path are ready.",
        note: "Users need a clear route to a person when the agent is uncertain.",
        critical: true
      },
      {
        id: "training",
        label: "Support staff understand the agent's limits and escalation flow.",
        note: "Train the people who will review or receive escalated cases.",
        critical: false
      }
    ],
    risks: [
      {
        id: "incorrectAnswers",
        title: "Incorrect or unsupported answers",
        detail: "An agent may present a plausible answer that is not grounded.",
        mitigation: "Constrain sources, test edge cases, and provide human escalation."
      },
      {
        id: "dataExposure",
        title: "Sensitive customer data is exposed",
        detail: "A prompt, integration, or log may reveal information unexpectedly.",
        mitigation: "Minimize data, restrict access, and test redaction and retention."
      },
      {
        id: "handoffFailure",
        title: "Human escalation does not reach the right team",
        detail: "A poor handoff can leave a customer without support.",
        mitigation: "Test routing end to end and publish a fallback contact."
      }
    ]
  },
  predictiveMaintenance: {
    name: "Predictive maintenance",
    checklist: [
      {
        id: "siteContact",
        label: "A named maintenance lead is available for operational decisions.",
        note: "Agree who evaluates alerts and authorizes maintenance action.",
        critical: true
      },
      {
        id: "network",
        label: "Sensor connectivity and data flow are verified at the equipment.",
        note: "Check coverage, timestamps, and data completeness under real conditions.",
        critical: true
      },
      {
        id: "power",
        label: "Sensors are safely installed and equipment access is approved.",
        note: "Follow site safety procedures and confirm installation permissions.",
        critical: true
      },
      {
        id: "data",
        label: "Data ownership, permitted use, and access controls are agreed.",
        note: "Confirm which operational data is collected and who can see it.",
        critical: true
      },
      {
        id: "baseline",
        label: "Historical performance and a measurable pilot baseline are available.",
        note: "Compare predictions with actual faults and maintenance records.",
        critical: false
      },
      {
        id: "rollback",
        label: "Existing maintenance procedures remain available as a fallback.",
        note: "Treat model output as an aid until the customer approves otherwise.",
        critical: true
      },
      {
        id: "training",
        label: "Technicians know how to interpret alerts and report feedback.",
        note: "Explain confidence, limitations, and the feedback loop.",
        critical: false
      }
    ],
    risks: [
      {
        id: "missedFault",
        title: "A real fault is missed",
        detail: "Incomplete signals or model limits may hide a developing problem.",
        mitigation: "Keep existing inspections and maintenance rules in place."
      },
      {
        id: "falseAlarm",
        title: "False alarms cause unnecessary maintenance",
        detail: "Poorly calibrated alerts can waste time or interrupt production.",
        mitigation: "Use a review period and tune thresholds with technicians."
      },
      {
        id: "sensorFailure",
        title: "Sensor or data pipeline failure goes unnoticed",
        detail: "Missing data may make predictions unreliable without an obvious warning.",
        mitigation: "Monitor data freshness and alert on sensor or pipeline outages."
      }
    ]
  }
};

const elements = {
  projectName: document.querySelector("#projectName"),
  siteName: document.querySelector("#siteName"),
  scenarioSelect: document.querySelector("#scenarioSelect"),
  checklist: document.querySelector("#checklist"),
  riskList: document.querySelector("#riskList"),
  readinessValue: document.querySelector("#readinessValue"),
  readinessProgress: document.querySelector("#readinessProgress"),
  readinessBar: document.querySelector("#readinessBar"),
  riskValue: document.querySelector("#riskValue"),
  riskBand: document.querySelector("#riskBand"),
  decisionPanel: document.querySelector(".decision-panel"),
  decisionIcon: document.querySelector("#decisionIcon"),
  decisionTitle: document.querySelector("#decisionTitle"),
  decisionText: document.querySelector("#decisionText"),
  decisionReadiness: document.querySelector("#decisionReadiness"),
  decisionExposure: document.querySelector("#decisionExposure"),
  briefing: document.querySelector("#briefing"),
  actionMessage: document.querySelector("#actionMessage"),
  copyBriefing: document.querySelector("#copyBriefing"),
  exportReport: document.querySelector("#exportReport"),
  resetAssessment: document.querySelector("#resetAssessment")
};

function createDefaultState() {
  return {
    projectName: "",
    siteName: "",
    scenarioId: "edgeVision",
    checks: {},
    riskValues: {}
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") {
      return createDefaultState();
    }

    return {
      ...createDefaultState(),
      ...saved,
      checks: saved.checks && typeof saved.checks === "object" ? saved.checks : {},
      riskValues: saved.riskValues && typeof saved.riskValues === "object"
        ? saved.riskValues
        : {}
    };
  } catch {
    return createDefaultState();
  }
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showMessage("Could not save in this browser.");
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };
    return replacements[character];
  });
}

function getCurrentScenario() {
  return scenarios[state.scenarioId] || scenarios.edgeVision;
}

function populateScenarioOptions() {
  elements.scenarioSelect.innerHTML = Object.entries(scenarios)
    .map(([id, scenario]) =>
      `<option value="${id}">${escapeHtml(scenario.name)}</option>`
    )
    .join("");
  elements.scenarioSelect.value = state.scenarioId;
}

function renderChecklist() {
  const scenario = getCurrentScenario();

  elements.checklist.innerHTML = scenario.checklist.map(item => {
    const checked = Boolean(state.checks[item.id]);
    const requiredMark = item.critical
      ? '<span class="critical-mark" aria-label="required gate">*</span>'
      : "";

    return `
      <label class="check-row">
        <input
          type="checkbox"
          data-check-id="${escapeHtml(item.id)}"
          ${checked ? "checked" : ""}
        >
        <span class="check-label">
          ${escapeHtml(item.label)} ${requiredMark}
          <small>${escapeHtml(item.note)}</small>
        </span>
      </label>
    `;
  }).join("");

  elements.checklist.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener("change", event => {
      const id = event.currentTarget.dataset.checkId;
      state.checks[id] = event.currentTarget.checked;
      saveState();
      updateDashboard();
    });
  });
}

function getRiskValues(risk) {
  const saved = state.riskValues[risk.id] || {};
  return {
    likelihood: clampNumber(saved.likelihood, 1, 5, 2),
    impact: clampNumber(saved.impact, 1, 5, 3)
  };
}

function clampNumber(value, minimum, maximum, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(maximum, Math.max(minimum, number));
}

function renderRisks() {
  const scenario = getCurrentScenario();

  elements.riskList.innerHTML = scenario.risks.map(risk => {
    const values = getRiskValues(risk);

    return `
      <article class="risk-card">
        <div class="risk-title-row">
          <h3 class="risk-title">${escapeHtml(risk.title)}</h3>
        </div>
        <p class="risk-detail">${escapeHtml(risk.detail)}</p>
        <div class="risk-controls">
          <div class="risk-control">
            <label for="${escapeHtml(risk.id)}-likelihood">
              Likelihood <output data-output="${escapeHtml(risk.id)}-likelihood">${values.likelihood}</output>
            </label>
            <input
              id="${escapeHtml(risk.id)}-likelihood"
              type="range"
              min="1"
              max="5"
              step="1"
              value="${values.likelihood}"
              data-risk-id="${escapeHtml(risk.id)}"
              data-risk-factor="likelihood"
              aria-label="${escapeHtml(risk.title)} likelihood, 1 to 5"
            >
          </div>
          <div class="risk-control">
            <label for="${escapeHtml(risk.id)}-impact">
              Impact <output data-output="${escapeHtml(risk.id)}-impact">${values.impact}</output>
            </label>
            <input
              id="${escapeHtml(risk.id)}-impact"
              type="range"
              min="1"
              max="5"
              step="1"
              value="${values.impact}"
              data-risk-id="${escapeHtml(risk.id)}"
              data-risk-factor="impact"
              aria-label="${escapeHtml(risk.title)} impact, 1 to 5"
            >
          </div>
        </div>
      </article>
    `;
  }).join("");

  elements.riskList.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener("input", event => {
      const slider = event.currentTarget;
      const riskId = slider.dataset.riskId;
      const factor = slider.dataset.riskFactor;
      const value = Number(slider.value);

      if (!state.riskValues[riskId]) {
        state.riskValues[riskId] = {};
      }
      state.riskValues[riskId][factor] = value;

      const output = elements.riskList.querySelector(
        `[data-output="${riskId}-${factor}"]`
      );
      if (output) {
        output.value = String(value);
        output.textContent = String(value);
      }

      saveState();
      updateDashboard();
    });
  });
}

function calculateReadiness() {
  const checklist = getCurrentScenario().checklist;
  const completed = checklist.filter(item => Boolean(state.checks[item.id])).length;
  return checklist.length ? Math.round((completed / checklist.length) * 100) : 0;
}

function calculateRisk() {
  const risks = getCurrentScenario().risks;
  if (!risks.length) {
    return 0;
  }

  const total = risks.reduce((sum, risk) => {
    const values = getRiskValues(risk);
    return sum + (values.likelihood * values.impact);
  }, 0);

  return Math.round((total / (risks.length * 25)) * 100);
}

function getDecision(readiness, exposure) {
  const scenario = getCurrentScenario();
  const missingGates = scenario.checklist.filter(
    item => item.critical && !state.checks[item.id]
  );

  if (missingGates.length > 0) {
    return {
      type: "stop",
      icon: "!",
      title: "Hold: complete the go-live gates",
      text: `${missingGates.length} critical readiness item${missingGates.length === 1 ? " is" : "s are"} still open. Resolve these before installation or live testing.`
    };
  }

  if (exposure >= 60) {
    return {
      type: "stop",
      icon: "!",
      title: "Hold: reduce high exposure risks",
      text: "The estimated risk exposure is high. Agree and test mitigations before proceeding."
    };
  }

  if (readiness < 80 || exposure >= 35) {
    return {
      type: "caution",
      icon: "↗",
      title: "Proceed only with a controlled pilot",
      text: "Close remaining actions, keep a human fallback available, and review results with the customer."
    };
  }

  return {
    type: "ready",
    icon: "✓",
    title: "Ready for a monitored deployment",
    text: "Readiness gates are complete and estimated exposure is manageable. Keep rollback and customer support active."
  };
}

function getRiskBand(exposure) {
  if (exposure >= 60) {
    return { label: "High exposure", className: "high" };
  }
  if (exposure >= 35) {
    return { label: "Moderate exposure", className: "medium" };
  }
  return { label: "Low exposure", className: "" };
}

function getOpenActions() {
  const scenario = getCurrentScenario();
  return scenario.checklist
    .filter(item => !state.checks[item.id])
    .map(item => item.label);
}

function getHighestRisks() {
  const scenario = getCurrentScenario();
  return scenario.risks
    .map(risk => {
      const values = getRiskValues(risk);
      return {
        ...risk,
        score: values.likelihood * values.impact
      };
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, 2);
}

function renderBriefing(decision, readiness, exposure) {
  const project = state.projectName.trim() || "Untitled deployment";
  const site = state.siteName.trim() || "Customer site";
  const scenario = getCurrentScenario();
  const openActions = getOpenActions();
  const highestRisks = getHighestRisks();

  const actionText = openActions.length
    ? openActions.slice(0, 3).join(" ")
    : "No open checklist actions.";

  const riskText = highestRisks
    .map(risk => `${risk.title}: ${risk.mitigation}`)
    .join(" ");

  const briefingData = [
    {
      title: "Deployment",
      text: `${project} — ${scenario.name} at ${site}. Recommendation: ${decision.title}.`
    },
    {
      title: "Readiness snapshot",
      text: `${readiness}% checklist completion and ${exposure}/100 estimated risk exposure. This is a planning aid, not a guarantee of system performance.`
    },
    {
      title: "Open actions",
      text: actionText,
      wide: true
    },
    {
      title: "Risk controls",
      text: riskText || "Review the listed risks and confirm owners before deployment.",
      wide: true
    }
  ];

  elements.briefing.innerHTML = briefingData.map(block => `
    <article class="briefing-block${block.wide ? " wide" : ""}">
      <h3>${escapeHtml(block.title)}</h3>
      <p>${escapeHtml(block.text)}</p>
    </article>
  `).join("");
}

function updateDashboard() {
  const readiness = calculateReadiness();
  const exposure = calculateRisk();
  const decision = getDecision(readiness, exposure);
  const band = getRiskBand(exposure);

  elements.readinessValue.textContent = `${readiness}%`;
  elements.readinessBar.style.width = `${readiness}%`;
  elements.readinessProgress.setAttribute("aria-valuenow", String(readiness));

  elements.riskValue.textContent = `${exposure} / 100`;
  elements.riskBand.textContent = band.label;
  elements.riskBand.className = `risk-band ${band.className}`.trim();

  elements.decisionPanel.className = `decision-panel ${decision.type}`;
  elements.decisionIcon.textContent = decision.icon;
  elements.decisionTitle.textContent = decision.title;
  elements.decisionText.textContent = decision.text;
  elements.decisionReadiness.textContent = `${readiness}%`;
  elements.decisionExposure.textContent = `${exposure}/100`;

  renderBriefing(decision, readiness, exposure);
}

function buildPlainTextBriefing() {
  const readiness = calculateReadiness();
  const exposure = calculateRisk();
  const decision = getDecision(readiness, exposure);
  const project = state.projectName.trim() || "Untitled deployment";
  const site = state.siteName.trim() || "Customer site";
  const scenario = getCurrentScenario();
  const openActions = getOpenActions();
  const risks = getHighestRisks();

  return [
    "FIELDOPS DEPLOYMENT BRIEFING",
    `Project: ${project}`,
    `Customer site: ${site}`,
    `Scenario: ${scenario.name}`,
    `Recommendation: ${decision.title}`,
    `Readiness: ${readiness}%`,
    `Estimated risk exposure: ${exposure}/100`,
    "",
    "Open actions:",
    ...(openActions.length ? openActions.map(action => `- ${action}`) : ["- None"]),
    "",
    "Priority risk mitigations:",
    ...risks.map(risk => `- ${risk.title}: ${risk.mitigation}`),
    "",
    "This assessment is a planning aid and does not guarantee system performance."
  ].join("\n");
}

function buildReport() {
  const readiness = calculateReadiness();
  const exposure = calculateRisk();
  const decision = getDecision(readiness, exposure);
  const scenario = getCurrentScenario();

  return {
    reportType: "FieldOps Deployment Assessment",
    generatedAt: new Date().toISOString(),
    project: state.projectName.trim() || "Untitled deployment",
    customerSite: state.siteName.trim() || "Customer site",
    scenario: scenario.name,
    recommendation: {
      status: decision.type,
      title: decision.title,
      explanation: decision.text
    },
    scores: {
      readinessPercent: readiness,
      estimatedRiskExposure: exposure,
      riskScale: "0 to 100; based on the average likelihood × impact rating"
    },
    checklist: scenario.checklist.map(item => ({
      item: item.label,
      criticalGoLiveGate: item.critical,
      complete: Boolean(state.checks[item.id])
    })),
    risks: scenario.risks.map(risk => {
      const values = getRiskValues(risk);
      return {
        risk: risk.title,
        likelihood: values.likelihood,
        impact: values.impact,
        mitigation: risk.mitigation
      };
    }),
    note: "Planning aid only. Validate against site procedures, customer approvals, and applicable requirements."
  };
}

function showMessage(message) {
  elements.actionMessage.textContent = message;
  window.setTimeout(() => {
    if (elements.actionMessage.textContent === message) {
      elements.actionMessage.textContent = "";
    }
  }, 2600);
}

async function copyBriefing() {
  const text = buildPlainTextBriefing();

  try {
    await navigator.clipboard.writeText(text);
    showMessage("Briefing copied.");
  } catch {
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.appendChild(temporary);
    temporary.select();

    try {
      document.execCommand("copy");
      showMessage("Briefing copied.");
    } catch {
      showMessage("Copy is unavailable in this browser.");
    } finally {
      temporary.remove();
    }
  }
}

function exportReport() {
  const report = buildReport();
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `fieldops-deployment-report-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showMessage("Report downloaded.");
}

function resetAssessment() {
  const confirmed = window.confirm(
    "Reset this assessment? Saved project details, checklist answers, and risk ratings will be cleared."
  );

  if (!confirmed) {
    return;
  }

  state = createDefaultState();
  saveState();
  initialize();
  showMessage("Assessment reset.");
}

function initialize() {
  elements.projectName.value = state.projectName;
  elements.siteName.value = state.siteName;

  populateScenarioOptions();
  renderChecklist();
  renderRisks();
  updateDashboard();
}

elements.projectName.addEventListener("input", event => {
  state.projectName = event.currentTarget.value;
  saveState();
  updateDashboard();
});

elements.siteName.addEventListener("input", event => {
  state.siteName = event.currentTarget.value;
  saveState();
  updateDashboard();
});

elements.scenarioSelect.addEventListener("change", event => {
  state.scenarioId = scenarios[event.currentTarget.value]
    ? event.currentTarget.value
    : "edgeVision";
  renderChecklist();
  renderRisks();
  saveState();
  updateDashboard();
});

elements.copyBriefing.addEventListener("click", copyBriefing);
elements.exportReport.addEventListener("click", exportReport);
elements.resetAssessment.addEventListener("click", resetAssessment);

initialize();
