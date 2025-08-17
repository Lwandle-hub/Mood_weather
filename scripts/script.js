
import { Weather } from './weatherModule.js';
import { select, showMessage, validateText, createChart } from './utils.js';

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeWeatherForm();
  setCurrentYear();
});

function initializeTheme() {
  const themeToggle = select('#theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

function initializeWeatherForm() {
  const weatherForm = select('#weather-form');
  const cityInput = select('#city');
  const quickCityButtons = document.querySelectorAll('.quick-city-btn');
  
  if (!weatherForm || !cityInput) return;
  
  const weather = new Weather();
  
  // Handle form submission
  weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const city = cityInput.value.trim();
    if (!validateText(cityInput)) {
      showMessage(cityInput, 'Please enter a valid city name', 'error');
      return;
    }
    
    await handleWeatherRequest(weather, city);
  });
  
  // Handle quick city buttons
  quickCityButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const city = button.getAttribute('data-city');
      cityInput.value = city;
      await handleWeatherRequest(weather, city);
    });
  });
}

async function handleWeatherRequest(weather, city) {
  const resultSection = select('#weather-result');
  const cityDisplay = select('#weather-city');
  const tempDisplay = select('#weather-temp');
  const humidityDisplay = select('#weather-humidity');
  const chartCanvas = select('#forecast-chart');
  
  if (!resultSection || !cityDisplay || !tempDisplay || !chartCanvas) {
    console.error('Missing weather display elements');
    return;
  }
  
  try {
    // Show loading state
    resultSection.classList.remove('hidden');
    cityDisplay.textContent = `Loading weather for ${city}...`;
    tempDisplay.textContent = '...';
    humidityDisplay.textContent = '...';
    
    console.log('Fetching weather for:', city);
    const data = await weather.fetchByCity(city);
    console.log('Weather data received:', data);
    
    // Display weather data
    cityDisplay.textContent = data.cityName || city;
    tempDisplay.textContent = data.daily.temperature_2m_max[0];
    
    // Humidity isn't available in this API, so we'll hide it or show N/A
    if (humidityDisplay.parentElement) {
      humidityDisplay.parentElement.style.display = 'none';
    }
    
    // Create chart
    const labels = data.daily.time.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    
    createChart(chartCanvas, labels, data.daily.temperature_2m_max);
    
  } catch (error) {
    console.error('Weather form error:', error);
    
    // Show error message
    cityDisplay.textContent = 'Error';
    tempDisplay.textContent = '—';
    humidityDisplay.textContent = '—';
    
    // Create error message element if it doesn't exist
    let errorElement = select('#weather-error');
    if (!errorElement) {
      errorElement = document.createElement('p');
      errorElement.id = 'weather-error';
      errorElement.className = 'error';
      resultSection.appendChild(errorElement);
    }
    
    errorElement.textContent = error.message || 'Failed to fetch weather data. Please try again.';
    errorElement.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }, 5000);
  }
}

function setCurrentYear() {
  const yearElement = select('#year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear() + ' ';
  }
}
