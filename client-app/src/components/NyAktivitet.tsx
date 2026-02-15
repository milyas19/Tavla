import React, { useState } from "react";
import { constants } from "../models/constants/AktivitetEnums";
import AktivitetForm from "./AktivitetForm";

const NyAktivitet: React.FC = () => {
  const [aktivitetAdded, setAktivitetAdded] = useState<boolean>(false);

  const addNewRecord = (openForm: boolean): void => {
    setAktivitetAdded(openForm);
  };

  return (
    <>
      <button className="primary-btn" onClick={() => addNewRecord(true)}>
        <span className="font-semibold">{constants.leggeTil}</span>
      </button>

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
