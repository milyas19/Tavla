import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "moment/locale/nb";
import moment from "moment";
import { Person, Vakt } from "../models/Entities";
import "@fontsource/fira-code";
import Toast from "../util/AktivitetToastManager";
import { useRecoilState } from "recoil";
import { aktivitetListState } from "../store/aktivitetListState";
import { datoTidFormat } from "../models/constants/AktivitetEnums";

export interface IAktiviteter {
  id: number;
  dato: string;
  endDato: string;
  person: Person;
  personId: number;
  vakt: Vakt;
  vaktId: number;
  beskrivelse: string;
}

const BaseApiUrl: any = process.env.REACT_APP_API_URL;
const BaseApiUrlNavn: any = process.env.REACT_APP_API_URL_NAVN;
const BaseApiUrlVakt: any = process.env.REACT_APP_API_URL_VAKT;

const TableView: React.FC = () => {
  const [aktiviteterList, setAktiviteterList] =
    useRecoilState(aktivitetListState);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [navnList, setNavnList] = useState<Person[]>([]);
  const [vaktList, setVaktList] = useState<Vakt[]>([]);
  const [editItem, setEditItem] = useState<IAktiviteter | null>(null);
  const [editState, setEditState] = useState({
    dato: "",
    fra: "",
    til: "",
    beskrivelse: "",
    personId: 0,
    vaktId: 0,
  });

  useEffect(() => {
    fetch(BaseApiUrl)
      .then((response) => response.text())
      .then((json) => {
        setAktiviteterList(JSON.parse(json));
      })
      .catch((error) => {
        Toast.Error("You are unauthorized", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(BaseApiUrlNavn)
      .then((response) => response.json())
      .then((json) => setNavnList(json))
      .catch((error) => Toast.Error("Feil ved henting av navn", error));

    fetch(BaseApiUrlVakt)
      .then((response) => response.json())
      .then((json) => setVaktList(json))
      .catch((error) => Toast.Error("Feil ved henting av vakt", error));
  }, []);

  const AktivitetKort = (
    <div className="card-surface h-full flex flex-col">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 overflow-y-auto pr-2" style={{ maxHeight: "30rem" }}>
        {aktiviteterList?.map((data, i) => (
          <article
            key={i}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200/50 hover:shadow-lg hover:shadow-emerald-400/10"
            onClick={() => {
              setExpandedId(expandedId === data.id ? null : data.id);
              setEditItem(data);
              setEditState({
                dato: moment(data.dato).format("YYYY-MM-DD"),
                fra: moment(data.dato).format("HH:mm"),
                til: moment(data.endDato).format("HH:mm"),
                beskrivelse: data.beskrivelse || "",
                personId: data.personId,
                vaktId: data.vaktId,
              });
            }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
                    {moment(data.dato).format("dddd").substring(0, 3)}
                  </p>
                  <h4 className="text-lg font-semibold text-white">
                    {data.person.navn}
                  </h4>
                  <p className="text-sm text-slate-300">{data.vakt.vaktType}</p>
                </div>
              </div>
              <span className="self-center inline-flex whitespace-nowrap rounded-lg bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                {moment(data.dato).format("HH:mm")} - {moment(data.endDato).format("HH:mm")}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{moment(data.dato).format(datoTidFormat.fullDateTime)}</span>
            </div>

            <div className={expandedId === data.id ? "text-sm text-slate-200/90" : "text-sm text-slate-200/90 line-clamp-2"}>
              {data.beskrivelse || "Ingen beskrivelse"}
            </div>

            <div className="mt-auto flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-400/15 px-3 py-2 text-emerald-100 transition hover:bg-emerald-400/25"
                onClick={() => {
                  setEditItem(data);
                  setExpandedId(data.id);
                  setEditState({
                    dato: moment(data.dato).format("YYYY-MM-DD"),
                    fra: moment(data.dato).format("HH:mm"),
                    til: moment(data.endDato).format("HH:mm"),
                    beskrivelse: data.beskrivelse || "",
                    personId: data.personId,
                    vaktId: data.vaktId,
                  });
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232a2.5 2.5 0 113.536 3.536L8.5 19.036l-4 1 1-4 9.732-10.804z" />
                </svg>
                <span className="text-xs font-semibold">Rediger</span>
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-lg bg-rose-500/15 px-3 py-2 text-rose-200 transition hover:bg-rose-500/25"
                onClick={() => {
                  deleteById(data);
                  let index = aktiviteterList.findIndex(
                    (x: any) => x.id === data.id
                  );
                  setAktiviteterList([
                    ...aktiviteterList.slice(0, index),
                    ...aktiviteterList.slice(index + 1, aktiviteterList.length),
                  ]);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 11v6m4-6v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0h8m-9 12h10a1 1 0 001-1V7H5v12a1 1 0 001 1z" />
                </svg>
                <span className="text-xs font-semibold">Slett</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      {editItem
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-12"
              onClick={() => setEditItem(null)}
              aria-modal="true"
              role="dialog"
            >
              <div className="card-surface w-full max-w-xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Rediger aktivitet</p>
                    <h3 className="text-xl font-semibold text-white">{editItem.person.navn}</h3>
                  </div>
                  <button className="ghost-btn h-9 px-3" onClick={() => setEditItem(null)}>Lukk</button>
                </div>

                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!editItem) return;

                    const mergedDato = moment(`${editState.dato} ${editState.fra}`, "YYYY-MM-DD HH:mm").toISOString(true);
                    const mergedTil = moment(`${editState.dato} ${editState.til}`, "YYYY-MM-DD HH:mm").toISOString(true);

                    const payload = {
                      PersonId: editState.personId,
                      VaktId: editState.vaktId,
                      Beskrivelse: editState.beskrivelse,
                      Dato: mergedDato,
                      EndDato: mergedTil,
                    } as any;

                    fetch(`${BaseApiUrl}/${editItem.id}`, {
                      method: "PUT",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                      },
                      body: JSON.stringify(payload),
                    })
                      .then((response) => {
                        if (response.ok) {
                          Toast.Success("Oppdatert", response.status);
                          const updated = aktiviteterList.map((a) =>
                            a.id === editItem.id
                              ? {
                                  ...a,
                                  beskrivelse: editState.beskrivelse,
                                  dato: mergedDato,
                                  endDato: mergedTil,
                                  personId: editState.personId,
                                  vaktId: editState.vaktId,
                                  person:
                                    navnList.find((n) => n.id === editState.personId) ?? a.person,
                                  vakt:
                                    vaktList.find((v) => v.id === editState.vaktId) ?? a.vakt,
                                }
                              : a
                          );
                          setAktiviteterList(updated as any);
                          setEditItem(null);
                        } else {
                          Toast.Error("Kunne ikke oppdatere", response.statusText);
                        }
                      })
                      .catch((err) => Toast.Error("Feil ved oppdatering", err));
                  }}
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-1 text-sm text-slate-200">
                      Dato
                      <input
                        type="date"
                        value={editState.dato}
                        onChange={(e) => setEditState({ ...editState, dato: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-300/80"
                        required
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-200">
                      Beskrivelse
                      <input
                        type="text"
                        value={editState.beskrivelse}
                        onChange={(e) => setEditState({ ...editState, beskrivelse: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-300/80"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-1 text-sm text-slate-200">
                      Fra
                      <input
                        type="time"
                        value={editState.fra}
                        onChange={(e) => setEditState({ ...editState, fra: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-300/80"
                        required
                      />
                    </label>
                    <label className="space-y-1 text-sm text-slate-200">
                      Til
                      <input
                        type="time"
                        value={editState.til}
                        onChange={(e) => setEditState({ ...editState, til: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-300/80"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-1 text-sm text-slate-200">
                      Navn
                      <select
                        value={editState.personId}
                        onChange={(e) => setEditState({ ...editState, personId: Number(e.target.value) })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-300/80"
                      >
                        {!navnList.find((n) => n.id === editState.personId) && editItem ? (
                          <option value={editItem.personId}>{editItem.person.navn}</option>
                        ) : null}
                        {navnList?.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.navn}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1 text-sm text-slate-200">
                      Vakt
                      <select
                        value={editState.vaktId}
                        onChange={(e) => setEditState({ ...editState, vaktId: Number(e.target.value) })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-emerald-300/80"
                      >
                        {!vaktList.find((v) => v.id === editState.vaktId) && editItem ? (
                          <option value={editItem.vaktId}>{editItem.vakt.vaktType}</option>
                        ) : null}
                        {vaktList?.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.vaktType}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="ghost-btn" onClick={() => setEditItem(null)}>
                      Avbryt
                    </button>
                    <button type="submit" className="primary-btn">
                      Lagre endring
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
  return AktivitetKort;
};

export default TableView;

function deleteById(data: any) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer my-token",
    },
  };
  fetch(BaseApiUrl + "/" + data.id, requestOptions)
    .then((response) => {
      if (response.ok) {
        return Toast.Success(
          "Record successfully deleted!",
          response.statusText
        );
      } else if (!response.ok) {
        return Promise.reject(data || response.status);
      }
    })
    .catch((error) => {
      Toast.Error("There was an error occured while deleting record", error);
    });
}

export const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-trash"
    viewBox="0 0 16 16"
    color="azure"
  >
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
    <path
      fillRule="evenodd"
      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
    />
  </svg>
);
