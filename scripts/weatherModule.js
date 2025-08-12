
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
      const geoData = await fetchJSON(geoUrl);
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }
      
      const { latitude, longitude } = geoData.results[0];
      
      // Then get weather data using coordinates
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=auto`;
      const data = await fetchJSON(weatherUrl);
      
      this.cache.set(city, data);
      return data;
    } catch (e) {
      throw new Error('Failed to fetch weather data');
    }
  }
}
