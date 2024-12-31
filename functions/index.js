const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.database();

const SINGULAR_API_BASE_URL =
  "https://app.singular.live/apiv2/controlapps/2jdS3xtIliy7qjDWKe1fDe/control";

const getDatabaseValue = async (path) => (await db.ref(path).get()).val();

const mean = (arr) =>
  arr.length === 0
    ? 0
    : Number((arr.reduce((sum, val) => sum + val, 0) / arr.length).toFixed(2));

const sendPatchRequest = async (data) => {
  try {
    await axios.patch(SINGULAR_API_BASE_URL, JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    logger.log("Patch request successful:", data);
  } catch (error) {
    logger.error("Patch request failed:", error.message || error);
  }
};

const generateTimePayload = (timeArray, teamNum) => {
  if (!Array.isArray(timeArray)) return {};
  const payload = {};
  for (let i = 0; i < 7; i++) {
    if (i > timeArray.length - 1) payload[`team ${teamNum} time ${i + 1}`] = "";
    else
      payload[`team ${teamNum} time ${i + 1}`] =
        timeArray[i] === -1 ? "DNF" : timeArray?.[i]?.toFixed(2)?.toString();
  }
  payload[`team ${teamNum} mean`] = mean(timeArray).toString();
  return payload;
};

// Global state to track previous setsWon
let previousSetsWon = [0, 0];

async function gatherAndSendUpdates() {
  try {
    const [
      team1Name,
      team2Name,
      indexToDisplay,
      team1Names,
      team2Names,
      team1Times,
      team2Times,
    ] = await Promise.all([
      getDatabaseValue("/currentMatch/team1/teamName"),
      getDatabaseValue("/currentMatch/team2/teamName"),
      getDatabaseValue("/currentMatch/indexToDisplay"),
      getDatabaseValue("/currentMatch/team1/names"),
      getDatabaseValue("/currentMatch/team2/names"),
      getDatabaseValue("/currentMatch/team1/times"),
      getDatabaseValue("/currentMatch/team2/times"),
    ]);

    const team1Competitor = team1Names?.[indexToDisplay] || "Unknown";
    const team2Competitor = team2Names?.[indexToDisplay] || "Unknown";

    // Solve calculations
    const currentSetTeam1 = team1Times?.[indexToDisplay] || [];
    const currentSetTeam2 = team2Times?.[indexToDisplay] || [];
    let solvesWon = [0, 0];

    currentSetTeam1.forEach((solve, i) => {
      if (solve < currentSetTeam2[i] && currentSetTeam2[i] !== undefined)
        solvesWon[0]++;
      else if (solve > currentSetTeam2[i] && currentSetTeam2[i] !== undefined)
        solvesWon[1]++;
    });

    // Set calculations
    let setsWon = [0, 0];
    const totalSets = Math.min(
      team1Times?.length || 0,
      team2Times?.length || 0
    );
    for (let i = 0; i < totalSets; i++) {
      let team1Solves = 0,
        team2Solves = 0;
      for (
        let j = 0;
        j < Math.min(team1Times[i]?.length || 0, team2Times[i]?.length || 0);
        j++
      ) {
        if (team1Times[i][j] < team2Times[i][j]) team1Solves++;
        else if (team1Times[i][j] > team2Times[i][j]) team2Solves++;
      }
      if (team1Solves >= 4) setsWon[0]++;
      else if (team2Solves >= 4) setsWon[1]++;
    }

    // Check for changes in setsWon and call animateSetWon
    if (
      setsWon[0] !== previousSetsWon[0] ||
      setsWon[1] !== previousSetsWon[1]
    ) {
      logger.log("SetsWon changed:", previousSetsWon, "->", setsWon);
      animateSetWon(previousSetsWon, setsWon);
    }

    // Update the global state for setsWon
    previousSetsWon = setsWon;

    // Generate times payload
    const timesPayload = {
      ...generateTimePayload(currentSetTeam1, 1),
      ...generateTimePayload(currentSetTeam2, 2),
    };

    // Combine all payloads
    const payloadData = [
      {
        subCompositionName: "mainComposition",
        payload: {
          "Team 1 NAME": team1Name || "Unknown",
          "Team 2 NAME": team2Name || "Unknown",
          "Team 1 Competitor": team1Competitor,
          "Team 2 Competitor": team2Competitor,
          "Competitor 1 SOLVES WON": solvesWon[0],
          "Competitor 2 SOLVES WON": solvesWon[1],
          "Team 1 SETS WON": setsWon[0],
          "Team 2 SETS WON": setsWon[1],
        },
      },
      {
        subCompositionName: "match recap",
        payload: timesPayload,
      },
    ];

    await sendPatchRequest(payloadData);
    logger.log("All updates sent successfully.");
  } catch (error) {
    logger.error(
      "Error gathering and sending updates:",
      error.message || error
    );
  }
}

// function animates sets won
async function animateSetWon(previous, current) {
  const team1Won = current[0] > previous[0];
  const team2Won = current[1] > previous[1];
  let teamNum;
  if (team1Won) teamNum = 1;
  else if (team2Won) teamNum = 2;

  const startAnimationPayloadData = [
    {
      subCompositionName: `set won team ${teamNum}`,
      state: "In",
    },
  ];
  const endAnimationPayloadData = [
    {
      subCompositionName: `set won team ${teamNum}`,
      state: "Out1",
    },
  ];
  if (teamNum) {
    await sendPatchRequest(startAnimationPayloadData);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await sendPatchRequest(endAnimationPayloadData);
  }
}

// Event Listeners
exports.onRefresh = db.ref("/currentMatch/refresh").on("value", async () => {
  if (!getDatabaseValue("/currentMatch/killSwitch")) {
    await gatherAndSendUpdates();
  }
});

exports.onIndexToDisplay = db
  .ref("/currentMatch/indexToDisplay")
  .on("value", async () => {
    if (!getDatabaseValue("/currentMatch/killSwitch")) {
      await gatherAndSendUpdates();
    }
  });

exports.onTeam1TimeChange = db
  .ref("/currentMatch/team1/times")
  .on("value", async () => {
    if (!getDatabaseValue("/currentMatch/killSwitch")) {
      await gatherAndSendUpdates();
    }
  });

exports.onTeam2TimeChange = db
  .ref("/currentMatch/team2/times")
  .on("value", async () => {
    if (!getDatabaseValue("/currentMatch/killSwitch")) {
      logger.log("killswitch = ", getDatabaseValue("/currentMatch/killSwitch"));
      await gatherAndSendUpdates();
    }
  });
