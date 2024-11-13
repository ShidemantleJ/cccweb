import React from 'react';
import CompetitorViewer from '../../components/CompetitorViewer';
import {useParams, useNavigate} from 'react-router-dom';

const CompetitorStatistics = () => {
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
        <CompetitorViewer competitorName={params.competitorName} />
        </>
    );
}

export default CompetitorStatistics;