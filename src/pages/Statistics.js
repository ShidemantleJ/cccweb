import React from 'react';
import TeamSearch from '../components/TeamSearch';
import data from '../data/match-data.json'
import CompetitorSearch from '../components/CompetitorSearch';

const Statistics = () => {
    const competitorNames = new Map();
    for (let i = 0; i < data.matches.length; i++) {
        for (let j = 0; j < 3; j++) { competitorNames.set(data.matches[i].team1.names[j], data.matches[i].team1.teamName); competitorNames.set(data.matches[i].team2.names[j], data.matches[i].team2.teamName); }
    }
    const teamNames = new Set(Array.from(competitorNames.values()));
    const uniqueCompetitorNames = new Set(Array.from(competitorNames.keys()));

    return (
        <div>
            <h1>Search for a Team</h1>
            <TeamSearch data={Array.from(teamNames)} />
            <h1>Search for a Competitor</h1>
            <CompetitorSearch data={Array.from(uniqueCompetitorNames)} />
        </div>
    );
}

export default Statistics;