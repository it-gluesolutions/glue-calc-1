import { get_glue_mass } from "./calc.js";

// Local persistence key (bump version if schema changes)
const STORAGE_KEY = "gluecalc-params-v1";

const CACHE_NAME = "gluecalc-cache-v1";

// Utility: safe numeric parse; treat blank/invalid as 0
function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function readParamsFromDOM() {
  return {
    p1: toNum(document.getElementById("input-p1").value),
    p2: toNum(document.getElementById("input-p2").value),
    p3: toNum(document.getElementById("input-p3").value),
    p4: toNum(document.getElementById("input-p4").value),
    h1: toNum(document.getElementById("input-h1").value),
    h2: toNum(document.getElementById("input-h2").value),
    h3: toNum(document.getElementById("input-h3").value)
  };
}

function writeParamsToDOM(params) {
  if (params.p1 !== undefined) document.getElementById("input-p1").value = params.p1;
  if (params.p2 !== undefined) document.getElementById("input-p2").value = params.p2;
  if (params.p3 !== undefined) document.getElementById("input-p3").value = params.p3;
  if (params.p4 !== undefined) document.getElementById("input-p4").value = params.p4;
  if (params.h1 !== undefined) document.getElementById("input-h1").value = params.h1;
  if (params.h2 !== undefined) document.getElementById("input-h2").value = params.h2;
  if (params.h3 !== undefined) document.getElementById("input-h3").value = params.h3;
}

function loadSavedParams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return; // nothing saved yet
    const data = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return;
    writeParamsToDOM(data);
  } catch (err) {
    console.warn("Failed to load saved params", err);
  }
}

function saveParams(params) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch (err) {
    console.warn("Failed to save params", err);
  }
}

function doCalculation() {
  const { p1, p2, p3, p4, h1, h2, h3 } = readParamsFromDOM();

  let result;
  try {
    result = get_glue_mass(p1, p2, p3, p4, h1, h2, h3);
  } catch (err) {
    document.getElementById("resultOutput").textContent = "Error: " + err.message;
    return;
  }

  document.getElementById("resultOutput").textContent = result.mass;
  document.getElementById("resultArea").textContent = result.running;

  // Persist the values used for this calculation
  saveParams({ p1, p2, p3, p4, h1, h2, h3 });
}

function update_datalists(json){
  console.log(json);
  //alert(1);
  //alert(JSON.stringify(json));
  const datalist_map = [
    "surface_density"
  ];
  for(var l of datalist_map){
    if (json[l] === undefined) continue;
    var dl = document.getElementById(l);
    var html = '';
    var list = json[l];
    for(var i in list){
      html += '<option value="'+list[i]+'">'+i+'</option>';
    }
    dl.innerHTML = html;
  }
}

function load_datalists(){
  caches.open(CACHE_NAME).then((cache)=>cache.match('./datalists.js')).then((res)=>(undefined !== res) && res.json()).
    then((json)=>update_datalists(json));
}

// Wire up UI
window.addEventListener("DOMContentLoaded", () => {
  loadSavedParams();
  document.getElementById("runCalc").addEventListener("click", doCalculation);
  load_datalists();
  // Optional: register service worker if supported
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(err => {
      console.warn("SW registration failed", err);
    });
  }
});

// Track deferred prompt event
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent Chrome from showing its default mini-infobar
  deferredPrompt = e;
  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'inline-block';
});

// Handle click on custom install button
const installBtn = document.createElement('button');
installBtn.id = 'installBtn';
installBtn.textContent = 'Install App';
installBtn.style.display = 'none';
document.body.appendChild(installBtn);

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('User response to the install prompt:', outcome);
  deferredPrompt = null;
  installBtn.style.display = 'none';
});

navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'ALERT') {
    alert(event.data.info);
  }
});


