import React, {useEffect, useState} from 'react';
import data from '../../data/bracket_db.json'
import { useNavigate } from 'react-router-dom';
import './bracketstyle.css';

const Brackets = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.bracketsViewer.render({
      stages: data.stage,
      matches: data.match,
      participants: data.participant,
      matchGames: data.match_game
    }, {
      onMatchClick: (clickedMatch) => {
        console.log("a match was clicked", String(clickedMatch.id));
        navigate(`/matches/${clickedMatch.id}`);
      }
    }
    );
  }, [navigate]);

  return (
  <>
  <div className="home-header">
    <h1>Single Elimination Bracket</h1>
    <p>Click on any completed match to see detailed match info</p>
  </div>
  <div>
    <div className="brackets-viewer"></div>
  </div>
  </>
  );
}
export default Brackets;