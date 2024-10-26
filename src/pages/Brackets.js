import React, {useEffect} from 'react';
import data from '../data/bracket_db.json'

async function render() {
  window.bracketsViewer.render({
    stages: data.stage,
    matches: data.match,
    participants: data.participant,
    matchGames: data.match_game,
  }, {
    onMatchClick: match => console.log("a match was clicked", match),
  }
  );
}

const Brackets = () => {
    useEffect(() => {
      render();
    }, []);
    return <div className="brackets-viewer"></div>
};

export default Brackets;