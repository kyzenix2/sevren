const teams = {
  red: {
    kicker: "OFFENSIVE RESEARCH",
    title: "Question the security assumptions.",
    desc: "Examine security boundaries in authorized environments. Use adversarial thinking to strengthen your defenses.",
    items: [
      ["Vulnerability research", "Investigate root causes and assess security boundaries."],
      ["Adversary emulation", "Develop realistic exercises for controlled environments."],
      ["Attack-surface review", "Examine exposure across cloud, identity, and infrastructure."]
    ],
    quote: "Review this authorized test environment. Identify the exposed trust boundaries, prioritize the assumptions to validate, and propose a controlled assessment plan.",
    outputs: ["Boundary analysis", "Test priorities", "Assessment plan"]
  },
  blue: {
    kicker: "DEFENSIVE OPERATIONS",
    title: "Turn evidence into a response.",
    desc: "Turn signals into an investigation plan. Connect the evidence, check your coverage, and make the next action clear.",
    items: [
      ["Detection engineering", "Translate observed behavior into testable detection hypotheses."],
      ["Incident analysis", "Reconstruct the timeline and separate evidence from assumptions."],
      ["Security hardening", "Prioritize configuration changes and validate their impact."]
    ],
    quote: "Review these sanitized incident notes. Build an evidence timeline, identify gaps in detection coverage, and propose a prioritized containment and recovery plan.",
    outputs: ["Evidence timeline", "Detection gaps", "Response plan"]
  }
};

const menuToggle = document.querySelector(".public-menu-toggle");
const mobileNav = document.getElementById("public-navigation");

menuToggle.addEventListener("click", () => {
  const open = mobileNav.getAttribute("data-open") !== "true";
  mobileNav.hidden = !open;
  mobileNav.setAttribute("data-open", open ? "true" : "false");
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.textContent = open ? "Close" : "Menu +";
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mobileNav.hidden = true;
    mobileNav.setAttribute("data-open", "false");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu +";
  }
});

const copyButton = document.getElementById("copy-contract");
const copyStatus = document.getElementById("copy-status");

copyButton.addEventListener("click", async () => {
  const address = document.getElementById("contract-address").textContent.trim();
  try {
    await navigator.clipboard.writeText(address);
    copyButton.textContent = "Copied";
    copyStatus.textContent = "Contract address copied.";
  } catch {
    copyButton.textContent = "Copy";
    copyStatus.textContent = "Could not copy the contract address.";
  }
  window.setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1600);
});

const tabRed = document.getElementById("tab-red");
const tabBlue = document.getElementById("tab-blue");
const panel = document.getElementById("research-panel");

function renderTeam(name) {
  const team = teams[name];
  document.getElementById("cap-kicker").textContent = team.kicker;
  document.getElementById("cap-title").textContent = team.title;
  document.getElementById("cap-desc").textContent = team.desc;
  document.getElementById("cap-quote").textContent = team.quote;
  document.getElementById("cap-list").innerHTML = team.items.map((item, index) => `
    <li><span aria-hidden="true">0${index + 1}</span><div><h4>${item[0]}</h4><p>${item[1]}</p></div></li>
  `).join("");
  document.getElementById("cap-outputs").innerHTML = team.outputs.map((item) => `<li>${item}</li>`).join("");
  const selected = name === "red" ? tabRed : tabBlue;
  tabRed.setAttribute("aria-selected", name === "red" ? "true" : "false");
  tabBlue.setAttribute("aria-selected", name === "blue" ? "true" : "false");
  tabRed.tabIndex = name === "red" ? 0 : -1;
  tabBlue.tabIndex = name === "blue" ? 0 : -1;
  panel.setAttribute("aria-labelledby", selected.id);
}

tabRed.addEventListener("click", () => renderTeam("red"));
tabBlue.addEventListener("click", () => renderTeam("blue"));

const commands = [
  { key: "models", label: "Browse the model catalog", href: "#models" },
  { key: "terminal", label: "Open the chat terminal", href: "https://app.sevren.xyz/chat" },
  { key: "login", label: "Sign in with a wallet", href: "https://app.sevren.xyz/login" },
  { key: "pricing", label: "Model prices and holder plans", href: "https://docs.sevren.xyz/docs/pricing" },
  { key: "docs", label: "Read the documentation", href: "https://docs.sevren.xyz/docs" },
  { key: "privacy", label: "Privacy model", href: "#how-it-works" },
  { key: "research", label: "Security research", href: "#research" },
  { key: "help", label: "Getting started and API guide", href: "https://docs.sevren.xyz/docs" }
];

const overlay = document.getElementById("command-overlay");
const search = document.getElementById("command-search");
const results = document.getElementById("command-results");
let activeIndex = 0;
let visible = commands;

function openCommands() {
  overlay.hidden = false;
  search.value = "";
  activeIndex = 0;
  renderCommands("");
  search.focus();
}

function closeCommands() {
  overlay.hidden = true;
}

function renderCommands(query) {
  const q = query.trim().toLowerCase();
  visible = commands.filter((command) => command.key.includes(q) || command.label.toLowerCase().includes(q));
  if (activeIndex >= visible.length) activeIndex = 0;
  if (!visible.length) {
    results.innerHTML = `<p class="command-empty">No matching commands.</p>`;
    return;
  }
  results.innerHTML = visible.map((command, index) => `
    <button class="command-result" type="button" role="option" data-index="${index}" aria-selected="${index === activeIndex}">
      <strong>&gt; ${command.key}</strong>
      <span>${command.label}</span>
    </button>
  `).join("");
}

function runCommand(command) {
  closeCommands();
  if (command.href.startsWith("#")) {
    document.querySelector(command.href)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.location.href = command.href;
}

search.addEventListener("input", () => {
  activeIndex = 0;
  renderCommands(search.value);
});

search.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex = Math.min(activeIndex + 1, visible.length - 1);
    renderCommands(search.value);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    renderCommands(search.value);
  } else if (event.key === "Enter" && visible[activeIndex]) {
    event.preventDefault();
    runCommand(visible[activeIndex]);
  } else if (event.key === "Escape") {
    closeCommands();
  }
});

results.addEventListener("click", (event) => {
  const button = event.target.closest(".command-result");
  if (!button) return;
  runCommand(visible[Number(button.dataset.index)]);
});

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeCommands();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (overlay.hidden) openCommands();
    else closeCommands();
  } else if (event.key === "Escape" && !overlay.hidden) {
    closeCommands();
  }
});
