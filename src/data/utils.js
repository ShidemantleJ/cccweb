import data from "./match-data.json";

export function getMatchById(matchIdToFind) {
  return data.matches.find((match) => match.matchId === matchIdToFind);
}