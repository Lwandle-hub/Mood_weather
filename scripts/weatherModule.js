
import { fetchJSON } from './utils.js';

export class Weather {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }
  
  async fetchByCity(city) {
    // Clean the city name - remove extra spaces and trim
    const originalCity = city.trim().replace(/\s+/g, ' ');
    const cacheKey = originalCity.toLowerCase();
    
    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Return pending request if already in progress
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }
    
    // Create new request
    const requestPromise = this._performWeatherRequest(originalCity, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      this.cache.set(cacheKey, result);
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
  
  async _performWeatherRequest(originalCity, cacheKey) {
    try {
      // First, get coordinates for the city using geocoding
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(originalCity)}&count=1&language=en&format=json`;
      console.log('Geocoding URL:', geoUrl);
      
      const geoData = await fetchJSON(geoUrl);
      console.log('Geocoding response:', geoData);
      
      if (!geoData) {
        throw new Error('Unable to connect to geocoding service. Please try again.');
      }
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City "${originalCity}" not found. Please check the spelling and try again.`);
      }
      
      const { latitude, longitude, name } = geoData.results[0];
      console.log(`Found coordinates for ${name}: ${latitude}, ${longitude}`);
      
      // Then get weather data using coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
      console.log('Weather URL:', weatherUrl);
      
      const data = await fetchJSON(weatherUrl);
      console.log('Weather response:', data);
      
      if (!data || !data.daily || !data.daily.temperature_2m_max) {
        throw new Error('Invalid weather data received. Please try again.');
      }
      
      // Add the city name to the response for display
      data.cityName = name;
      
      return data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to fetch weather data. Please try again.';
      
      if (error && error.message) {
        errorMessage = error.message;
      } else if (error && typeof error === 'string') {
        errorMessage = error;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      }
      
      throw new Error(errorMessage);
    }
  }
}
