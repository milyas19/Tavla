import moment from "moment/moment";
import React, { useEffect, useState } from "react";
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
  const [query, setQuery] = useState("oslo");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  useEffect(() => {
    fetchWeather(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <input
          type="text"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
          placeholder="Velg lokasjon..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            fetchWeather(query);
          }}
        />
        <span className="pointer-events-none absolute right-3 top-2 text-slate-400">⏎</span>
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
