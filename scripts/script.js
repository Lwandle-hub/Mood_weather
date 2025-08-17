
import { Weather } from './weatherModule.js';
import { select, showMessage, validateText, createChart } from './utils.js';

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeWeatherForm();
  initializeGallery();
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

function initializeGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = select('#gallery-modal');
  const modalImage = select('#modal-image');
  const modalCaption = select('#modal-caption');
  const closeModal = select('.close-modal');
  
  if (!modal || !modalImage || !modalCaption) return;
  
  // Add click event to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption');
      
      if (img && caption) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalCaption.innerHTML = caption.innerHTML;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal events
  if (closeModal) {
    closeModal.addEventListener('click', closeGalleryModal);
  }
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeGalleryModal();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeGalleryModal();
    }
  });
  
  function closeGalleryModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function setCurrentYear() {
  const yearElement = select('#year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear() + ' ';
  }
}
