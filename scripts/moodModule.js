export class MoodRecommender {
  constructor(weatherData) {
    this.data = weatherData.daily.temperature_2m_max;
  }
  getRecommendations() {
    return this.data.map(temp => {
      if (temp < 10) return 'Stay cozy indoors.';
      if (temp < 20) return 'Perfect for a jog.';
      if (temp < 30) return 'Great for outdoor activities.';
      return 'Carry water—you’ll need it!';
    });
  }
}

