// pages/Home.js
import React from "react";
import {
  Box,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import data from "../../data/match-data.json";
import MatchWidget from "../../components/MatchWidget";

function renderMatches(numOfMatches) {
  return data.matches
    .sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime))
    .slice(0, numOfMatches)
    .map((match) => <MatchWidget match={match} />);
}
function renderTopVideo() {
  const mostRecentMatch = data.matches
    .sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime))
    .at(0);

  return (
    mostRecentMatch?.watchLink && (
      <div
        style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}
      >
        <iframe
          src={`https://youtube.com/embed/${mostRecentMatch.watchLink}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "15px",
          }}
        />
      </div>
    )
  );
}

const Home = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        px: { xs: 2, md: 12 },
        py: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Paper sx={{ p: 2, m: 2, flex: "2" }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: "bold", fontSize: "1.8rem", py: 2 }}
          >
            Latest Match VOD
          </Typography>
          <Box sx={{ pb: 2 }}>
            {renderTopVideo()}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF0000",
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
              href="https://www.youtube.com/channel/UCtDRPTxvUXYkjRDxAdNicHw?sub_confirmation=1"
            >
              Subscribe on YouTube
            </Button>
            <Button
              variant="contained"
              sx={{}}
              href="https://docs.google.com/spreadsheets/d/18wHPsu8PX3wEHolvARbB_fVTgMpPWGV35Lg600wYdt4/edit?usp=sharing"
            >
              View Team Rosters
            </Button>
          </Box>
        </Paper>
        <Paper sx={{ p: 2, m: 2, flex: { xs: "1", sm: "1" } }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", fontSize: "1.4rem", py: 0 }}
          >
            Recent Match Stats
          </Typography>
          {renderMatches(5)}
        </Paper>
      </Box>
    </Box>
  );
};export default Home;