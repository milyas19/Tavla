import moment from "moment/moment";
import React from "react";
import { useRecoilState } from "recoil";
import { Table } from "semantic-ui-react";
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
    <>
      {weather.city != null && weather.cnt > 0 ? (
        <div className="weatherWrapper">
          <Table size="large">
            <thead>
              <tr>
                <th>Dato</th>
                <th>Vær</th>
                <th>Temp.</th>
                <th>Føles som</th>
              </tr>
            </thead>
            <tbody className="tableBodyStyle">
              {weather?.list?.map((data: any, i: number) => (
                <tr key={i}>
                  <td>
                    {moment(data.dt_txt).format("dddd").substring(0, 3)} -{" "}
                    {data.dt_txt.split(" ")[1].substring(0, 5)}
                  </td>
                  <td>
                    <img
                      src={`${api.baseImg}${data.weather[0].icon}.png`}
                      alt="img"
                    />
                  </td>
                  <td>
                    ( {Math.round(data.main.temp_max)} ,{" "}
                    {Math.round(data.main.temp_min)} )°c
                  </td>
                  <td>{Math.round(data.main.feels_like)}°c</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default WeatherReport;
