import React, {useState} from 'react';
import data from "../data/match-data.json";
import {ScrambleDisplay} from 'scramble-display';
import './MatchViewer.css';
import {getSetsWon} from '../StatFunctions/MatchStats'
import {retTable} from '../StatFunctions/TableFunctions';

function MatchViewer (props) {
  const match = data.matches.find(match => match.matchId === props.matchId);
  const [selectedScramble, setSelectedScramble] = useState(null);

  if (!match) {
    return (
      <>
      <h1>Match Not Found</h1>
      <img className="errImg" alt="error image" src="/images/error.jpg" />
      </>
    );
  }

  const rawDate = new Date(match.matchDateTime);
  const date = rawDate.toLocaleDateString();
  const time = rawDate.toLocaleTimeString();
  const setsWonT1 = getSetsWon(match.team1.teamName, match);
  const setsWonT2 = getSetsWon(match.team2.teamName, match);

  return (
    <>
      <h1>{"[" + setsWonT1 + "] " + match.team1.teamName + " vs " + match.team2.teamName + " [" + setsWonT2 + "]"}</h1>
      <h2>{date + " at " + time}</h2>
      {retTable(match, setSelectedScramble, selectedScramble)}
    </>
  );
}

export default MatchViewer;