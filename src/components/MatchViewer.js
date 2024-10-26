import React, { useState, useEffect } from 'react';
import './MatchViewer.css';

function tableHeader(i, data) {
  return (
    <>
    <tr>
      <th>{data.at(i*7)['Competitor #1 Name']}</th>
      <th>{data.at(i*7)['Competitor #2 Name']}</th>
      <th>Scramble</th>
    </tr>
    </>
  )
}

function matchupData(i, data) {
  const elements = [];
  for (let j = 0; j < 7; j++) {
    if (data.at(i*7+j)['Competitor #1 Time'] === "" || data.at(i*7+j)['Competitor #2 Time'] === "") {
      break;
    }
    let team1Won = data.at(i*7+j)['Competitor #1 Time'] < data.at(i*7+j)['Competitor #2 Time'] ? 1 : 0;
    elements.push(
      <tr>
        <td className={team1Won ? 'won' : 'lost'}>{data.at(i*7+j)['Competitor #1 Time']}</td>
        <td className={team1Won ? 'lost' : 'won'}>{data.at(i*7+j)['Competitor #2 Time']}</td>
        <td>{data.at(i*7+j)['Scramble']}</td>
      </tr>
    )
  }
  return elements;
}

function retTable(data) {
  const elements = [];

  for (let i = 0; i < 3; i++) {
    elements.push(
      <table className="match-table">
        <thead>
        {tableHeader(i, data)}
        </thead>
        <tbody>
        {matchupData(i, data)}
        </tbody>
      </table>
    )
  }
  return elements;
}

function MatchViewer (props) {
  const [data, setData] = useState(null);

  async function fetchData() {
    const response = await fetch('/data/' + props.matchId + '.json');
    const result = await response.json();
    setData(result);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <h1>{data.at(0)['Team #1 Name'] + " vs " + data.at(0)['Team #2 Name']}</h1>
      <h2>{data.at(0)['Match Date and Time']}</h2>
      {retTable(data)}
    </>
  );
}

export default MatchViewer;