import { CloudLightning, CloudRain, CloudSun, Droplets, Snowflake, Thermometer, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { getCityWeather, type CityWeather as CityWeatherData } from "../../services/amapWeatherService.js";

function WeatherIcon({ weather, size = 18 }: { weather: string; size?: number }) {
  if (/雷/.test(weather)) return <CloudLightning size={size} />;
  if (/雨|阵雨/.test(weather)) return <CloudRain size={size} />;
  if (/雪|冰雹/.test(weather)) return <Snowflake size={size} />;
  return <CloudSun size={size} />;
}

function dayLabel(date: string, index: number) {
  if (index === 0) return "今天";
  if (index === 1) return "明天";
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date.slice(5) : new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(parsed);
}

export function CityWeather({ cities, compact = false }: { cities: string[]; compact?: boolean }) {
  const uniqueCities = [...new Set(cities.filter(Boolean))];
  const [city, setCity] = useState(uniqueCities[0] ?? "");
  const [weather, setWeather] = useState<CityWeatherData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => { if (!uniqueCities.includes(city)) setCity(uniqueCities[0] ?? ""); }, [city, uniqueCities]);
  useEffect(() => {
    if (!city) return;
    let cancelled = false;
    setStatus("loading");
    getCityWeather(city).then((result) => { if (!cancelled) { setWeather(result); setStatus("ready"); } }).catch(() => { if (!cancelled) { setWeather(null); setStatus("error"); } });
    return () => { cancelled = true; };
  }, [city]);

  if (!city) return null;
  return <section className={`city-weather ${compact ? "is-compact" : ""}`} aria-label={`${city}天气预报`}>
    <header><div><p>AMAP WEATHER</p><h3>{city}天气</h3></div>{uniqueCities.length > 1 && <div className="weather-city-tabs">{uniqueCities.map((item) => <button className={item === city ? "active" : ""} onClick={() => setCity(item)} key={item}>{item}</button>)}</div>}<small>{weather?.live.reportTime !== "--" ? weather?.live.reportTime : "高德实时数据"}</small></header>
    {status === "loading" && <div className="weather-loading"><i />正在获取天气预报…</div>}
    {status === "error" && <div className="weather-error">暂时无法取得天气，出发前请重新确认</div>}
    {status === "ready" && weather && <div className="weather-content">
      <div className="weather-now"><span className="weather-now-icon"><WeatherIcon weather={weather.live.weather} size={24} /></span><div><strong>{weather.live.temperature}°</strong><span>{weather.live.weather}</span></div><dl><div><dt><Wind size={12} />风况</dt><dd>{weather.live.windDirection}风 {weather.live.windPower}级</dd></div><div><dt><Droplets size={12} />湿度</dt><dd>{weather.live.humidity}%</dd></div></dl></div>
      <div className="weather-forecast">{weather.forecast.map((day, index) => <article key={day.date}><span>{dayLabel(day.date, index)}</span><WeatherIcon weather={day.dayWeather} size={17} /><strong>{day.dayTemp}° / {day.nightTemp}°</strong><small>{day.dayWeather === day.nightWeather ? day.dayWeather : `${day.dayWeather}转${day.nightWeather}`}</small></article>)}</div>
      {!compact && <p className="weather-shoot-note"><Thermometer size={13} />天气只辅助拍摄决策；实时路况、预警、能见度和道路管制仍以出发时信息为准。</p>}
    </div>}
  </section>;
}
