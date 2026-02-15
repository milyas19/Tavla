import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { RuterStore } from "../store/RuterStore";

const api = {
  base: "https://api.staging.entur.io/geocoder/v1/autocomplete?text=",
  ruterBoard: "https://api.staging.entur.io/journey-planner/v3/graphql",
};

const RuterTavla: React.FC = () => {
  const [query, setQuery] = useState("Grorud");
  const [ruterResult, setRuterResult] = useRecoilState(RuterStore);

  const fetchBoard = async (place: string) => {
    const trimmed = place.trim();
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
        setRuterResult(boardJson);
      }
    } catch (err) {
      console.error("Feil under henting av rutedata", err);
    }
  };

  useEffect(() => {
    fetchBoard(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    await fetchBoard(query);
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
            transportMode: d.serviceJourney.journeyPattern.line.transportMode,
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

  const modePriority: Record<string, number> = {
    metro: 0,
    bus: 1,
  };

  const getDirectionLabel = (destination: string) => {
    const text = destination.toLowerCase();
    if (text.includes("øst")) return "Østgående";
    if (text.includes("vest")) return "Vestgående";
    return "Annet";
  };

  const directionPriority: Record<string, number> = {
    østgående: 0,
    vestgående: 1,
    annet: 2,
  };

  filteredJourneyDeparture.sort((a: any, b: any) => {
    const aMode = String(a?.transportMode || "").toLowerCase();
    const bMode = String(b?.transportMode || "").toLowerCase();
    const aRank = modePriority[aMode] ?? 2;
    const bRank = modePriority[bMode] ?? 2;
    if (aRank !== bRank) return aRank - bRank;

    const aDir = getDirectionLabel(String(a?.destinationName || "")).toLowerCase();
    const bDir = getDirectionLabel(String(b?.destinationName || "")).toLowerCase();
    const aDirRank = directionPriority[aDir] ?? 2;
    const bDirRank = directionPriority[bDir] ?? 2;
    if (aDirRank !== bDirRank) return aDirRank - bDirRank;

    return String(a?.destinationName || "").localeCompare(String(b?.destinationName || ""));
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
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
            <div className="flex min-w-0 items-center gap-2">
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-emerald-200">
                Neste avganger
              </span>
              <h4 className="text-base sm:text-lg font-semibold text-white truncate">
                {ruterResult?.data?.stopPlace?.name}
              </h4>
            </div>
            <span className="text-xs text-slate-400">Oppdatert fortløpende</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="grid gap-3">
              {filteredJourneyDeparture.map((data: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-300/40 hover:bg-white/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex flex-wrap items-center gap-2 text-white">
                      <span className="text-lg font-semibold">{data?.code}</span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-200">
                        {String(data?.transportMode || "").toLowerCase() === "metro"
                          ? "T-bane"
                          : String(data?.transportMode || "").toLowerCase() === "bus"
                            ? "Buss"
                            : String(data?.transportMode || "").toLowerCase() || "Annet"}
                      </span>
                      <span className="text-slate-300 text-xs truncate">
                        {data?.destinationName}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-emerald-200">
                      {ruterResult?.data?.stopPlace?.estimatedCalls
                        .filter(
                          (c: any) =>
                            c.quay?.id === data?.id &&
                            c.serviceJourney.journeyPattern?.line.publicCode === data?.code
                        )
                        .slice(0, 5)
                        .map((tid: any, index: any) => (
                          <span
                            key={index}
                            className="rounded-lg bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-100 whitespace-nowrap"
                          >
                            {tid.expectedDepartureTime?.split("T")[1].substring(0, 5)}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Søk etter et sted for å hente avganger.</p>
      )}
    </div>
  );
};

export default RuterTavla;
