import React, { useEffect } from 'react';

const URL = 'https://raw.githubusercontent.com/ShidemantleJ/cccweb/master/public/json/data.json';

async function render() {
  let data;
  try {
    data = await fetch(URL).then(res => res.json());
  }
  catch (e) {
    console.error(e);
  }

  window.bracketsViewer.render({
    stages: data.stage,
    matches: data.match,
    matchGames: data.match_game,
    participants: data.participant,
  });
}

function Brackets() {
  useEffect(() => {
    try {
      render();
    }
    catch (e) {
      console.error(e);
    }
  }, []);
  
  return <div className="brackets-viewer"></div>
}

export default Brackets;