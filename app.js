// app.js
import { operations } from "./calc.js";

const opSelect = document.getElementById("operationSelect");
const inputFields = document.getElementById("inputFields");
const runButton = document.getElementById("runCalc");
const resultOutput = document.getElementById("resultOutput");
const debugOutput = document.getElementById("debugOutput");
const installButton = document.getElementById("installButton");

let deferredPrompt = null;

function populateOps() {
  operations.forEach(op => {
    const opt = document.createElement("option");
    opt.value = op.id;
    opt.textContent = op.label;
    opSelect.appendChild(opt);
  });
}

function getSelectedOp() {
  const id = opSelect.value;
  return operations.find(o => o.id === id);
}

function buildInputsFor(op) {
  inputFields.innerHTML = "";
  op.inputs.forEach(meta => {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = meta.name;
    label.setAttribute("for", `input-${meta.name}`);

    const input = document.createElement("input");
    input.id = `input-${meta.name}`;
    input.name = meta.name;
    input.type = meta.type || "text";
    if (meta.placeholder) input.placeholder = meta.placeholder;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    inputFields.appendChild(wrapper);
  });
}

function collectArgs(op) {
  const args = {};
  op.inputs.forEach(meta => {
    const el = document.querySelector(`#input-${meta.name}`);
    args[meta.name] = el?.value ?? "";
  });
  return args;
}

function showResult(value) {
  if (typeof value === "object") {
    resultOutput.textContent = JSON.stringify(value);
    debugOutput.hidden = false;
    debugOutput.textContent = JSON.stringify(value, null, 2);
  } else {
    resultOutput.textContent = String(value);
    debugOutput.hidden = true;
  }
}

function showError(err) {
  resultOutput.textContent = `Error: ${err.message || err}`;
  debugOutput.hidden = false;
  debugOutput.textContent = err.stack || String(err);
}

runButton.addEventListener("click", () => {
  const op = getSelectedOp();
  if (!op) return;
  try {
    const args = collectArgs(op);
    const res = op.run(args);
    showResult(res);
  } catch (err) {
    showError(err);
  }
});

opSelect.addEventListener("change", () => {
  const op = getSelectedOp();
  if (op) buildInputsFor(op);
});

// Install prompt handling
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  installButton.hidden = true;
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("Install outcome:", outcome);
  deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
  console.log("PWA installed");
});

// Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  });
}

// Init
populateOps();
buildInputsFor(getSelectedOp() || operations[0]);