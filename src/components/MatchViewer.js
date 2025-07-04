import React, { useState } from "react";
import data from "../data/match-data.json";
import { ScrambleDisplay } from "scramble-display";
import "./MatchViewer.css";
import { getSetsWon } from "../StatFunctions/MatchStats";
import { FullMatchTable } from "../StatFunctions/TableFunctions";
import errImg from "../images/error.jpg";
import { getMatchById } from "../data/utils";

export default function MatchViewer(props) {
  let match = getMatchById(props.matchId);
  const [selectedScramble, setSelectedScramble] = useState(null);

  if (!match) {
    return (
      <>
        <h1>Match Not Found</h1>
        <img className="errImg" alt="Error" src={errImg} />
      </>
    );
  }

  const rawDate = new Date(match.matchDateTime);
  const date = rawDate.toLocaleDateString();
  const time = rawDate.toLocaleTimeString();
  const setsWonT1 = getSetsWon(1, match);
  const setsWonT2 = getSetsWon(2, match);

  return (
    <>
      <h2>
        {"[" + setsWonT1 + "] "}
        <a href={`/teamstatistics/${match.team1.teamName}`}>
          {match.team1.teamName}
        </a>
        {" vs "}
        <a href={`/teamstatistics/${match.team2.teamName}`}>
          {match.team2.teamName}
        </a>
        {" [" + setsWonT2 + "]"}
      </h2>
      <h2>{date + " at " + time}</h2>
      {
        <FullMatchTable
          match={match}
          selectedScramble={selectedScramble}
          setSelectedScramble={setSelectedScramble}
        />
      }
    </>
  );
}
