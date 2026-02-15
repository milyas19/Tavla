import dateFormat from "dateformat";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import moment from "moment";
import { Person, Vakt } from "../models/Entities";
import Toast from "../util/AktivitetToastManager";

export interface IAktivitetFormProps {
  aktivitetFormProps: boolean;
  addNewRecord: (arg: boolean) => void;
}

const BaseApiUrlNavn: any = process.env.REACT_APP_API_URL_NAVN;
const BaseApiUrlVakt: any = process.env.REACT_APP_API_URL_VAKT;
const BaseApiUrl: any = process.env.REACT_APP_API_URL;

const AktivitetForm: React.FC<IAktivitetFormProps> = ({
  addNewRecord,
  aktivitetFormProps,
}) => {
  const [startDato, setStartDato] = useState("");
  const [tidFra, setTidFra] = useState("");
  const [tidTil, setTidTil] = useState("");
  const handleClose = () => addNewRecord(false);
  const [navnList, setNavnList] = useState([]);
  const [vaktList, setVaktList] = useState([]);
  const [navn, setNavn] = useState(0);
  const [vakt, setVakt] = useState(0);

  useEffect(() => {
    const now = new Date();
    setStartDato(moment(now).format("YYYY-MM-DD"));
    setTidFra(dateFormat(now, "HH:MM"));
    setTidTil(dateFormat(now, "HH:MM"));
  }, []);

  useEffect(() => {
    fetch(BaseApiUrlNavn)
      .then((response) => response.json())
      .then((json) => {
        setNavnList(json);
      })
      .catch((error) => {
        Toast.Error("Error while fetching names from server", error);
      });
  }, []);

  useEffect(() => {
    fetch(BaseApiUrlVakt)
      .then((response) => response.json())
      .then((json) => {
        setVaktList(json);
      })
      .catch((error) => {
        Toast.Error("Error while fetching vakt from server", error);
      });
  }, []);

  const handleChangeTidFra = (e: any, result: any) => {
    const newfraTid = result.target ? result.target.value : result.value;
    setTidFra(newfraTid);
  };

  const handleChangeTidTil = (e: any, result: any) => {
    const newtilTid = result.target ? result.target.value : result.value;
    setTidTil(newtilTid);
  };

  const handleChangeDate = (e: any, result: any) => {
    const newStartDato = result.target ? result.target.value : result.value;
    setStartDato(newStartDato);
  };

  const handleSelectNavn = (value: number) => {
    setNavn(value);
  };

  const handleSelectVaktType = (value: number) => {
    setVakt(value);
  };

  const handleSubmitAktivitet = (formdata: any) => {
    formdata.preventDefault();
    const avtaleFromFormData = Object.fromEntries(
      new FormData(formdata.target)
    );
    const aktivitetObj = { ...avtaleFromFormData };

    if (!aktivitetObj.personNavnId || Number(aktivitetObj.personNavnId) <= 0) {
      return Toast.Error(
        "Vennligst velg ett navn før du registrere aktivitet",
        aktivitetObj.personNavnId
      );
    }

    updateAktivitet(aktivitetObj);
  };

  const updateAktivitet = (aktivitetObj: any) => {
    if (!aktivitetObj) return;

    let datoObj = moment(aktivitetObj?.startDato, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    let fraTime = aktivitetObj?.fra + ":00";
    let startDatoObj = moment(new Date(datoObj + " " + fraTime)).toISOString(true);

    let tilTime = aktivitetObj?.til + ":00";
    let sluttDatoObj = moment(new Date(datoObj + " " + tilTime)).toISOString(true);

    const payload = {
      PersonId: aktivitetObj.personNavnId,
      Dato: startDatoObj,
      EndDato: sluttDatoObj,
      VaktId: aktivitetObj.vaktTypeId,
      Beskrivelse: aktivitetObj.beskrivelse,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    };
    fetch(BaseApiUrl, options)
      .then((response) => {
        if (response.ok) {
          Toast.Success(
            "Successfully created with statuscode: ",
            response.status
          );
        } else if (!response.ok) {
          Toast.Error(
            "Something went wrong whild creating new record!!!",
            response.statusText
          );
        }
      })
      .then(() => {
        setTimeout(window.location.reload.bind(window.location), 1000);
      })
      .catch((error) => {
        Toast.Error("Error while creating a new record", error);
      });
    handleClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-12">
      <div className="card-surface w-full max-w-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
              Ny aktivitet
            </p>
            <h3 className="text-2xl font-semibold text-white">
              Legg til en hendelse
            </h3>
            <p className="text-sm text-slate-300">
              Velg navn, vakt, tidspunkt og legg ved en kort beskrivelse.
            </p>
          </div>
          <button
            className="ghost-btn h-10 w-10 justify-center rounded-full"
            onClick={(e: any) => {
              e.preventDefault();
              handleClose();
            }}
            aria-label="Lukk"
          >
            ✕
          </button>
        </div>

        <form className="space-y-5" onSubmit={(formdata) => handleSubmitAktivitet(formdata)}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              Navn
              <select
                name="personNavnId"
                value={navn}
                onChange={(e) => handleSelectNavn(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
                required
              >
                <option value={0}>Velg navn</option>
                {navnList?.map((n: Person) => (
                  <option key={n.id} value={n.id}>
                    {n.navn}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-200">
              Vakt
              <select
                name="vaktTypeId"
                value={vakt}
                onChange={(e) => handleSelectVaktType(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
                required
              >
                <option value={0}>Velg vakt</option>
                {vaktList?.map((v: Vakt) => (
                  <option key={v.id} value={v.id}>
                    {v.vaktType}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-200">
              Dato
              <input
                type="date"
                name="startDato"
                value={
                  startDato
                    ? moment(startDato, [moment.ISO_8601, "YYYY-MM-DD", "DD.MM.YYYY"]).format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) => handleChangeDate(e, e)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
                required
              />
            </label>

            <label className="space-y-2 text-sm text-slate-200">
              Fra
              <input
                type="time"
                name="fra"
                value={
                  tidFra
                    ? moment(tidFra, [moment.ISO_8601, "HH:mm", "HH:MM"]).format("HH:mm")
                    : ""
                }
                onChange={(e) => handleChangeTidFra(e, e)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
                required
              />
            </label>

            <label className="space-y-2 text-sm text-slate-200">
              Til
              <input
                type="time"
                name="til"
                value={
                  tidTil
                    ? moment(tidTil, [moment.ISO_8601, "HH:mm", "HH:MM"]).format("HH:mm")
                    : ""
                }
                onChange={(e) => handleChangeTidTil(e, e)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
                required
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm text-slate-200">
            Beskrivelse
            <textarea
              name="beskrivelse"
              placeholder="Skriv her ..."
              className="h-28 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
            />
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              className="ghost-btn"
              onClick={(e: any) => {
                e.preventDefault();
                handleClose();
              }}
            >
              Avbryt
            </button>
            <button type="submit" className="primary-btn">
              Lagre
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AktivitetForm;
