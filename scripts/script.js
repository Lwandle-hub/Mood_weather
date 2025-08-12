import { select, showMessage, createChart } from './utils.js';
import { Weather } from './weatherModule.js';
import { MoodRecommender } from './moodModule.js';
import { initThemeToggle } from './themeModule.js';

const weatherSvc = new Weather();
const pastSearches = [];
const toggleBtn = select('#theme-toggle');

// Universal
document.getElementById('year').textContent = new Date().getFullYear();
initThemeToggle(toggleBtn);

// WEATHER PAGE
const weatherForm = select('#weather-form');
if (weatherForm) {
  const resultSec = select('#weather-result');
  weatherForm.addEventListener('submit', async e => {
    e.preventDefault();
    const cityInput = select('#city');
    const city = cityInput.value;
    if (!city) return showMessage(cityInput, 'Enter a city', 'error');
    try {
      const data = await weatherSvc.fetchByCity(city);
      pastSearches.push(city);
      
      // Display the city name from the API response (properly formatted)
      select('#weather-city').textContent = data.cityName || city;
      
      // Display today's temperature
      const todayTemp = data.daily.temperature_2m_max[0];
      select('#weather-temp').textContent = Math.round(todayTemp);
      
      // Humidity not available in daily forecast, keep as placeholder
      select('#weather-humidity').textContent = '—';
      
      // Show the results section
      resultSec.classList.remove('hidden');
      
      // Create forecast chart with proper data
      createChart(
        select('#forecast-chart'), 
        data.daily.time.slice(0, 7), // Show 7 days
        data.daily.temperature_2m_max.slice(0, 7)
      );
      
      // Clear any previous error messages
      select('#weather-city').className = '';
      
    } catch (err) {
      console.error('Weather form error:', err);
      showMessage(select('#weather-city'), err.message, 'error');
      resultSec.classList.add('hidden');
    }
  });
}

// RECOMMENDATIONS PAGE
const recList = select('#recommendations-list');
if (recList) {
  // Assume last fetched data
  const lastData = weatherSvc.cache.values().next().value;
  if (lastData) {
    const recs = new MoodRecommender(lastData).getRecommendations();
    recs.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      recList.append(li);
    });
  } else {
    recList.textContent = 'Use the Weather page first.';
  }
}

// CONTACT PAGE
const contactForm = select('#contact-form');
if (contactForm) {
  const msgDiv = select('#contact-msg');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = select('#name'), email = select('#email'), msg = select('#message');
    try {
      if (!name.value || !email.value.includes('@') || !msg.value) {
        throw new Error('All fields are required and email must be valid.');
      }
      showMessage(msgDiv, 'Thank you for your feedback!', 'success');
      contactForm.reset();
    } catch (err) {
      showMessage(msgDiv, err.message, 'error');
    }
  });
}

