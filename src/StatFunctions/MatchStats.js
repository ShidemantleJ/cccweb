function getSetsWon(teamName, match) {
  let team1solves;
  let team2solves;
  let team1sets = 0;
  let team2sets = 0;

    for (let i = 0; i < 3; i++) {
      team1solves = 0;
      team2solves = 0;
      for (let j = 0; j < 7; j++) {
        let team1Won = (match.team1.times[i][j] < match.team2.times[i][j]) && match.team1.times[i][j] !== -1 ? 1 : 0;

        team1Won ? team1solves++ : team2solves++;
      }
      team1solves > team2solves ? team1sets++ : team2sets++;
    }
    return teamName === match.team1.teamName ? team1sets : team2sets;
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