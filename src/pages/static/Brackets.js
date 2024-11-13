import React, {useEffect, useState} from 'react';
import data from '../../data/bracket_db.json'
import { useNavigate } from 'react-router-dom';
import './Home.css'

const Brackets = () => {
  const [match, setMatch] = useState(null);
  const [matchClicked, setMatchClicked] = useState(false);
  const navigate = useNavigate();

  function toggleMatchClicked() {
    setMatchClicked(!matchClicked);
  }

  useEffect(() => {
    window.bracketsViewer.render({
      stages: data.stage,
      matches: data.match,
      participants: data.participant,
      matchGames: data.match_game
    }, {
      onMatchClick: (clickedMatch) => {
        console.log("a match was clicked", String(clickedMatch.id));
        setMatch(clickedMatch);
        navigate(`/matches/${clickedMatch.id}`);
      }
    }
    );
  }, [navigate]);

  return (
  <>
  <div className="home-header">
    <h1>32 Team Single Elimination Bracket</h1>
    <p>Click on any completed match to see detailed match info</p>
  </div>
    <div className="brackets-viewer"></div>
  </>
  );
}

export default Brackets;