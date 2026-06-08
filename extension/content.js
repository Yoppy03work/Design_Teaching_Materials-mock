// content script: ページ全体に Machado 2009 のCVDフィルタ（線形RGB）を適用する。
// cvd-data.js が self.MACHADO_2009 を定義済み。
(() => {
  const FILTER_ID = "__cvd_sim_filter__";
  const FE_ID = "__cvd_sim_fe__";
  const SVG_ID = "__cvd_sim_svg__";

  function machadoMatrix(type, severity) {
    const table = self.MACHADO_2009 && self.MACHADO_2009[type];
    if (!table) return null;
    const idx = Math.max(0, Math.min(10, Math.round((severity ?? 0.6) * 10)));
    return table[idx];
  }

  // 9要素(行優先)の3x3を feColorMatrix の20値へ。
  function toFeValues(m) {
    return [
      m[0], m[1], m[2], 0, 0,
      m[3], m[4], m[5], 0, 0,
      m[6], m[7], m[8], 0, 0,
      0, 0, 0, 1, 0,
    ].join(" ");
  }

  function ensureSvg() {
    let fe = document.getElementById(FE_ID);
    if (fe) return fe;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.id = SVG_ID;
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "fixed";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.pointerEvents = "none";
    const filter = document.createElementNS(NS, "filter");
    filter.id = FILTER_ID;
    filter.setAttribute("color-interpolation-filters", "linearRGB");
    fe = document.createElementNS(NS, "feColorMatrix");
    fe.id = FE_ID;
    fe.setAttribute("type", "matrix");
    filter.appendChild(fe);
    svg.appendChild(filter);
    (document.body || document.documentElement).appendChild(svg);
    return fe;
  }

  function apply(state) {
    const root = document.documentElement;
    if (!state || !state.enabled) {
      root.style.filter = "";
      return;
    }
    const m = machadoMatrix(state.type, state.severity);
    if (!m) {
      root.style.filter = "";
      return;
    }
    const fe = ensureSvg();
    fe.setAttribute("values", toFeValues(m));
    root.style.filter = `url(#${FILTER_ID})`;
  }

  try {
    chrome.storage.local.get(["cvd"], (res) => apply(res && res.cvd));
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.cvd) apply(changes.cvd.newValue);
    });
  } catch {
    // 拡張コンテキスト外（通常ページ）では何もしない
  }
})();
