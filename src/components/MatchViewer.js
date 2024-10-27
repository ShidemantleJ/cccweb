import React, {useState} from 'react';
import data from "../data/match-data.json";
import { ScrambleDisplay } from 'scramble-display';
import './MatchViewer.css';

function getResult(match) {
  let setsWon = [0, 0]
  let team1solves = 0;
  let team2solves = 0;
  for (let i = 0; i < 3; i++) {
    team1solves = 0;
    team2solves = 0;
    for (let j = 0; j < 7; j++) {
      if (match.team1.times[i][j] === undefined || match.team2.times[i][j] === undefined) {
        break;
      }
      if (match.team1.times[i][j] < match.team2.times[i][j]) {
        team1solves++;
      } else if (match.team1.times[i][j] > match.team2.times[i][j]) {
        team2solves++;
      }
    }
    if (team1solves > team2solves) {
      setsWon[0]++;
    } else if (team2solves > team1solves) {
      setsWon[1]++;
    }
  }
  return setsWon;
}

function tableHeader(match, i) {
  return (
    <>
    <tr>
      <th>{match.team1.names.at(i)}</th>
      <th>{match.team2.names.at(i)}</th>
      <th>Scramble</th>
    </tr>
    </>
  )
}

function matchupData(match, i, setSelectedScramble, selectedScramble) {
  const elements = [];
  for (let j = 0; j < 7; j++) {
    if (match.team1.times[i][j] === undefined || match.team2.times[i][j] === undefined) {
      break;
    }
    let t1min = match.team1.times[i].indexOf(Math.min(...match.team1.times[i]));
    let t1max = match.team1.times[i].indexOf(Math.max(...match.team1.times[i]));
    let t1currTime = match.team1.times[i][j];
    let t2min = match.team2.times[i].indexOf(Math.min(...match.team2.times[i]));
    let t2max = match.team2.times[i].indexOf(Math.max(...match.team2.times[i]));
    let t2currTime = match.team2.times[i][j];

    let team1Won = match.team1.times[i][j] < match.team2.times[i][j] ? 1 : 0;
    elements.push(
      <>
        <tr className="match-row" onClick={() => setSelectedScramble(selectedScramble === match.scrambles[i][j] ? 0 : match.scrambles[i][j])}>
          <td className={team1Won ? 'won' : 'lost'}>{j === t1max || j === t1min ? "(" + t1currTime + ")" : t1currTime}</td>
          <td className={team1Won ? 'lost' : 'won'}>{j === t2max || j === t2min ? "(" + t2currTime + ")" : t2currTime}</td>
          <td>{match.scrambles[i][j]}</td>
        </tr>
        {selectedScramble === match.scrambles[i][j] && selectedScramble !== undefined && (
          <tr>
            <td colSpan="3"><scramble-display scramble={match.scrambles[i][j]}></scramble-display></td>
          </tr>
        )}
      </>
    )
  }
  return elements;
}
function retTable(match, setSelectedScramble, selectedScramble) {
  const elements = [];

  for (let i = 0; i < 3; i++) {
    elements.push(
      <table className="match-table">
        <thead>
        {tableHeader(match, i)}
        </thead>
        <tbody>
        {matchupData(match, i, setSelectedScramble, selectedScramble)}
        </tbody>
      </table>
    )
  }
  return elements;
}

function MatchViewer (props) {
  const match = data.matches.find(match => match.matchId === props.matchId);
  const [selectedScramble, setSelectedScramble] = useState(null);

  if (!match) {
    return (
      <>
      <h1>Match Not Found</h1>
      <img className="errImg" src="/images/error.jpg" />
      </>
    );
  }

  const rawDate = new Date(match.matchDateTime);
  const date = rawDate.toLocaleDateString();
  const time = rawDate.toLocaleTimeString();
  const setsWon = getResult(match);

  return (
    <>
      <h1>{"[" + setsWon[0] + "] " + match.team1.teamName + " vs " + match.team2.teamName + " [" + setsWon[1] + "]"}</h1>
      <h2>{date + " at " + time}</h2>
      {retTable(match, setSelectedScramble, selectedScramble)}
    </>
  );
}

export default MatchViewer;