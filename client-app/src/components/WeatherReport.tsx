import moment from "moment/moment";
import React from "react";
import { useRecoilState } from "recoil";
import {
  // WeatherFirstElementOfDayStore,
  WeatherStore,
} from "../store/WeatherStore";
moment.locale("no");

const api = {
  key: "a50d659259b7323fd439a773cbd13192",
  base: "https://api.openweathermap.org/data/2.5/",
  baseImg: "http://openweathermap.org/img/w/",
};

const WeatherReport: React.FC = () => {
  const [weather] = useRecoilState(WeatherStore);
  // const [shortWeatherReport] = useRecoilState(WeatherFirstElementOfDayStore);

  return (
    <div className="flex h-full flex-col gap-3">
      {weather.city != null && weather.cnt > 0 ? (
        <div className="flex-1 space-y-3 overflow-hidden">
          <div className="grid h-full grid-cols-1 gap-3 overflow-y-auto">
            {weather?.list?.map((data: any, i: number) => (
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
      ) : (
        <p className="text-sm text-slate-400">Søk etter en by for å hente værdata.</p>
      )}
    </div>
  );
};

export default WeatherReport;
