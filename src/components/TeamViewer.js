import React from 'react';
import data from '../data/match-data.json';
import getMeanSolve from "../StatFunctions/IndividualStats";
import './TeamViewer.css';
import { didWin } from '../StatFunctions/MatchStats';
import MatchWidget from './MatchWidget';

function TeamViewer(props) {

    const teamName = props.teamName;
    const matches = data.matches.filter(match => match.team1.teamName === teamName || match.team2.teamName === teamName);
    
    if (!matches) {
        return <h1>Team not found</h1>;
    }

    const isTeam1 = matches[0].team1.teamName === teamName;
    matches.sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));

    return (
        <div>
            <h1>Team Name: {teamName}</h1>
            <h2>Team Members:</h2>
            <table className="team-table">
                <thead>
                    <th>Member Name:</th>
                    <th>Mean Solve Time:</th>
                </thead>
                <tbody>
            {isTeam1 && matches[0].team1.names.map(name => <><tr key={name} onClick={() => window.location.href = `/competitorstatistics/${name}`}><td>{name}</td><td>{getMeanSolve(name).toFixed(2)}</td></tr></>)} 
            {!isTeam1 && matches[0].team2.names.map(name => <><tr key={name} onClick={() => window.location.href = `/competitorstatistics/${name}`}><td>{name}</td><td>{getMeanSolve(name).toFixed(2)}</td></tr></>)}
                </tbody>
            </table>
            <h2>Matches: </h2>
            <div className="match-display">
            {matches.length === 0 && <p>No matches found</p>}
            {matches.map(match => (
                <MatchWidget match={match} won={didWin(teamName, match)}/>
            ))}
            </div>
        </div>
    );
}

export default TeamViewer;