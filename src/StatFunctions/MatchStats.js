function getTeamNum(teamName, match) {
  if (teamName === match.team1.teamName) return 1;
  if (teamName === match.team2.teamName) return 2;
  return null;
}

function getSetsWon(teamNum, match) {
  try {
    let oppTeamNum = teamNum === 1 ? 2 : 1;
    let currentTeamSets = 0;
    let opponentSets = 0;

    for (let i = 0; i < 3; i++) {
      if (getSolvesWon(teamNum, match, i) >= 4) {
        currentTeamSets++;
      } else {
        opponentSets++;
      }
    }
    return currentTeamSets;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

function getSolvesWon(teamNum, match, matchupIndex) {
  try {
    let solvesWon = [0, 0];

    match.team1.times[matchupIndex].forEach((t1time, i) => {
      const t2time = match?.team2?.times?.[matchupIndex]?.[i];
      if (t2time === undefined) return;
      else if (t1time === -1) solvesWon[1]++;
      else if (t2time === -1) solvesWon[0]++;
      else if (t1time < t2time) solvesWon[0]++;
      else if (t1time > t2time) solvesWon[1]++;
    });
    /*
    console.log(
      "For index ",
      matchupIndex,
      " team 1 won ",
      solvesWon[0],
      " solves and team 2 won ",
      solvesWon[1]
    );
    */
    return teamNum === 1 ? solvesWon[0] : solvesWon[1];
  } catch (e) {
    return 0;
  }
}

function didWin(teamNum, match) {
  if (teamNum === 1) {
    return getSetsWon(1, match) > getSetsWon(2, match);
  } else if (teamNum === 2) {
    return getSetsWon(2, match) > getSetsWon(1, match);
  }
  return false;
}

export { getSetsWon, didWin, getSolvesWon, getTeamNum };
