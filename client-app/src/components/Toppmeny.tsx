import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
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
  const [showMenu, setShowMenu] = useState(false);
  const weatherStore = useRecoilValue(WeatherStore);
  const [updateIcon, setUpdateIcon] = useState("");
  const currentWeather = weatherStore?.list?.[0];

  useEffect(() => {
    setUpdateIcon(currentWeather?.weather?.[0]?.icon ?? "");
  }, [currentWeather]);

  return (
    <div className="card-surface relative flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200">
            <span className="text-xl">📅</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
              Tidsplan
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Daglig oversikt</h2>
            {showLoggedInMsg && (
              <p className="text-xs sm:text-sm text-slate-300">Velkommen tilbake {user.displayName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showNyAktivitetBtn ? <div className="hidden sm:block"><NyAktivitet /></div> : null}

          {showLoggedOutBtn ? (
            <button
              className="ghost-btn hidden sm:inline-flex"
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

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-right text-xs">
              <div className="text-white">{weatherStore?.city?.name}</div>
              {currentWeather?.main?.temp && (
                <div className="text-emerald-200 font-semibold">
                  {Math.round(currentWeather.main.temp)}°C
                </div>
              )}
            </div>
            {updateIcon ? (
              <img
                className="h-8 w-8"
                src={`${api.baseImg}${updateIcon}.png`}
                alt={currentWeather?.weather?.[0]?.main || "vær"}
              />
            ) : null}
          </div>

          {(showNyAktivitetBtn || showLoggedOutBtn) && (
            <button
              className="ghost-btn sm:hidden px-3"
              aria-label="Åpne meny"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {showMenu && (showNyAktivitetBtn || showLoggedOutBtn) ? (
        <div className="sm:hidden absolute right-4 top-20 z-20 w-52 rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-xl">
          <div className="flex flex-col gap-2">
            {showNyAktivitetBtn ? <NyAktivitet /> : null}
            {showLoggedOutBtn ? (
              <button
                className="ghost-btn w-full"
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
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 sm:hidden">
        <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="text-sm">
            <div className="text-white">{weatherStore?.city?.name}</div>
            <div className="text-slate-300 text-xs">{weatherStore?.city?.country}</div>
            {currentWeather?.main?.temp && (
              <div className="text-emerald-200 font-semibold text-sm">
                {Math.round(currentWeather.main.temp)}°C
              </div>
            )}
            {currentWeather?.weather?.[0]?.description && (
              <div className="text-slate-400 capitalize text-xs">
                {currentWeather.weather[0].description}
              </div>
            )}
          </div>
          {updateIcon ? (
            <img
              className="h-10 w-10"
              src={`${api.baseImg}${updateIcon}.png`}
              alt={currentWeather?.weather?.[0]?.main || "vær"}
            />
          ) : null}
        </div>
      </div>

    </div>
  );
};
