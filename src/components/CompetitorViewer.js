import {React, useState} from 'react';
import data from '../data/match-data.json';
import './TeamViewer.css';
import { MatchupTable } from '../StatFunctions/TableFunctions';
import teamData from '../data/team-data.json';

function getWcaId(competitorName) {
    for (let i = 0; i < teamData.length; i++) {
        for (let j = 0; j < teamData[i].members.length; j++) {
            if (teamData[i].members[j][0] === competitorName) {
                return teamData[i].members[j][1];
            }
        }
    }
    return null;
}

function getTeam(competitorName) {
    for (let i = 0; i < teamData.length; i++) {
        for (let j = 0; j < teamData[i].members.length; j++) {
            console.log(teamData[i].members[j][0]);
            if (teamData[i].members[j][0] === competitorName) {
                return teamData[i].schoolName;
            }
        }
    }
    return null;
}

export default function CompetitorViewer(props) {
    const [selectedScramble, setSelectedScramble] = useState(null);

    const competitorName = props.competitorName;
    const matches = data.matches.filter(match => match.team1.names.includes(competitorName) || match.team2.names.includes(competitorName));
    
    if (!matches) {
        return <h1>Competitor not found</h1>;
    }
    matches.sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));

    return (
        <div>
            <h1>{competitorName}</h1>
            <div style={{ textAlign: 'center' }}>
                {getWcaId(competitorName) && <a href={`https://worldcubeassociation.org/persons/${getWcaId(competitorName)}`} style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#333333',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    margin: '10px 0',
                    fontWeight: 'bold'
                }}>WCA Profile</a>}
            </div>
            {getTeam(competitorName) && <h2 onClick={() => window.location.href = `/teamstatistics/${getTeam(competitorName)}`} style={{ cursor: 'pointer' }}>Team: {getTeam(competitorName)}</h2>}
            <h2>Solves:</h2>
            {matches.map(match =>
                <MatchupTable key={match.matchId} match={match} competitorName={competitorName} selectedScramble={selectedScramble} setSelectedScramble={setSelectedScramble} />
            )}
        </div>
    );

}