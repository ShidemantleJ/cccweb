import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/static/Home";
import About from "./pages/static/About";
import Contact from "./pages/static/Contact";
import Brackets from "./pages/static/Brackets";
import Matches from "./pages/static/Matches";
import TeamStatistics from "./pages/static/TeamStatistics";
import Statistics from "./pages/static/Statistics";
import CompetitorStatistics from "./pages/static/CompetitorStatistics";
import Judge from "./pages/currentmatch/Judge";
import Operator from "./pages/currentmatch/Operator";
import Login from "./pages/static/Login";
import Team from "./pages/currentmatch/Team";
import StreamStats from "./pages/currentmatch/StreamStats";
import Footer from "./components/Footer";
import { Box, CssBaseline } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";

function App() {
  return (
    <>
      <CssBaseline />
      <Analytics />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />
          <Box sx={{ paddingTop: "64px", flex: "1 0 auto" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/matches/:matchId" element={<Matches />} />
              <Route
                path="/teamstatistics/:teamName"
                element={<TeamStatistics />}
              />
              <Route path="/bracket" element={<Brackets />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/teamstatistics" element={<Statistics />} />
              <Route path="/competitorstatistics" element={<Statistics />} />
              <Route
                path="/competitorstatistics/:competitorName"
                element={<CompetitorStatistics />}
              />
              <Route path="/judge/:team" element={<Judge />} />
              <Route path="/judge" element={<Judge />} />
              <Route path="/operator" element={<Operator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/team/:teamNum" element={<Team />} />
              <Route path="/streamstats/:element" element={<StreamStats />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </>
  );
}
export default App;
