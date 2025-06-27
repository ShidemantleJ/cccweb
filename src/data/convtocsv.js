const data = require("./match-data.json");

let csvOutput =
  "Match ID,Date and Time,Team Name,Competitor Name,Time,Solve #,Set #\n";

data.matches.forEach((match) => {
  match.team1.times.forEach((set, setIndex) => {
    set.forEach((solve, solveIndex) => {
      csvOutput +=
        match.matchId +
        "," +
        match.matchDateTime +
        "," +
        match.team1.teamName +
        "," +
        match.team1.names[setIndex] +
        "," +
        solve +
        "," +
        (solveIndex + 1) +
        "," +
        (setIndex + 1) +
        "\n";
    });
  });
  match.team2.times.forEach((set, setIndex) => {
    set.forEach((solve, solveIndex) => {
      csvOutput +=
        match.matchId +
        "," +
        match.matchDateTime +
        "," +
        match.team2.teamName +
        "," +
        match.team2.names[setIndex] +
        "," +
        solve +
        "," +
        (solveIndex + 1) +
        "," +
        (setIndex + 1) +
        "\n";
    });
  });
});

console.log(csvOutput);
