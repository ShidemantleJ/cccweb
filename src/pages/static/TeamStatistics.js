import React from 'react';
import data from '../../data/match-data.json';
import TeamViewer from '../../components/TeamViewer';
import {useParams, useNavigate} from 'react-router-dom';

const TeamStatistics = () => {
    let params = useParams();
    let navigate = useNavigate();

    const buttonStyle = {
        padding: '10px 20px',
        margin: '20px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
      };

    return (
        <>
        <button style={buttonStyle} onClick={() => navigate(-1)}>Back</button>
        <TeamViewer teamName={params.teamName} />
        </>
    );
}

export default TeamStatistics;