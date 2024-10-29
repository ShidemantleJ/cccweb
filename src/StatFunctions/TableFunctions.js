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

function returnMatchupTable(match, setSelectedScramble, selectedScramble, competitorName) {

  const elements = [];
  const team1index = match.team1.names.indexOf(competitorName);
  const team2index = match.team2.names.indexOf(competitorName);
  console.log(team1index);
  let index = null;

  if (team1index !== -1) index = team1index;
  else if (team2index !== -1) index = team2index;
  else return null;

  elements.push(
    <table className="match-table">
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

// export all functions
export {retTable, tableHeader, matchupData, returnMatchupTable};