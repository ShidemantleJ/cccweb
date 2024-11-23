/*

This page should display the current scramble (in notation,) the draw scramble, and the match table, with an option to confirm the scramble for team 1

*/

import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { database } from '../../firebase';
import {ref, get, update, set, onValue} from 'firebase/database';
import {randomScrambleForEvent} from 'cubing/scramble';
import { ScrambleDisplay } from 'scramble-display';

export function JudgeInterface (props) {
    const teamNum = props.teamNum;
    const [times, setTimes] = useState(Array(7).fill(''));
    const [scrambleChecked, setScrambleChecked] = useState(false);
    const [competitorMayStart, setCompetitorMayStart] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentName, setCurrentName] = useState('');
    const [currentOpponentName, setCurrentOpponentName] = useState('');
    const [scrambleIndex, setScrambleIndex] = useState(0);
    const [scramble, setScramble] = useState('');
    const arrayRef = ref(database, `currentMatch/team${teamNum}/times/${currentIndex}`);
    const statusRef = ref(database, `currentMatch/team${teamNum}/status`);
    const scrambleIndexRef = ref(database, `currentMatch/team${teamNum}/scrambleIndex`);
    const currentIndexRef = ref(database, `currentMatch/team${teamNum}/currentIndex`);

    useEffect(() => {
        const loadData = async () => {
            // Load current index and scramble index first
            const currentIndexSnapshot = await get(currentIndexRef);
            const scrambleIndexSnapshot = await get(scrambleIndexRef);
            
            if (currentIndexSnapshot.exists()) {
                setCurrentIndex(currentIndexSnapshot.val());
            }
            if (scrambleIndexSnapshot.exists()) {
                setScrambleIndex(scrambleIndexSnapshot.val());
            }

            // Load status
            const statusSnapshot = await get(statusRef);
            if (statusSnapshot.exists()) {
                setScrambleChecked(statusSnapshot.val().scrambleChecked || false);
                setCompetitorMayStart(statusSnapshot.val().competitorMayStart || false);
            }

            // Load times
            const timesSnapshot = await get(arrayRef);
            if (timesSnapshot.exists()) {
                const timesData = timesSnapshot.val();
                const newTimes = Array(7).fill('');
                Object.entries(timesData).forEach(([key, value]) => {
                    newTimes[parseInt(key)] = value.toString();
                });
                setTimes(newTimes);
            }

            // Load names and scramble
            const nameRef = ref(database, `currentMatch/team1/names/${currentIndex}`);
            const opponentNameRef = ref(database, `currentMatch/team2/names/${currentIndex}`);
            const scrambleRef = ref(database, `currentMatch/scrambles/${currentIndex}/${scrambleIndex}`);

            const [nameSnapshot, opponentSnapshot, scrambleSnapshot] = await Promise.all([
                get(nameRef),
                get(opponentNameRef),
                get(scrambleRef)
            ]);

            if (nameSnapshot.exists()) setCurrentName(nameSnapshot.val());
            if (opponentSnapshot.exists()) setCurrentOpponentName(opponentSnapshot.val());
            if (scrambleSnapshot.exists() && scrambleSnapshot.val() !== '') {
                setScramble(scrambleSnapshot.val().toString());
            } else {
                const newScramble = await randomScrambleForEvent("333");
                await set(scrambleRef, newScramble.toString());
                setScramble(newScramble.toString());
            }
        };

        // Set up real-time listeners
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            if (snapshot.exists()) {
                setScrambleChecked(snapshot.val().scrambleChecked || false);
                setCompetitorMayStart(snapshot.val().competitorMayStart || false);
            }
        });

        const unsubscribeTimes = onValue(arrayRef, (snapshot) => {
            if (snapshot.exists()) {
                const timesData = snapshot.val();
                const newTimes = Array(7).fill('');
                Object.entries(timesData).forEach(([key, value]) => {
                    newTimes[parseInt(key)] = value.toString();
                });
                setTimes(newTimes);
            }
        });

        const unsubscribeScramble = onValue(ref(database, `currentMatch/scrambles/${currentIndex}/${scrambleIndex}`), (snapshot) => {
            if (snapshot.exists() && snapshot.val() !== '') {
                setScramble(snapshot.val().toString());
            }
        });

        loadData();

        return () => {
            unsubscribeStatus();
            unsubscribeTimes();
            unsubscribeScramble();
        };
    }, [currentIndex, scrambleIndex]);
    const handleTimeChange = async (index, value) => {
        const newTimes = [...times];
        newTimes[index] = value;
        setTimes(newTimes);

        try {
            const updates = {};
            if (value !== '') {
                updates[index] = Number(value);
                await update(arrayRef, updates);
            } else {
                updates[index] = null;
                await update(arrayRef, updates);
            }
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
        }
        await set(scrambleIndexRef, index+1);
        scrambleIndex < 6 && setScrambleIndex(index+1);
    };

    const handleStatusChange = async (field, value) => {
        try {
            const updates = {[field]: value};
            await update(statusRef, updates);
            if (field === 'scrambleChecked') {
                setScrambleChecked(value);
            } else if (field === 'competitorMayStart') {
                setCompetitorMayStart(value);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePreviousMatchup = async () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setScrambleIndex(0);
            setCurrentIndex(newIndex);
            loadTimes(newIndex);
            await set(currentIndexRef, newIndex);
            await set(scrambleIndexRef, 0);
        }
    };

    const handleNextMatchup = async () => {
        if (currentIndex < 2) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            loadTimes(newIndex);
            setScrambleIndex(0);
            await set(currentIndexRef, newIndex);
            await set(scrambleIndexRef, 0);
        }
    };

    const loadTimes = async (index) => {
        const timesRef = ref(database, `currentMatch/team${teamNum}/times/${index}`);
        try {
            const snapshot = await get(timesRef);
            if (snapshot.exists()) {
                const timesData = snapshot.val();
                const newTimes = Array(7).fill('');
                Object.entries(timesData).forEach(([key, value]) => {
                    newTimes[parseInt(key)] = value.toString();
                });
                setTimes(newTimes);
            } else {
                setTimes(Array(7).fill(''));
            }
        } catch (error) {
            console.error('Error loading times:', error);
        }
    };

    const generateNewScramble = async () => {
        const scrambleRef = ref(database, `currentMatch/scrambles/${currentIndex}/${scrambleIndex}`);
        const newScramble = await randomScrambleForEvent("333");
        await set(scrambleRef, newScramble.toString());
        setScramble(newScramble.toString());
    };

    return (
    <>
    <h1>Team {teamNum} Judge</h1>
    <h2>Current matchup: {currentName} vs {currentOpponentName}</h2>
    <button onClick={async () => {
        const newIndex = Math.max(0, scrambleIndex - 1);
        setScrambleIndex(newIndex);
        await set(scrambleIndexRef, newIndex);
    }}>Previous Scramble</button>
    <h3>Current Scramble, #{scrambleIndex + 1}: {scramble}</h3>
    <button onClick={async () => {
        const newIndex = scrambleIndex + 1;
        scrambleIndex < 6 && setScrambleIndex(newIndex);
        await set(scrambleIndexRef, newIndex);
    }}>Next Scramble</button>
    <button onClick={generateNewScramble}>Generate New Scramble</button>
    <scramble-display scramble={scramble} />
    <div>
        <label>
            <input
                type="checkbox"
                checked={scrambleChecked}
                onChange={(e) => handleStatusChange('scrambleChecked', e.target.checked)}
            />
            Scramble Checked
        </label>
        <br />
        <label>
            <input
                type="checkbox"
                checked={competitorMayStart}
                onChange={(e) => handleStatusChange('competitorMayStart', e.target.checked)}
            />
            Competitor May Start
        </label>
    </div>
    <table>
        <thead>
            <tr>
                <th>Solve</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            {times.map((time, index) => (
                <tr key={index}>
                    <td>Solve {index + 1}</td>
                    <td>
                        <input
                            type="number"
                            placeholder="Enter time"
                            value={time}
                            onChange={(e) => handleTimeChange(index, e.target.value)}
                        />
                    </td>
                </tr>
            ))}
        </tbody>
    </table>


    <button onClick={handlePreviousMatchup}>Previous Matchup</button>
    <button onClick={handleNextMatchup}>Next Matchup</button>
    </>
    );

}