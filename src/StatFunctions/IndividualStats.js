import data from "../data/match-data.json";

function getMeanSolve(name) {
    let totalTime = 0;
    let solvesCount = 0;
    for (let i = 0; i < data.matches.length; i++) {
        for (let j = 0; j < 3; j++) {
            if (data.matches[i].team1.names[j] === name) {
                for (let k = 0; k < 7; k++) {
                    if (data.matches[i].team1.times[j][k] !== undefined && data.matches[i].team1.times[j][k] !== -1) {
                        totalTime += data.matches[i].team1.times[j][k];
                        solvesCount++;
                    }
                }
                break;
            }
            else if (data.matches[i].team2.names[j] === name) {
                for (let k = 0; k < 7; k++) {
                    if (data.matches[i].team2.times[j][k] !== undefined && data.matches[i].team2.times[j][k] !== -1) {
                        totalTime += data.matches[i].team2.times[j][k];
                        solvesCount++;
                    }
                }
                break;
            }
        }
    }
    return totalTime / solvesCount;
}

export default getMeanSolve;