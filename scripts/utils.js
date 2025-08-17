// DOM helpers, validation, fetch wrapper, chart setup
export function select(selector) {
  return document.querySelector(selector);
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

export function validateText(input) {
  return input.value.trim().length > 0;
}

export async function fetchJSON(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
}

export function createChart(ctx, labels, data) {
  // Clear any existing chart
  if (ctx.chart) {
    ctx.chart.destroy();
  }

  // Use the Chart.js that's already loaded from the HTML
  if (typeof Chart !== 'undefined') {
    ctx.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Temperature (°C)',
          data,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
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
  } else {
    console.error('Chart.js not loaded');
  }
}