import {React, useState} from 'react';
import data from '../data/match-data.json';
import './TeamViewer.css';
import { returnMatchupTable } from '../StatFunctions/TableFunctions';

function CompetitorViewer(props) {
    const [selectedScramble, setSelectedScramble] = useState(null);

    const competitorName = props.competitorName;
    const matches = data.matches.filter(match => match.team1.names.includes(competitorName) || match.team2.names.includes(competitorName));
    
    if (!matches) {
        return <h1>Competitor not found</h1>;
    }
    matches.sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));

    return (
        <div>
            <h1>Competitor Name: {competitorName}</h1>
            <h1>Solves:</h1>
            {matches.map(match =>
                returnMatchupTable(match, setSelectedScramble, selectedScramble, competitorName)
            )}
        </div>
    );
}

export default CompetitorViewer;