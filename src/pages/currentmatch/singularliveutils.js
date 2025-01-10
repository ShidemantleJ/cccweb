import { database } from "../../firebase";
import { ref, get, update, set, onValue } from "firebase/database";
import { getSetsWon, getSolvesWon } from "../../StatFunctions/MatchStats";
import axios from "axios";

const db = database;

// Function to get a value from the database
const getDatabaseValue = async (path) => {
  const snapshot = await get(ref(db, path));
  return snapshot.exists() ? snapshot.val() : null;
};

const mean = (arr) =>
  arr.length === 0
    ? 0
    : Number((arr.reduce((sum, val) => sum + val, 0) / arr.length).toFixed(2));

const sendPatchRequest = async (data) => {
  const SLKey = await getDatabaseValue("SLKey");
  const SINGULAR_API_BASE_URL =
    "https://app.singular.live/apiv2/controlapps/" + SLKey + "/control";
  try {
    await axios.patch(SINGULAR_API_BASE_URL, JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Patch request successful:", data);
  } catch (error) {
    console.error("Patch request failed:", error.message || error);
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
    let [
      currentMatch,
      team1Name,
      team2Name,
      indexToDisplay,
      team1Names,
      team2Names,
      team1Times,
      team2Times,
    ] = await Promise.all([
      getDatabaseValue("/currentMatch"),
      getDatabaseValue("/currentMatch/team1/teamName"),
      getDatabaseValue("/currentMatch/team2/teamName"),
      getDatabaseValue("/currentMatch/indexToDisplay"),
      getDatabaseValue("/currentMatch/team1/names"),
      getDatabaseValue("/currentMatch/team2/names"),
      getDatabaseValue("/currentMatch/team1/times"),
      getDatabaseValue("/currentMatch/team2/times"),
    ]);

    if (!indexToDisplay) indexToDisplay = 0;

    const team1Competitor = team1Names?.[indexToDisplay] || "Unknown";
    const team2Competitor = team2Names?.[indexToDisplay] || "Unknown";

    // Solve calculations
    const currentSetTeam1 = team1Times?.[indexToDisplay] || [];
    const currentSetTeam2 = team2Times?.[indexToDisplay] || [];
    let solvesWon = [0, 0];

    // currentSetTeam1.forEach((solve, i) => {
    //   if (solve < currentSetTeam2[i] && currentSetTeam2[i] !== undefined)
    //     solvesWon[0]++;
    //   else if (solve > currentSetTeam2[i] && currentSetTeam2[i] !== undefined)
    //     solvesWon[1]++;
    // });
    solvesWon[0] = getSolvesWon(1, currentMatch, indexToDisplay);
    solvesWon[1] = getSolvesWon(2, currentMatch, indexToDisplay);

    // Set calculations
    let setsWon = [0, 0];
    setsWon[0] = getSetsWon(1, currentMatch);
    setsWon[1] = getSetsWon(2, currentMatch);

    // const totalSets = Math.min(
    //   team1Times?.length || 0,
    //   team2Times?.length || 0
    // );
    // for (let i = 0; i < totalSets; i++) {
    //   let team1Solves = 0,
    //     team2Solves = 0;
    //   for (
    //     let j = 0;
    //     j < Math.min(team1Times[i]?.length || 0, team2Times[i]?.length || 0);
    //     j++
    //   ) {
    //     if (team1Times[i][j] < team2Times[i][j]) team1Solves++;
    //     else if (team1Times[i][j] > team2Times[i][j]) team2Solves++;
    //   }
    //   if (team1Solves >= 4) setsWon[0]++;
    //   else if (team2Solves >= 4) setsWon[1]++;
    // }

    // Check for changes in setsWon and call animateSetWon
    if (
      setsWon[0] !== previousSetsWon[0] ||
      setsWon[1] !== previousSetsWon[1]
    ) {
      console.log("SetsWon changed:", previousSetsWon, "->", setsWon);
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
        subCompositionName: "mainComposition",
        payload: timesPayload,
      },
    ];

    await sendPatchRequest(payloadData);
    console.log("All updates sent successfully.");
  } catch (error) {
    console.error(
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

// Function to attach listeners
const attachEventListeners = () => {
  console.log("event listeners attached");
  // Listener for refresh
  onValue(ref(db, "/currentMatch/refresh"), async (snapshot) => {
    console.log("Data changed:", snapshot.val());

    const killSwitch = await getDatabaseValue("/currentMatch/killSwitch");
    if (!killSwitch || killSwitch === undefined) {
      await gatherAndSendUpdates();
    }
  });

  // Listener for indexToDisplay
  onValue(ref(db, "/currentMatch/indexToDisplay"), async (snapshot) => {
    const killSwitch = await getDatabaseValue("/currentMatch/killSwitch");
    if (!killSwitch || killSwitch === undefined) {
      await gatherAndSendUpdates();
    }
  });

  // Listener for team1 times
  onValue(ref(db, "/currentMatch/team1/times"), async (snapshot) => {
    const killSwitch = await getDatabaseValue("/currentMatch/killSwitch");
    if (!killSwitch || killSwitch === undefined) {
      await gatherAndSendUpdates();
    }
  });

  // Listener for team2 times
  onValue(ref(db, "/currentMatch/team2/times"), async (snapshot) => {
    const killSwitch = await getDatabaseValue("/currentMatch/killSwitch");
    if (!killSwitch || killSwitch === undefined) {
      console.log("killswitch =", killSwitch);
      await gatherAndSendUpdates();
    }
  });
};

export { attachEventListeners };
