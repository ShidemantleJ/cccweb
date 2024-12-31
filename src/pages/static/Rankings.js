import React from "react";
import data from "../../data/match-data.json";
import "../../components/MatchViewer.css";

const getSortedTeams = () => {
  const teamTimesMap = new Map();
  for (let i = 0; i < data.matches.length; i++) {
    let team1times = [];
    let team2times = [];
    data.matches[i].team1.times.forEach((matchup) => {
      matchup.forEach((time) => {
        team1times.push(time);
      });
    });
    data.matches[i].team2.times.forEach((matchup) => {
      matchup.forEach((time) => {
        team2times.push(time);
      });
    });
    const team1name = data.matches[i].team1.teamName;
    const team2name = data.matches[i].team2.teamName;

    // Add or initialize times for team 1
    if (!teamTimesMap.has(team1name)) {
      teamTimesMap.set(team1name, []);
    }
    teamTimesMap.get(team1name).push(...team1times);

    // Add or initialize times for team 2
    if (!teamTimesMap.has(team2name)) {
      teamTimesMap.set(team2name, []);
    }
    teamTimesMap.get(team2name).push(...team2times);
  }

  for (const [team, times] of teamTimesMap) {
    const average =
      times.filter((time) => time !== -1).reduce((sum, time) => sum + time, 0) /
      times.filter((time) => time !== -1).length;
    teamTimesMap.set(team, average);
    teamTimesMap.set(team, average);
  }

  const sortedIndividuals = Array.from(teamTimesMap.entries()).sort(
    (a, b) => a[1] - b[1]
  );

  return sortedIndividuals;
};

const getSortedIndividuals = () => {
  const individualTimesMap = new Map();
  data.matches.forEach((match) => {
    for (
      let matchupIndex = 0;
      matchupIndex < match.team1.times.length;
      matchupIndex++
    ) {
      const name = match.team1.names[matchupIndex];
      const times = match.team1.times[matchupIndex];
      if (!individualTimesMap.has(name)) individualTimesMap.set(name, []);
      individualTimesMap.get(name).push(...times);
    }
    for (
      let matchupIndex = 0;
      matchupIndex < match.team2.times.length;
      matchupIndex++
    ) {
      const name = match.team2.names[matchupIndex];
      const times = match.team2.times[matchupIndex];
      if (!individualTimesMap.has(name)) individualTimesMap.set(name, []);
      individualTimesMap.get(name).push(...times);
    }
  });

  for (const [individual, times] of individualTimesMap) {
    const average =
      times.filter((time) => time !== -1).reduce((sum, time) => sum + time, 0) /
      times.filter((time) => time !== -1).length;
    individualTimesMap.set(individual, average);
    individualTimesMap.set(individual, average);
  }

  const sortedIndividuals = Array.from(individualTimesMap.entries()).sort(
    (a, b) => a[1] - b[1]
  );

  return sortedIndividuals;
};

export const Rankings = () => {
  const sortedTeams = getSortedTeams();
  const sortedIndividuals = getSortedIndividuals();
  return (
    <div>
      <h2>Team Rankings</h2>

      <table className="match-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Average Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map(([team, time], index) => (
            <tr
              key={team}
              onClick={() => (window.location.href = `/teamstatistics/${team}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{team}</td>
              <td>{time.toFixed(2)} seconds</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Individual Rankings</h2>

      <table className="match-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Average Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedIndividuals.map(([individual, time], index) => (
            <tr
              key={individual}
              onClick={() =>
                (window.location.href = `/competitorstatistics/${individual}`)
              }
              style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{individual}</td>
              <td>{time.toFixed(2)} seconds</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
