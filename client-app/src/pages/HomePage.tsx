import { useState, useEffect } from "react";
import TableView from "./TableView";
import { Toppmeny } from "../components/Toppmeny";
import * as EmailValidator from "email-validator";
import Toast from "../util/AktivitetToastManager";
import RuterTavla from "../components/RuterTavla";
import WeatherReport from "../components/WeatherReport";

const BaseApiUrlLogin: any = process.env.REACT_APP_API_URL_LOGIN;

export const HomePage: React.FC = () => {
  const [showAktiviteterList, setShowAktiviteterList] =
    useState<boolean>(false);
  const [showLoggedInMsg, setShowLoggedInMsg] = useState<boolean>(false);
  const [showLoggedOutBtn, setShowLoggedOutBtn] = useState<boolean>(false);
  const [showNyAktivitetBtn, setShowNyAktivitetBtn] = useState<boolean>(false);
  const [showLoginWindow, setShowLoginWindow] = useState<boolean>(true);
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

  const handleLoginSubmit = async (formdata: React.FormEvent<HTMLFormElement>) => {
    formdata.preventDefault();

    const loginInfo = Object.fromEntries(new FormData(formdata.currentTarget));
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
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {user ? (
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
        <header className="card-surface flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-200/80">
            Tavla
          </p>
          <h1 className="text-3xl font-bold text-white">Velkommen tilbake</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Logg inn for å planlegge ansvar, holde orden på rutetider og følge
            værmeldingen i én samlet oversikt. Hele opplevelsen er nå redesignet
            med Tailwind for klarhet og ro.
          </p>
        </header>
      )}

      {showLoginWindow ? (
        <div className="grid place-items-center">
          <div className="card-surface w-full max-w-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Autentisering
                </p>
                <h2 className="text-xl font-semibold text-white">Logg inn</h2>
              </div>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-100">
                Sikker tilgang
              </span>
            </div>
            <form
              className="space-y-4"
              onSubmit={(formdata) => handleLoginSubmit(formdata)}
            >
              <label className="block space-y-2">
                <span className="text-sm text-slate-300">E-post</span>
                <input
                  id="email-field"
                  name="email"
                  type="email"
                  autoComplete="on"
                  placeholder="epost@example.no"
                  value={email}
                  onChange={(e) => {
                    validateEmail(EmailValidator.validate(e.target.value));
                    handleEmail(e.target.value);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
                  required
                />
                {!validEmail && email.length > 0 && (
                  <span className="text-xs text-rose-300">
                    Oppgi en gyldig e-postadresse.
                  </span>
                )}
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Passord</span>
                <input
                  id="passord-field"
                  name="passord"
                  type="password"
                  autoComplete="on"
                  placeholder="••••••••"
                  value={passord}
                  onChange={(e) => handlePassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-btn w-full justify-center"
              >
                Logg inn
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {showAktiviteterList ? (
        <div className="grid auto-rows-fr gap-6 lg:grid-cols-3 items-stretch">
          <section className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Plan
                </p>
                <h3 className="text-2xl font-semibold text-white">Aktiviteter</h3>
              </div>
              <span className="text-sm text-slate-300">
                Synkroniserte tider og ansvar
              </span>
            </div>
            <div className="flex-1">
              <TableView />
            </div>
          </section>

          <section className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Vær
                </p>
                <h3 className="text-xl font-semibold text-white">Nåværende</h3>
              </div>
            </div>
            <div className="card-surface flex-1 min-h-[24rem]">
              <WeatherReport />
            </div>
          </section>

          <section className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Kollektiv
                </p>
                <h3 className="text-xl font-semibold text-white">Ruter</h3>
              </div>
            </div>
            <div className="card-surface flex-1 min-h-[24rem]">
              <RuterTavla />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};