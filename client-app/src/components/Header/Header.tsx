import React from "react";
import { constants } from "../../constants/AktivitetEnums";
import "./../../../src/style.css";
import NyAktivitet from "./NyAktivitet";

const Header: React.FC = () => {
  return (
    <>
      <div className="banner">
        <div className="Heading">{constants.heading}</div>
        <NyAktivitet />
      </div>
    </>
  );
};
export default Header;
