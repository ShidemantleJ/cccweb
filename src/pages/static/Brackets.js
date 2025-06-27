import React, { useEffect, useState } from "react";
import data from "../../data/bracket_db.json";
import { useNavigate } from "react-router-dom";
import "./bracketstyle.css";
import { getMatchById } from "../../data/utils";

const Brackets = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.bracketsViewer.render(
      {
        stages: data.stage,
        matches: data.match,
        participants: data.participant,
        matchGames: data.match_game,
      },
      {
        onMatchClick: (clickedMatch) => {
          if (clickedMatch.id === 30) {
            navigate(`/matches/final`);
          } else if (getMatchById(String(clickedMatch.id)) !== undefined)
            navigate(`/matches/${clickedMatch.id}`);
          else
            alert(
              "This match has not occurred, or match data has not been added"
            );
        },
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
};
export default Brackets;
