function getSetsWon(teamName, match) {
  let setsWon = 0;
  let team1solves;
  let team2solves;
  if (match.team1.teamName === teamName) {
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
        setsWon++;
      }
    }
  } else if (match.team2.teamName === teamName) {
    for (let i = 0; i < 3; i++) {
      team1solves = 0;
      team2solves = 0;
      for (let j = 0; j < 7; j++) {
        if (match.team1.times[i][j] === undefined || match.team2.times[i][j] === undefined) {
          break;
        }
        if (match.team2.times[i][j] < match.team1.times[i][j]) {
          team2solves++;
        } else if (match.team1.times[i][j] > match.team2.times[i][j]) {
          team1solves++;
        }
      }
      if (team1solves < team2solves) {
        setsWon++;
      }
    }
  }
  return setsWon;
}

function didWin (teamName, match) {
  if (match.team1.teamName === teamName) {
    return getSetsWon(teamName, match) > getSetsWon(match.team2.teamName, match);
  } else if (match.team2.teamName === teamName) {
    return getSetsWon(teamName, match) > getSetsWon(match.team1.teamName, match);
  }
  return false;
}

export {getSetsWon, didWin};