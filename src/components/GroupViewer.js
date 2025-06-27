import React from "react";
import data from "../data/match-data.json";
import getMeanSolve from "../StatFunctions/IndividualStats";
import "./TeamViewer.css";
import { didWin, getTeamNum } from "../StatFunctions/MatchStats";
import MatchWidget from "./MatchWidget";

function TeamViewer(props) {
  const matchName = props.matchName;
  const matches = data.matches.filter((match) =>
    props.matchIds.includes(match.matchId)
  );

  if (!matches) {
    return <h1>Team not found</h1>;
  }

  matches.sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));

  return (
    <div>
      <h1>{matchName}</h1>
      <h2>Matches: </h2>
      <div className="match-display">
        {matches.length === 0 && <p>No matches found</p>}
        {matches.map((match) => (
          <MatchWidget match={match} />
        ))}
      </div>
    </div>
  );
}

export default TeamViewer;
