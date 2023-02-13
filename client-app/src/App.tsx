import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import Header from "./components/Header/Header";
import TableView from "./components/View/TableView";
import { aktivitetListState } from "./store/aktivitetListState";

const BaseApiUrl: any = process.env.REACT_APP_API_URL;

const App: React.FC = () => {
  const [aktiviteterList, setAktiviteterList] =
    useRecoilState(aktivitetListState);

  useEffect(() => {
    fetch(BaseApiUrl)
      .then((response) => response.text())
      .then((json) => {
        setAktiviteterList(JSON.parse(json));
      })
      .catch((error) => {
        console.log("error", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <TableView
        aktiviteterList={aktiviteterList}
        setAktiviteterList={setAktiviteterList}
      />
    </div>
  );
};

export default App;
