import React, { useState } from "react";
import "./../../src/style.css";
import { constants } from "../models/constants/AktivitetEnums";
import AktivitetForm from "./AktivitetForm";
import { Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const NyAktivitet: React.FC = () => {
  const [aktivitetAdded, setAktivitetAdded] = useState<boolean>(false);

  const addNewRecord = (openForm: boolean): void => {
    setAktivitetAdded(openForm);
  };

  return (
    <>
      <Button inverted size="medium" onClick={() => addNewRecord(true)}>
        <span className="leggTilTxt">{constants.leggeTil}</span>
      </Button>

      {aktivitetAdded && (
        <AktivitetForm
          aktivitetFormProps={aktivitetAdded}
          addNewRecord={addNewRecord}
        />
      )}
    </>
  );
};
export default NyAktivitet;
