import dateFormat from "dateformat";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Form, TextArea, Button, Icon, Header } from "semantic-ui-react";
import "../../../src/style.css";
import "semantic-ui-css/semantic.min.css";
import { DateInput, TimeInput } from "semantic-ui-calendar-react";
import { Person, Vakt } from "../../interfaces/Entities";
import styled from "styled-components";
import Toast from "../Util/AktivitetToastManager";

export interface IAktivitetFormProps {
  aktivitetFormProps: boolean;
  addNewRecord: (arg: boolean) => void;
}

const BaseApiUrlNavn: any = process.env.REACT_APP_API_URL_NAVN;
const BaseApiUrlVakt: any = process.env.REACT_APP_API_URL_VAKT;
const BaseApiUrl: any = process.env.REACT_APP_API_URL;

const AktivitetForm: React.FC<IAktivitetFormProps> = ({
  aktivitetFormProps,
  addNewRecord,
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
    let startDatoObj = new Date();
    setStartDato(moment(startDatoObj).format("DD.MM.YYYY"));
    setTidFra(dateFormat(new Date(), "HH:MM"));
    setTidTil(dateFormat(new Date(), "HH:MM"));
  }, []);

  useEffect(() => {
    fetch(BaseApiUrlNavn)
      .then((response) => response.json())
      .then((json) => {
        setNavnList(json);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    fetch(BaseApiUrlVakt)
      .then((response) => response.json())
      .then((json) => {
        setVaktList(json);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleChangeTidFra = (e: any, result: any) => {
    const newfraTid = result.value;
    setTidFra(newfraTid);
  };

  const handleChangeTidTil = (e: any, result: any) => {
    const newtilTid = result.value;
    setTidTil(newtilTid);
  };

  const handleChangeDate = (e: any, result: any) => {
    const newStartDato = result.value;
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

    if (Number(aktivitetObj.personNavnId) === 1) {
      return Toast.Error(
        "Vennligst velg ett navn før du registrere aktivitet",
        aktivitetObj.personNavnId
      );
    }

    updateAktivitet(aktivitetObj);
  };

  const updateAktivitet = (aktivitetObj: any) => {
    if (!aktivitetObj) return;

    let datoObj = moment(aktivitetObj?.startDato, "DD.MM.YYYY").format(
      "YYYY.MM.DD"
    );

    let fraTime = aktivitetObj?.fra + ":00";
    let startDatoObj = moment(new Date(datoObj + " " + fraTime)).toISOString(
      true
    );

    let tilTime = aktivitetObj?.til + ":00";
    let sluttDatoObj = moment(new Date(datoObj + " " + tilTime)).toISOString(
      true
    );

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
        console.log("error", error);
      });
    handleClose();
  };

  return (
    <div className="aktivitetFormWrapper">
      <Form onSubmit={(formdata) => handleSubmitAktivitet(formdata)}>
        <Header className="formHeading">
          <span className="headingText">Register en aktivitet</span>
        </Header>
        <Form.Group className="entityTypeDropdown">
          <Form.Field className="lableStyle">Navn:</Form.Field>
          <select
            name="personNavnId"
            value={navn}
            id="navnDropdown"
            onChange={(e) => handleSelectNavn(Number(e.target.value))}
          >
            {navnList?.map((n: Person) => (
              <option key={n.id} value={n.id}>
                {n.navn}
              </option>
            ))}
          </select>
        </Form.Group>
        <Form.Group className="entityTypeDropdown">
          <Form.Field className="lableStyle">Vakt:</Form.Field>
          <select
            name="vaktTypeId"
            value={vakt}
            id="vaktDropdown"
            onChange={(e) => handleSelectVaktType(Number(e.target.value))}
          >
            {vaktList?.map((v: Vakt) => (
              <option key={v.id} value={v.id}>
                {v.vaktType}
              </option>
            ))}
          </select>
        </Form.Group>
        <Form.Group>
          <Form.Field className="lableStyleDato">Dato:</Form.Field>
          <Form.Field
            control={DateInput}
            required={true}
            className="aktivitet_DateInput"
            name="startDato"
            localization="no"
            placeholder="Dato"
            value={
              startDato
                ? moment(startDato, [moment.ISO_8601, "DD.MM.YYYY"]).format(
                    "DD.MM.YYYY"
                  )
                : ""
            }
            iconPosition="left"
            onChange={(e: any, result: any) => handleChangeDate(e, result)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Field className="lableStyleTid">Fra:</Form.Field>
          <Form.Field
            className="aktivitet_TimeInput"
            required={true}
            control={TimeInput}
            name="fra"
            localization="no"
            placeholder="Fra"
            value={
              tidFra
                ? moment(tidFra, [moment.ISO_8601, "HH:mm"]).format("HH:mm")
                : ""
            }
            iconPosition="left"
            onChange={(e: any, result: any) => handleChangeTidFra(e, result)}
          />

          <Form.Field className="lableStyleTid">Til:</Form.Field>
          <Form.Field
            className="aktivitet_TimeInput"
            required={true}
            control={TimeInput}
            name="til"
            localization="no"
            placeholder="Til"
            value={
              tidTil
                ? moment(tidTil, [moment.ISO_8601, "HH:mm"]).format("HH:mm")
                : ""
            }
            iconPosition="left"
            onChange={(e: any, result: any) => handleChangeTidTil(e, result)}
          />
        </Form.Group>
        <Form.Group className="entityTypeTextArea">
          <Form.Field className="lableStyle">Beskrivelse:</Form.Field>
          <TextArea
            className="entityTypeTextArea1"
            name="beskrivelse"
            placeholder="Skriv her ..."
          />
        </Form.Group>
        <EventFormButton>
          <Button
            style={{
              backgroundColor: "#eee",
              border: "2px solid hsl(212, 53%, 79%)",
            }}
            onClick={(e: any) => {
              e.preventDefault();
              handleClose();
            }}
          >
            <Icon name="remove" /> Avbryt
          </Button>
          <Form.Field
            control={Button}
            style={{
              backgroundColor: "steelblue",
              color: "#000",
              border: "2px solid hsl(212, 53%, 79%)",
            }}
          >
            <Icon name="checkmark" /> Lagre
          </Form.Field>
        </EventFormButton>
      </Form>
    </div>
  );
};

const EventFormButton = styled.div`
  display: flex;
  float: right;
  vertical-align: center;
  margin-top: 3rem;
`;

export default AktivitetForm;
