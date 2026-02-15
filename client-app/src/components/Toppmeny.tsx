import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  WeatherFirstElementOfDayStore,
  WeatherStore,
} from "../store/WeatherStore";
import NyAktivitet from "./NyAktivitet";

export interface IProps {
  showLoggedInMsg: boolean;
  showLoggedOutBtn: boolean;
  showNyAktivitetBtn: boolean;
  user: any;
  setUser: (args: any) => void;
  setShowLoggedInMsg: (args: any) => void;
  setShowLoggedOutBtn: (args: any) => void;
  setShowNyAktivitetBtn: (args: any) => void;
  setShowAktiviteterList: (args: any) => void;
  setShowLoginWindow: (args: any) => void;
}

const api = {
  key: "a50d659259b7323fd439a773cbd13192",
  base: "https://api.openweathermap.org/data/2.5/",
  baseImg: "http://openweathermap.org/img/w/",
};

export const Toppmeny: React.FC<IProps> = ({
  showLoggedInMsg,
  showLoggedOutBtn,
  showNyAktivitetBtn,
  setShowLoggedInMsg,
  setShowLoggedOutBtn,
  setShowNyAktivitetBtn,
  setShowAktiviteterList,
  setShowLoginWindow,
  setUser,
  user,
}) => {
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setWeatherFirstElementOfDayStore] = useRecoilState(
    WeatherFirstElementOfDayStore
  );
  const [weatherStore, setWeatherStore] = useRecoilState(WeatherStore);
  const [updateIcon, setUpdateIcon] = useState("");
  const currentWeather = weatherStore?.list?.[0];

  useEffect(() => {
    fetch(`${api.base}forecast?q=oslo&units=metric&APPID=${api.key}`)
      .then((response) => response.json())
      .then((result) => {
        const hasList = Array.isArray(result?.list) && result.list.length > 0;
        if (!hasList) return;

        setWeatherFirstElementOfDayStore(
          result.list.filter(function (_value: any, index: any) {
            return index % 8 === 0;
          })
        );
        setQuery("");
        setWeatherStore(result);
        setUpdateIcon(result.list[0]?.weather?.[0]?.icon ?? "");
      });
  }, [setWeatherFirstElementOfDayStore, setWeatherStore]);

  const search = (event: any) => {
    if (event.key === "Enter") {
      fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
        .then((response) => response.json())
        .then((result) => {
          const hasList = Array.isArray(result?.list) && result.list.length > 0;
          if (!hasList) {
            console.warn("Fant ingen værdata for", query, result?.message);
            return;
          }

          setWeatherFirstElementOfDayStore(
            result.list.filter(function (_value: any, index: any) {
              return index % 8 === 0;
            })
          );
          setQuery("");
          setWeatherStore(result);
          setUpdateIcon(result.list[0]?.weather?.[0]?.icon ?? "");
        });
    }
  };

  return (
    <div className="card-surface flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200">
          <span className="text-2xl">📅</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
            Tidsplan
          </p>
          <h2 className="text-2xl font-semibold text-white">Daglig oversikt</h2>
          {showLoggedInMsg && (
            <p className="text-sm text-slate-300">Velkommen tilbake {user.displayName}</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
            placeholder="Velg lokasjon..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />
          <span className="pointer-events-none absolute right-3 top-2 text-slate-400">⏎</span>
        </div>

        {showNyAktivitetBtn ? <NyAktivitet /> : null}

        {showLoggedOutBtn ? (
          <button
            className="ghost-btn"
            onClick={() => {
              setShowLoggedInMsg(false);
              setShowLoggedOutBtn(false);
              setShowNyAktivitetBtn(false);
              setShowAktiviteterList(false);
              setShowLoginWindow(true);
              setUser({});
              localStorage.clear();
            }}
          >
            Logg ut
          </button>
        ) : null}

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="text-right text-sm">
            <div className="text-white">{weatherStore?.city?.name}</div>
            <div className="text-slate-300">{weatherStore?.city?.country}</div>
            {currentWeather?.main?.temp && (
              <div className="text-emerald-200 font-semibold">
                {Math.round(currentWeather.main.temp)}°C
              </div>
            )}
            {currentWeather?.weather?.[0]?.description && (
              <div className="text-slate-400 capitalize">
                {currentWeather.weather[0].description}
              </div>
            )}
          </div>
          {updateIcon ? (
            <img
              className="h-12 w-12"
              src={`${api.baseImg}${updateIcon}.png`}
              alt={currentWeather?.weather?.[0]?.main || "vær"}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
