import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Button, Header, Segment } from "semantic-ui-react";
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
  const FontAwesome = require("react-fontawesome");
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setWeatherFirstElementOfDayStore] = useRecoilState(
    WeatherFirstElementOfDayStore
  );
  const [weatherStore, setWeatherStore] = useRecoilState(WeatherStore);
  const [updateIcon, setUpdateIcon] = useState("");

  useEffect(() => {
    fetch(`${api.base}forecast?q=oslo&units=metric&APPID=${api.key}`)
      .then((response) => response.json())
      .then((result) => {
        debugger;
        if (result != null) {
          setWeatherFirstElementOfDayStore(
            result?.list?.filter(function (value: any, index: any, Arr: any) {
              return index % 8 === 0;
            })
          );
          setQuery("");
          setWeatherStore(result);
          setUpdateIcon(result?.list[0]?.weather[0]?.icon);
        }
      });
  }, [setWeatherFirstElementOfDayStore, setWeatherStore]);

  const search = (event: any) => {
    if (event.key === "Enter") {
      fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
        .then((response) => response.json())
        .then((result) => {
          debugger;

          if (result != null) {
            setWeatherFirstElementOfDayStore(
              result?.list?.filter(function (value: any, index: any, Arr: any) {
                return index % 8 === 0;
              })
            );
            setQuery("");
            setWeatherStore(result);
            setUpdateIcon(result?.list[0]?.weather[0]?.icon);
          }
        });
    }
  };

  //   const restOfData = () => {
  //     weather.list.filter(function (obj) {
  //       return firstElementOfDay.indexOf(obj) === -1;
  //     });
  //   };

  return (
    <Segment inverted textAlign="right" vertical className="masthead toppmeny">
      <Header as="h2" className="siteHeader">
        Tidsplan
      </Header>
      <span className="calendarIcon">
        <FontAwesome
          className="super-crazy-colors"
          name="calendar"
          size="4x"
          style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
        />
      </span>
      <div className="logoutWrapper">
        <div className="search-box-ruter">
          <input
            type="text"
            className="search-bar-ruter"
            placeholder="Velg lokasjon..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />
        </div>
        {showLoggedInMsg ? (
          <Header
            as="h5"
            className="welcomeBackMsg"
            inverted
            content={`Welcome back ${user.displayName}!`}
          />
        ) : (
          <></>
        )}

        {showLoggedOutBtn === true ? (
          <Button
            onClick={() => {
              setShowLoggedInMsg(false);
              setShowLoggedOutBtn(false);
              setShowNyAktivitetBtn(false);
              setShowAktiviteterList(false);
              setShowLoginWindow(true);
              setUser({});
              localStorage.clear();
            }}
            size="medium"
            className="logout"
            inverted
          >
            Logout!
          </Button>
        ) : (
          <></>
        )}
        {showNyAktivitetBtn === true ? <NyAktivitet /> : <></>}
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Velg lokasjon..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />
        </div>

        <div className="location">
          {weatherStore?.city?.name}, {weatherStore?.city?.country}{" "}
        </div>
        <div>
          <img src={`${api.baseImg}${updateIcon}.png`} alt="img" />
        </div>
      </div>
    </Segment>
  );
};
