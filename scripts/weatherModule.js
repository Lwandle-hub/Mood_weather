import { fetchJSON } from './utils.js';

export class Weather {
  constructor() {
    this.cache = new Map();
  }
  async fetchByCity(city) {
    city = city.trim().toLowerCase();
    if (this.cache.has(city)) return this.cache.get(city);
    const url = `https://api.open-meteo.com/v1/forecast?city=${encodeURIComponent(city)}&daily=temperature_2m_max&timezone=auto`;
    try {
      const data = await fetchJSON(url);
      this.cache.set(city, data);
      return data;
    } catch (e) {
      throw new Error('Failed to fetch weather');
    }
  }
}

