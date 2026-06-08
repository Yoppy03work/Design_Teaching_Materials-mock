// popup: 設定を chrome.storage.local に書き込む。content script が storage 変更を監視して適用する。
const DEFAULT = { enabled: false, type: "deutan", severity: 0.6 };
let current = { ...DEFAULT };

function render() {
  const pct = Math.round((current.severity ?? 0.6) * 100);
  document.getElementById("enabled").checked = !!current.enabled;
  document.getElementById("severity").value = String(pct);
  document.getElementById("sevval").textContent = String(pct);
  document.querySelectorAll("#types button").forEach((b) => {
    b.setAttribute("aria-pressed", b.dataset.type === current.type ? "true" : "false");
  });
}

function save() {
  chrome.storage.local.set({ cvd: current });
}

chrome.storage.local.get(["cvd"], (res) => {
  current = { ...DEFAULT, ...((res && res.cvd) || {}) };
  render();
});

document.getElementById("enabled").addEventListener("change", (e) => {
  current.enabled = e.target.checked;
  save();
});

document.getElementById("severity").addEventListener("input", (e) => {
  current.severity = Number(e.target.value) / 100;
  document.getElementById("sevval").textContent = e.target.value;
  save();
});

document.querySelectorAll("#types button").forEach((b) => {
  b.addEventListener("click", () => {
    current.type = b.dataset.type;
    render();
    save();
  });
});
