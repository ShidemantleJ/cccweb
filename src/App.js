import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Brackets from './pages/Brackets';
import Matches from './pages/Matches';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/brackets" element={<Brackets />} />
      </Routes>
    </Router>
  );
}

export default App;
