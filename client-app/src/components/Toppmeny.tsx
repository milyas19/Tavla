import React from "react";
import { Button, Header, Segment } from "semantic-ui-react";
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

  debugger;

  console.log("typeof user:", typeof user);
  console.log("user:::::::::::::::", user);

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
      </div>
    </Segment>
  );
};
