/*

This page should display the current scramble (in notation,) the draw scramble, and the match table, with an option to confirm the scramble for team 1

*/

import React, { useState } from 'react';
import { database } from '../../firebase';
import {ref, get, update} from 'firebase/database';
import { MatchViewer } from '../../components/MatchViewer'

const Judge1 = () => {
    let competitor = 0;
    const [time, setTime] = useState(0);
    const arrayRef = ref(database, 'current_match/0/team1/times');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const snapshot = await get(arrayRef);
          let data = snapshot.val();

          const nextIndex = data ? Object.keys(data).length : 0;
          const updates = {};
          updates[nextIndex] = time;
          await update(arrayRef, updates);
          console.log('Data saved successfully');
        } catch (error) {
          console.error('Error saving data:', error);
        }
        
    };
    return (
    <>
    <h1>Team 1 Judge</h1>
    <form onSubmit={handleSubmit}>
        <input type="number" placeholder="Enter a time" value={time} onChange={(e) => setTime(Number(e.target.value))} />
        <button type="submit">Submit</button>
    </form>
    </>
    );
}

export default Judge1;