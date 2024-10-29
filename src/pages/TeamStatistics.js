import React from 'react';
import data from '../data/match-data.json';
import TeamViewer from '../components/TeamViewer';
import {useParams} from 'react-router-dom';

const TeamStatistics = () => {
    let params = useParams();

    return (
        <>
        <TeamViewer teamName={params.teamName} />
        </>
    );
}

export default TeamStatistics;