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

export function showMessage(element, message, type) {
  element.textContent = message;
  element.className = type;

  // Clear message after 5 seconds
  setTimeout(() => {
    element.textContent = '';
    element.className = '';
  }, 5000);
}

export async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export function createChart(canvas, labels, data) {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, cannot create chart');
    canvas.style.display = 'none';
    return;
  }

  // Clear any existing chart
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: 'Max Temperature (°C)',
        data: data,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '7-Day Temperature Forecast'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        }
      }
    }
  });
}