import React from 'react';

function tableHeader(match, i) {
    return (
      <>
      <tr>
        <th><a href={`/competitorstatistics/${match.team1.names.at(i)}`}>{match.team1.names.at(i)}</a></th>
        <th><a href={`/competitorstatistics/${match.team2.names.at(i)}`}>{match.team2.names.at(i)}</a></th>
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
      let t1currTime = match.team1.times[i][j];
      let t2currTime = match.team2.times[i][j];
  
      let team1Won = (match.team1.times[i][j] < match.team2.times[i][j]) && match.team1.times[i][j] !== -1 ? 1 : 0;
      elements.push(
        <React.Fragment key={`match-${i}-${j}`}>
          <tr className="match-row" onClick={() => setSelectedScramble(selectedScramble === match.scrambles[i][j] ? 0 : match.scrambles[i][j])}>
            <td className={team1Won ? 'won' : 'lost'}>{t1currTime === -1 ? "DNF" : t1currTime.toFixed(2)}</td>
            <td className={team1Won ? 'lost' : 'won'}>{t2currTime === -1 ? "DNF" : t2currTime.toFixed(2)}</td>
            <td>{match.scrambles[i][j]}</td>
          </tr>
          {selectedScramble === match.scrambles[i][j] && (selectedScramble !== undefined || selectedScramble !== "") && (
            <tr key={`scramble-${i}-${j}`}>
              <td colSpan="3"><scramble-display scramble={match.scrambles[i][j]}></scramble-display></td>
            </tr>
          )}
        </React.Fragment>
      )
    }
    return elements;
  }

function FullMatchTable(props) {
  const match = props.match;
  const selectedScramble = props.selectedScramble;
  const setSelectedScramble = props.setSelectedScramble;

  const elements = [];
  
  for (let i = 0; i < 3; i++) {
    elements.push(
      <table key={`table-${i}`} className="match-table">
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

function MatchupTable(props) {
  const competitorName = props.competitorName;
  const match = props.match;
  const selectedScramble = props.selectedScramble;
  const setSelectedScramble = props.setSelectedScramble;

  const elements = [];
  const team1index = match.team1.names.indexOf(competitorName);
  const team2index = match.team2.names.indexOf(competitorName);
  let index = null;

  if (team1index !== -1) index = team1index;
  else if (team2index !== -1) index = team2index;
  else return null;

  elements.push(
    <table key="matchup-table" className="match-table">
      <thead>
      {tableHeader(match, index)}
      </thead>
      <tbody>
      {matchupData(match, index, setSelectedScramble, selectedScramble)}
      </tbody>
    </table>
  )

  return elements;
}

export {tableHeader, matchupData, MatchupTable, FullMatchTable};