import { useEffect, useState } from 'react';
import weatherStyles from '../../styles/weather.module.css';
import { getWeatherForecast } from '../../utils.ts';
import { WeatherForecast as WeatherForecastType } from '../../constants.ts';
import { CurrentWeatherCard, UpcomingWeatherCard } from '../WeatherCards.tsx';
import { logInfo } from '@hubspot/cms-components';

interface WeatherForecastProps {
  headline: string;
  defaultCity: string;
}

export default function WeatherForecast({
  headline,
  defaultCity,
}: WeatherForecastProps) {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherForecastType>();

  useEffect(() => {
    getWeatherForecast(defaultCity).then((data) => {
      setWeatherData(data);
    });
  }, []);

  const handleFetchWeather = () => {
    getWeatherForecast(city).then((data) => {
      setWeatherData(data);
    });
  };

  const isFetching: boolean = !weatherData;
  const hasError: boolean = !isFetching && !!weatherData.error;
  const hasWeatherData: boolean =
    !isFetching && !hasError && !!weatherData.forecast;
  const missingData = !isFetching && !hasWeatherData && !hasError;

  function WeatherForecast({ weatherData }) {
    return (
      <>
        <div>
          <CurrentWeatherCard weatherData={weatherData} />
        </div>
        <div className={weatherStyles.cardContainer}>
          <UpcomingWeatherCard weatherData={weatherData} />
        </div>
      </>
    );
  }

  return (
    <div className={weatherStyles.wrapper}>
      <h1>{headline}</h1>
      <div className={weatherStyles.form}>
        <input
          type="text"
          placeholder="Enter city"
          onChange={(event) => setCity(event.target.value)}
        />
        <button onClick={handleFetchWeather}>Update Forecast</button>
      </div>
      <div className={weatherStyles.currentWeather}>
        {isFetching && <h2>Loading...</h2>}
        {hasError && <h2>Error occurred when fetching weather forecast</h2>}
        {hasWeatherData && <WeatherForecast weatherData={weatherData} />}
        {missingData && (
          <h2>No results found for "{city}", please search another location</h2>
        )}
      </div>
    </div>
  );
}
