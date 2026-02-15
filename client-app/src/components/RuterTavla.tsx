import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { RuterStore } from "../store/RuterStore";

const api = {
  base: "https://api.staging.entur.io/geocoder/v1/autocomplete?text=",
  ruterBoard: "https://api.staging.entur.io/journey-planner/v3/graphql",
};

const RuterTavla: React.FC = () => {
  const [query, setQuery] = useState("");
  const [ruterResult, setRuterResult] = useRecoilState(RuterStore);

  const search = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const geoRes = await fetch(`${api.base}${encodeURIComponent(trimmed)}&lang=no&layers=venue`);
      const geoJson = await geoRes.json();
      const id = geoJson?.features?.[0]?.properties?.id;
      if (!id) {
        console.warn("Fant ingen holdeplass for søket", trimmed);
        return;
      }

      const boardRes = await fetch(`${api.ruterBoard}`, {
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
          variables: { id },
        }),
      });

      const boardJson = await boardRes.json();
      if (boardJson) {
        setQuery("");
        setRuterResult(boardJson);
      }
    } catch (err) {
      console.error("Feil under henting av rutedata", err);
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
    <div className="flex h-full flex-col gap-3">
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-emerald-300/80 focus:bg-white/10"
          placeholder="Søk etter holdeplass..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onKeyDown={search}
        />
        <span className="pointer-events-none absolute right-3 top-2 text-slate-400">⏎</span>
      </div>

      {ruterResult?.data?.stopPlace ? (
        <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">Avgangstavle</p>
              <h4 className="text-lg font-semibold text-white">{ruterResult?.data?.stopPlace?.name}</h4>
            </div>
            <span className="text-sm text-slate-300">Neste avganger</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <tbody className="divide-y divide-white/10">
                {filteredJourneyDeparture.map((data: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-white font-semibold">
                          {data?.code} {data?.destinationName}
                        </div>
                        <div className="flex flex-wrap gap-2 text-emerald-200">
                          {ruterResult?.data?.stopPlace?.estimatedCalls
                            .filter(
                              (c: any) =>
                                c.quay?.id === data?.id &&
                                c.serviceJourney.journeyPattern?.line.publicCode === data?.code
                            )
                            .map((tid: any, index: any) => (
                              <span
                                key={index}
                                className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold"
                              >
                                {tid.expectedDepartureTime?.split("T")[1].substring(0, 5)}
                              </span>
                            ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Søk etter et sted for å hente avganger.</p>
      )}
    </div>
  );
};

export default RuterTavla;
