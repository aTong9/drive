import { hasAmapCredentials, loadAmap } from "./amapLoader.js";

export interface CityWeatherLive {
  city: string;
  weather: string;
  temperature: string;
  windDirection: string;
  windPower: string;
  humidity: string;
  reportTime: string;
}

export interface CityWeatherDay {
  date: string;
  dayWeather: string;
  nightWeather: string;
  dayTemp: string;
  nightTemp: string;
  dayWindDirection: string;
  nightWindDirection: string;
  dayWindPower: string;
  nightWindPower: string;
}

export interface CityWeather {
  live: CityWeatherLive;
  forecast: CityWeatherDay[];
}

interface WeatherApi {
  getLive: (city: string, callback: (error: unknown, data: Record<string, unknown>) => void) => void;
  getForecast: (city: string, callback: (error: unknown, data: { forecasts?: Array<Record<string, unknown>> }) => void) => void;
}

const cache = new Map<string, Promise<CityWeather>>();

function text(value: unknown) { return value == null ? "--" : String(value); }

export function getCityWeather(city: string): Promise<CityWeather> {
  const normalizedCity = city.trim();
  if (!normalizedCity || !hasAmapCredentials()) return Promise.reject(new Error("天气服务未配置"));
  const queryCity = /(?:市|县|区|盟|州)$/.test(normalizedCity) ? normalizedCity : `${normalizedCity}市`;
  const pending = cache.get(normalizedCity);
  if (pending) return pending;
  const request = loadAmap().then((AMapApi) => {
    const Weather = (AMapApi as unknown as { Weather?: new () => WeatherApi }).Weather;
    if (!Weather) throw new Error("高德天气插件不可用");
    const weather = new Weather();
    const livePromise = new Promise<Record<string, unknown>>((resolve, reject) => weather.getLive(queryCity, (error, data) => error ? reject(error) : resolve(data)));
    const forecastPromise = new Promise<{ forecasts?: Array<Record<string, unknown>> }>((resolve, reject) => weather.getForecast(queryCity, (error, data) => error ? reject(error) : resolve(data)));
    return Promise.all([livePromise, forecastPromise]);
  }).then(([live, forecast]) => ({
    live: {
      city: text(live.city || normalizedCity), weather: text(live.weather), temperature: text(live.temperature),
      windDirection: text(live.windDirection), windPower: text(live.windPower), humidity: text(live.humidity), reportTime: text(live.reportTime)
    },
    forecast: (forecast.forecasts ?? []).slice(0, 4).map((day) => ({
      date: text(day.date), dayWeather: text(day.dayWeather), nightWeather: text(day.nightWeather), dayTemp: text(day.dayTemp), nightTemp: text(day.nightTemp),
      dayWindDirection: text(day.dayWindDirection), nightWindDirection: text(day.nightWindDirection), dayWindPower: text(day.dayWindPower), nightWindPower: text(day.nightWindPower)
    }))
  })).catch((error) => { cache.delete(normalizedCity); throw error; });
  cache.set(normalizedCity, request);
  return request;
}
