import React, { useState, useEffect } from 'react';
import Weather from './Weather';

function convertToFlag(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const App: React.FC = () => {
  const [location, setLocation] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayLocation, setDisplayLocation] = useState<string>('');
  const [weather, setWeather] = useState<{
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  }>();

  useEffect(() => {
    async function fetchWeather() {
      try {
        setIsLoading(true);
        // 1) Getting location (geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();
        console.log(geoData);

        if (!geoData.results) throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);
        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.daily);
        console.log(weatherData.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!location) return;

    fetchWeather();
  }, [location]);

  return (
    <div className="app">
      <h1>Funky Weather</h1>
      <div>
        <input
          type="text"
          placeholder="Search for location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      {isLoading && <p className="loader">Loading...</p>}
      {weather?.weathercode && !isLoading && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
};

export default App;
