import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Button, Form } from "semantic-ui-react";
import { aktivitetListState } from "../store/aktivitetListState";
import TableView from "./TableView";
import { Toppmeny } from "../components/Toppmeny";
import * as EmailValidator from "email-validator";
import Toast from "../util/AktivitetToastManager";

const BaseApiUrlLogin: any = process.env.REACT_APP_API_URL_LOGIN;

export const HomePage: React.FC = () => {
  const [showAktiviteterList, setShowAktiviteterList] =
    useState<boolean>(false);
  const [showLoggedInMsg, setShowLoggedInMsg] = useState<boolean>(false);
  const [showLoggedOutBtn, setShowLoggedOutBtn] = useState<boolean>(false);
  const [showNyAktivitetBtn, setShowNyAktivitetBtn] = useState<boolean>(false);
  const [showLoginWindow, setShowLoginWindow] = useState<boolean>(true);
  const [aktiviteterList, setAktiviteterList] =
    useRecoilState(aktivitetListState);
  const [validEmail, validateEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [passord, setPassord] = useState("");
  const [user, setUser] = useState();

  const handleEmail = (e: any) => {
    setEmail(e);
  };

  const handlePassword = (e: any) => {
    setPassord(e);
  };

  useEffect(() => {
    const validUser = localStorage.getItem("user");
    if (validUser != null) {
      setUser(JSON.parse(validUser));
      setShowLoggedInMsg(true);
      setShowLoggedOutBtn(true);
      setShowNyAktivitetBtn(true);
      setShowAktiviteterList(true);
      setShowLoginWindow(false);
    }
  }, []);

  const handleLoginSubmit = async (formdata: any) => {
    const loginInfo = Object.fromEntries(new FormData(formdata.target));
    const loginObj = { ...loginInfo };

    const payload = {
      Email: loginObj.email,
      Password: loginObj.passord,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    fetch(BaseApiUrlLogin, options)
      .then((response) => response.text())
      .then((json) => {
        let userResponse = JSON.parse(json);
        if (userResponse.statusCode === 200) {
          setShowLoggedInMsg(true);
          setShowLoggedOutBtn(true);
          setShowNyAktivitetBtn(true);
          setShowAktiviteterList(true);
          setShowLoginWindow(false);

          setUser(userResponse);
          localStorage.setItem("user", JSON.stringify(userResponse));
        } else if (userResponse.statusCode === 401) {
          Toast.Error(
            `Vennligst bruk riktig brukernavn eller passord: `,
            userResponse.statusCode
          );
        }
      })
      .catch((error) => Toast.Error("An error occured while login ", error));
  };
  console.log(typeof user);
  return (
    <>
      {user != null ? (
        <Toppmeny
          showLoggedInMsg={showLoggedInMsg}
          showLoggedOutBtn={showLoggedOutBtn}
          showNyAktivitetBtn={showNyAktivitetBtn}
          setShowLoggedInMsg={setShowLoggedInMsg}
          setShowLoggedOutBtn={setShowLoggedOutBtn}
          setShowNyAktivitetBtn={setShowNyAktivitetBtn}
          setShowAktiviteterList={setShowAktiviteterList}
          setShowLoginWindow={setShowLoginWindow}
          setUser={setUser}
          user={user}
        />
      ) : (
        <></>
      )}
      {showLoginWindow ? (
        <div className="loginWrapper">
          <Form
            onSubmit={(formdata) => handleLoginSubmit(formdata)}
            className="ui form loginForm"
          >
            <Form.Field required={true} error={validEmail ? false : true}>
              <input
                id="email-field"
                name="email"
                type={"email"}
                autoComplete="on"
                placeholder="Epost"
                value={email}
                onChange={(e) => {
                  validateEmail(EmailValidator.validate(e.target.value));
                  handleEmail(e.target.value);
                }}
              />
            </Form.Field>

            <Form.Field error={passord.length === 0 ? true : false}>
              <input
                id="passord-field"
                required={true}
                name="passord"
                autoComplete="on"
                type={"password"}
                placeholder="Passord"
                value={passord}
                onChange={(e) => {
                  handlePassword(e.target.value);
                }}
              />
            </Form.Field>

            <Button
              positive
              content="Login"
              type="submit"
              fluid
              onClick={() => {}}
            />
          </Form>
        </div>
      ) : null}

      {showAktiviteterList ? (
        <TableView
          aktiviteterList={aktiviteterList}
          setAktiviteterList={setAktiviteterList}
        />
      ) : (
        <></>
      )}
    </>
  );
};
