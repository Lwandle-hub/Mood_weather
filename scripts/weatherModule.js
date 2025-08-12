
import { fetchJSON } from './utils.js';

export class Weather {
  constructor() {
    this.cache = new Map();
  }
  
  async fetchByCity(city) {
    city = city.trim().toLowerCase();
    if (this.cache.has(city)) return this.cache.get(city);
    
    try {
      // First, get coordinates for the city using geocoding
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      console.log('Geocoding URL:', geoUrl);
      
      const geoData = await fetchJSON(geoUrl);
      console.log('Geocoding response:', geoData);
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
      }
      
      const { latitude, longitude, name } = geoData.results[0];
      console.log(`Found coordinates for ${name}: ${latitude}, ${longitude}`);
      
      // Then get weather data using coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
      console.log('Weather URL:', weatherUrl);
      
      const data = await fetchJSON(weatherUrl);
      console.log('Weather response:', data);
      
      // Add the city name to the response for display
      data.cityName = name;
      
      this.cache.set(city, data);
      return data;
    } catch (e) {
      console.error('Weather fetch error:', e);
      throw new Error(`Failed to fetch weather data: ${e.message}`);
    }
  }
}
