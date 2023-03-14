import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { Table } from "semantic-ui-react";
import { RuterStore } from "../store/RuterStore";
import "../../src/style.css";

const api = {
  base: "https://api.staging.entur.io/geocoder/v1/autocomplete?text=",
  ruterBoard: "https://api.staging.entur.io/journey-planner/v3/graphql",
};

const RuterTavla: React.FC = () => {
  const [query, setQuery] = useState("");
  const [ruterResult, setRuterResult] = useRecoilState(RuterStore);
  const [sourceId, setSourceId] = useState("");

  const search = (event: any) => {
    debugger;
    fetch(`${api.base}${query}&lang=no&layers=venue`)
      .then((response) => response.json())
      .then((result) => {
        if (result != null) {
          console.log("Value of result ::: ", result);
          setSourceId(result.features[0].properties.id);
        }
      });

    console.log("value of console : ", query);
    if (event.key === "Enter") {
      fetch(`${api.ruterBoard}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query StopPlaceWithEstimatedCalls(
            $id: String!
            $timeRange: Int = 172800
            $numberOfDeparturesPerLineAndDestinationDisplay: Int = 20
            $numberOfDepartures: Int = 200
            $whiteListedModes: [TransportMode]
        ){
            stopPlace(id: $id) {
                id
                name
                description
                latitude
                longitude
                transportMode
                transportSubmode
                estimatedCalls(
                    numberOfDepartures: $numberOfDepartures
                    timeRange: $timeRange
                    numberOfDeparturesPerLineAndDestinationDisplay: $numberOfDeparturesPerLineAndDestinationDisplay
                    arrivalDeparture: departures
                    whiteListedModes: $whiteListedModes
                ) {
                    aimedDepartureTime
                    cancellation
                    date
                    destinationDisplay {
                        frontText
                    }
                    expectedDepartureTime
                    quay {
                        id
                        name
                        publicCode
                    }
                    serviceJourney {
                        id
                        journeyPattern {
                            line {
                                publicCode
                                transportMode
                            }
                        }
                        transportSubmode
                    }
                    situations {
                        description {
                            value
                        }
                        summary {
                            value
                        }
                    }
                }
            }
        }`,
          variables: { id: `${sourceId}` },
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result != null) {
            setQuery("");
            setRuterResult(result);
          }
        });
    }
  };

  let uniqueStops = [
    ...new Set(
      ruterResult?.data?.stopPlace?.estimatedCalls
        .filter((c: any) => {
          return (
            c.quay.id &&
            c.serviceJourney.journeyPattern.line.publicCode &&
            c.destinationDisplay.frontText
          );
        })
        .map((d: any) => {
          return {
            id: d.quay.id,
            code: d.serviceJourney.journeyPattern.line.publicCode,
            destinationName: d.destinationDisplay.frontText,
          };
        })
    ),
  ];

  let filteredJourneyDeparture: any = [];
  uniqueStops.forEach((x: any) => {
    if (
      !filteredJourneyDeparture.some(
        (y: any) => JSON.stringify(y) === JSON.stringify(x)
      )
    ) {
      filteredJourneyDeparture.push(x);
    }
  });

  return (
    <div className="ruterWrapper">
      <div className="search-box-ruter">
        <input
          type="text"
          className="search-bar-ruter"
          placeholder="Velg lokasjon..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onKeyDown={search}
        />
      </div>
      {ruterResult.data != null ? (
        <div>
          <Table size="large">
            <thead>
              <tr>
                <th>{ruterResult?.data?.stopPlace?.name}</th>
              </tr>
            </thead>
            <tbody className="tableBodyStyle">
              {filteredJourneyDeparture.map((data: any, i: number) => (
                <tr className="kollektivTidTabell" key={i}>
                  <td>
                    <h3 style={{ fontWeight: "bold" }}>
                      {data?.code} {data?.destinationName}
                    </h3>
                    {ruterResult?.data?.stopPlace?.estimatedCalls
                      .filter(
                        (c: any) =>
                          c.quay?.id === data?.id &&
                          c.serviceJourney.journeyPattern?.line.publicCode ===
                            data?.code
                      )
                      .map((tid: any, index: any) => {
                        return (
                          <td key={index}>
                            {tid.expectedDepartureTime
                              ?.split("T")[1]
                              .substring(0, 5)}
                          </td>
                        );
                      })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RuterTavla;
