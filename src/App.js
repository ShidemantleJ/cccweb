import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Brackets from './pages/Brackets';
import Matches from './pages/Matches';
import TeamStatistics from './pages/TeamStatistics'
import Statistics from './pages/Statistics';
import CompetitorStatistics from './pages/CompetitorStatistics';

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
      </Routes>
    </Router>
  );
}

export default App;
