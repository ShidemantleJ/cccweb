import React from 'react';
import { useParams } from 'react-router-dom';
import MatchViewer from '../components/MatchViewer';
import MatchSearch from '../components/MatchSearch';

const Matches = () => {
  let params = useParams();

  return (
    <>
    <MatchViewer matchId={params.matchId} />
    </>
  );
};

export default Matches;