import React from "react";
import "moment/locale/nb";
import moment from "moment";
import { Person, Vakt } from "../../interfaces/Entities";
import "@fontsource/fira-code";
import Table from "semantic-ui-react/dist/commonjs/collections/Table";
import Toast from "./../Util/AktivitetToastManager";

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

export interface IViewAktiviteter {
  aktiviteterList: IAktiviteter[];
  setAktiviteterList: (arg: any) => void;
}

const BaseApiUrl: any = process.env.REACT_APP_API_URL;

const TableView: React.FC<IViewAktiviteter> = ({
  aktiviteterList,
  setAktiviteterList,
}) => {
  const DeleteIcon = () => (
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
  const AktivitetTabell = (
    <div className="tidsplanBody">
      <Table striped={false} bgcolor="#eee" size="large">
        <thead className="tableHeader">
          <tr>
            <th>Dato</th>
            <th>Fra</th>
            <th>Til</th>
            <th>Dag</th>
            <th>Navn</th>
            <th>Vakt</th>
            <th>Beskrivelse</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {aktiviteterList?.length &&
            aktiviteterList?.map((data, i) => (
              <tr key={i}>
                <td>{moment(data.dato).format("DD.MM.YYYY HH:mm")}</td>
                <td>{moment(data.dato).format("HH:mm")}</td>
                <td>{moment(data.endDato).format("HH:mm")}</td>
                <td>{moment(data.dato).format("dddd").substring(0, 3)}</td>
                <td>{data.person.navn}</td>
                <td>{data.vakt.vaktType}</td>
                <td>{data.beskrivelse}</td>
                <td
                  className="deleteButton"
                  id={data.id + ""}
                  onClick={() => {
                    deleteById(data);
                    let index = aktiviteterList.findIndex(
                      (x: any) => x.id === data.id
                    );
                    setAktiviteterList([
                      ...aktiviteterList.slice(0, index),
                      ...aktiviteterList.slice(
                        index + 1,
                        aktiviteterList.length
                      ),
                    ]);
                  }}
                >
                  {DeleteIcon()}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
  return AktivitetTabell;
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
