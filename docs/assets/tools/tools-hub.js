import { initDutchTaxCalculator } from "./dutch-tax-calculator.js";
import { initPlaceholderTool } from "./tool-placeholder.js";

const tools = [
  {
    id: "dutch-tax",
    label: "Dutch Tax Calculator",
    init: initDutchTaxCalculator,
  },
  {
    id: "placeholder",
    label: "Coming Soon Tool",
    init: initPlaceholderTool,
  },
];

function hasTool(toolId) {
  return tools.some((tool) => tool.id === toolId);
}

function getToolIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("tool");
  if (fromQuery && hasTool(fromQuery)) {
    return fromQuery;
  }

  const fromHash = window.location.hash.replace(/^#/, "");
  if (fromHash && hasTool(fromHash)) {
    return fromHash;
  }

  return tools[0]?.id;
}

function setToolIdInUrl(toolId) {
  const url = new URL(window.location.href);
  url.searchParams.set("tool", toolId);
  window.history.replaceState({}, "", url.toString());
}

function renderToolSelection(selectEl) {
  const options = tools
    .map((tool) => `<option value="${tool.id}">${tool.label}</option>`)
    .join("");

  selectEl.innerHTML = options;
}

function mountTool(toolId, host) {
  const tool = tools.find((entry) => entry.id === toolId) || tools[0];

  if (!tool) {
    host.textContent = "No tool is configured.";
    return;
  }

  host.innerHTML = "";

  tool.init({ host });
}

function initToolsHub() {
  const host = document.getElementById("tool-host");
  const selectEl = document.getElementById("tool-select");

  if (!host || !selectEl) {
    return;
  }

  renderToolSelection(selectEl);
  const selectedToolId = getToolIdFromUrl();
  selectEl.value = selectedToolId;
  mountTool(selectedToolId, host);
  setToolIdInUrl(selectedToolId);

  selectEl.addEventListener("change", (event) => {
    const selectedId = event.target.value;
    mountTool(selectedId, host);
    setToolIdInUrl(selectedId);
  });
}

initToolsHub();
