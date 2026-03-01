import moment from "moment/moment";
import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  WeatherFirstElementOfDayStore,
  WeatherStore,
} from "../store/WeatherStore";
moment.locale("no");

const api = {
  key: "a50d659259b7323fd439a773cbd13192",
  base: "https://api.openweathermap.org/data/2.5/",
  baseImg: "http://openweathermap.org/img/w/",
};

const WeatherReport: React.FC = () => {
  const [weather, setWeather] = useRecoilState(WeatherStore);
  const [, setWeatherFirstElementOfDayStore] = useRecoilState(WeatherFirstElementOfDayStore);
  const [query, setQuery] = useState("Oslo, NO");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionTimer = useRef<number | null>(null);

  const fetchWeather = async (city: string) => {
    const trimmed = city.trim();
    if (!trimmed) return;

    const response = await fetch(`${api.base}forecast?q=${encodeURIComponent(trimmed)}&units=metric&APPID=${api.key}`);
    const result = await response.json();

    const hasList = Array.isArray(result?.list) && result.list.length > 0;
    if (!hasList) {
      console.warn("Fant ingen værdata for", trimmed, result?.message);
      return;
    }

    setWeatherFirstElementOfDayStore(
      result.list.filter(function (_value: any, index: number) {
        return index % 8 === 0;
      })
    );
    setWeather(result);
    setSelectedDate(result.list?.[0]?.dt_txt?.split(" ")?.[0] ?? null);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      if (suggestionTimer.current) {
        window.clearTimeout(suggestionTimer.current);
        suggestionTimer.current = null;
      }
      return;
    }

    if (suggestionTimer.current) {
      window.clearTimeout(suggestionTimer.current);
    }

    suggestionTimer.current = window.setTimeout(async () => {
      try {
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=5&appid=${api.key}`
        );
        const geoJson = await geoRes.json();
        const names = (Array.isArray(geoJson) ? geoJson : [])
          .map((item: any) => {
            const state = item?.state ? `, ${item.state}` : "";
            const country = item?.country ? `, ${item.country}` : "";
            return `${item?.name ?? ""}${state}${country}`.trim();
          })
          .filter(Boolean);
        setSuggestions(Array.from(new Set(names)));
      } catch (err) {
        console.warn("Kunne ikke hente byforslag", err);
      }
    }, 300);
  };

  const dailySummary = Array.isArray(weather?.list)
    ? weather.list.filter((_: any, index: number) => index % 8 === 0)
    : [];

  const detailedForDay = Array.isArray(weather?.list)
    ? weather.list.filter((item: any) =>
        selectedDate ? item.dt_txt?.startsWith(selectedDate) : false
      )
    : [];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white transition focus-within:border-emerald-300/80 focus-within:bg-white/10">
          <span className="text-slate-400">🔎</span>
          <input
            type="text"
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
            placeholder="Velg lokasjon..."
            onChange={(e) => handleQueryChange(e.target.value)}
            value={query}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              fetchWeather(query);
              setSuggestions([]);
            }}
          />
          <span className="text-slate-400">⏎</span>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border border-white/10 bg-slate-950/95 p-2 shadow-xl backdrop-blur">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  fetchWeather(item);
                  setSuggestions([]);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
              >
                <span className="truncate">{item}</span>
                <span className="text-xs text-emerald-300">Velg</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {weather.city != null && weather.cnt > 0 ? (
        <div className="flex-1 space-y-4 overflow-hidden">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Daglig vær</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {dailySummary.map((data: any, i: number) => {
                const dateKey = data.dt_txt?.split(" ")?.[0];
                const isActive = dateKey === selectedDate;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedDate(dateKey)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-emerald-300/60 bg-emerald-400/10"
                        : "border-white/10 bg-white/5 hover:border-emerald-300/30"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {moment(data.dt_txt).format("dddd")}
                      </div>
                      <div className="text-xs text-slate-300">
                        {moment(data.dt_txt).format("DD.MM")}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        className="h-8 w-8"
                        src={`${api.baseImg}${data.weather[0].icon}.png`}
                        alt="vær"
                      />
                      <div className="text-right text-xs text-slate-200">
                        <div>{Math.round(data.main.temp_max)}° / {Math.round(data.main.temp_min)}°</div>
                        <div className="text-slate-400">Føles {Math.round(data.main.feels_like)}°</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Hver 3. time</p>
            <div className="grid h-full grid-cols-1 gap-2 overflow-y-auto">
              {detailedForDay.map((data: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="space-y-1 text-sm text-slate-200">
                    <div className="text-white font-semibold">
                      {moment(data.dt_txt).format("dddd").substring(0, 3)}
                    </div>
                    <div className="text-slate-300">
                      {data.dt_txt.split(" ")[1].substring(0, 5)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      className="h-10 w-10"
                      src={`${api.baseImg}${data.weather[0].icon}.png`}
                      alt="vær"
                    />
                    <div className="text-right text-sm text-slate-200">
                      <div>
                        {Math.round(data.main.temp_max)}° / {Math.round(data.main.temp_min)}°
                      </div>
                      <div className="text-slate-300">
                        Føles som {Math.round(data.main.feels_like)}°
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Søk etter en by for å hente værdata.</p>
      )}
    </div>
  );
};

export default WeatherReport;
