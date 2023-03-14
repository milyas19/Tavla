import React from "react";
import "semantic-ui-css/semantic.min.css";
import RuterTavla from "./components/RuterTavla";
import WeatherReport from "./components/WeatherReport";
import { HomePage } from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <>
      <HomePage />
      <RuterTavla />
      <WeatherReport />
    </>
  );
};

export default App;
