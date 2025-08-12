// DOM helpers, validation, fetch wrapper, chart setup
export function select(selector) {
  return document.querySelector(selector);
}
export function showMessage(container, text, type = 'success') {
  container.textContent = text;
  container.className = type;
}
export function validateText(input) {
  return input.value.trim().length > 0;
}
export function fetchJSON(url) {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}
export function createChart(ctx, labels, data) {
  import('https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.esm.min.js')
    .then(({ Chart, registerables }) => {
      Chart.register(...registerables);
      new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Temp (°C)', data, borderColor: 'var(--clr-primary)' }] },
      });
    });
}

