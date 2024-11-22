import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/static/Home';
import About from './pages/static/About';
import Contact from './pages/static/Contact';
import Brackets from './pages/static/Brackets';
import Matches from './pages/static/Matches';
import TeamStatistics from './pages/static/TeamStatistics'
import Statistics from './pages/static/Statistics';
import CompetitorStatistics from './pages/static/CompetitorStatistics';
import Judge from './pages/currentmatch/Judge';
import Operator from './pages/currentmatch/Operator';
import Login from './pages/static/Login';
import Team from './pages/currentmatch/Team';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/matches/:matchId" element={<Matches />} />
        <Route path="/teamstatistics/:teamName" element={<TeamStatistics />} />
        <Route path="/brackets" element={<Brackets />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/teamstatistics" element={<Statistics />} />
        <Route path="/competitorstatistics" element={<Statistics />} />
        <Route path="/competitorstatistics/:competitorName" element={<CompetitorStatistics />} />
        <Route path="/judge/:team" element={<Judge />} />
        <Route path="/judge" element={<Judge />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/team/:teamNum" element={<Team />} />
      </Routes>
    </Router>
  );
}

export default App;
