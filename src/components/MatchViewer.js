import React, {useState, useEffect} from 'react';
import './MatchViewer.css';
import data from '../data/1.json';

function tableHeader(i) {
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

function matchupData(i) {
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

function retTable() {
  const elements = [];

  for (let i = 0; i < 3; i++) {
    elements.push(
      <table className="match-table">
        <thead>
        {tableHeader(i)}
        </thead>
        <tbody>
        {matchupData(i)}
        </tbody>
      </table>
    )
  }
  return elements;
}
function MatchViewer () {
  return (
    <>
      <h1>{data.at(0)['Team #1 Name'] + " vs " + data.at(0)['Team #2 Name']}</h1>
      {retTable()}
    </>
  );
}

export default MatchViewer;