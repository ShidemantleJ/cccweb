import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, get, update, set, onValue } from 'firebase/database';
import { randomScrambleForEvent } from 'cubing/scramble';

export function JudgeInterface({ teamNum }) {
    // Consolidated state
    const [matchState, setMatchState] = useState({
        times: Array(7).fill(''),
        scrambleChecked: false,
        competitorMayStart: false,
        currentIndex: 0,
        scrambleIndex: 0,
        currentName: '',
        currentOpponentName: '',
        scramble: ''
    });

    // Database references
    const dbRefs = {
        array: ref(database, `currentMatch/team${teamNum}/times/${matchState.currentIndex}`),
        status: ref(database, `currentMatch/team${teamNum}/status`),
        scrambleIndex: ref(database, `currentMatch/team${teamNum}/scrambleIndex`),
        currentIndex: ref(database, `currentMatch/team${teamNum}/currentIndex`)
    };

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            const [currentIndexSnap, scrambleIndexSnap, statusSnap, timesSnap] = 
                await Promise.all([
                    get(dbRefs.currentIndex),
                    get(dbRefs.scrambleIndex),
                    get(dbRefs.status),
                    get(ref(database, `currentMatch/team${teamNum}/times/${matchState.currentIndex}`))
                ]);

            const newState = { ...matchState };
            
            if (currentIndexSnap.exists()) newState.currentIndex = currentIndexSnap.val();
            if (scrambleIndexSnap.exists()) newState.scrambleIndex = scrambleIndexSnap.val();
            if (statusSnap.exists()) {
                newState.scrambleChecked = statusSnap.val().scrambleChecked || false;
                newState.competitorMayStart = statusSnap.val().competitorMayStart || false;
            }
            if (timesSnap.exists()) {
                const timesData = timesSnap.val();
                newState.times = Array(7).fill('').map((_, i) => 
                    timesData[i]?.toString() || '');
            }

            // Load names and scramble
            const [nameSnap, opponentSnap, scrambleSnap] = await Promise.all([
                get(ref(database, `currentMatch/team1/names/${newState.currentIndex}`)),
                get(ref(database, `currentMatch/team2/names/${newState.currentIndex}`)),
                get(ref(database, `currentMatch/scrambles/${newState.currentIndex}/${newState.scrambleIndex}`))
            ]);

            newState.currentName = nameSnap.exists() ? nameSnap.val() : '';
            newState.currentOpponentName = opponentSnap.exists() ? opponentSnap.val() : '';
            
            if (scrambleSnap.exists() && scrambleSnap.val()) {
                newState.scramble = scrambleSnap.val().toString();
            } else {
                const newScramble = await randomScrambleForEvent("333");
                await set(ref(database, `currentMatch/scrambles/${newState.currentIndex}/${newState.scrambleIndex}`), 
                    newScramble.toString());
                newState.scramble = newScramble.toString();
            }

            setMatchState(newState);
        };

        loadData();

        // Set up real-time listeners
        const unsubscribe = [
            onValue(dbRefs.status, snap => {
                if (snap.exists()) {
                    setMatchState(prev => ({
                        ...prev,
                        scrambleChecked: snap.val().scrambleChecked || false,
                        competitorMayStart: snap.val().competitorMayStart || false
                    }));
                }
            }),
            onValue(ref(database, `currentMatch/team${teamNum}/times/${matchState.currentIndex}`), snap => {
                if (snap.exists()) {
                    const timesData = snap.val();
                    setMatchState(prev => ({
                        ...prev,
                        times: Array(7).fill('').map((_, i) => 
                            timesData[i]?.toString() || '')
                    }));
                } else {
                    setMatchState(prev => ({
                        ...prev,
                        times: Array(7).fill('')
                    }));
                }
            }),
            onValue(ref(database, `currentMatch/scrambles/${matchState.currentIndex}/${matchState.scrambleIndex}`), snap => {
                if (snap.exists()) {
                    setMatchState(prev => ({
                        ...prev,
                        scramble: snap.val().toString()
                    }));
                }
            })
        ];

        return () => unsubscribe.forEach(unsub => unsub());
    }, [matchState.currentIndex, matchState.scrambleIndex]);

    // Handler functions
    const handleTimeChange = async (index, value) => {
        // First update local state immediately
        setMatchState(prev => ({
            ...prev,
            times: prev.times.map((t, i) => i === index ? value : t)
        }));
    
        // Then handle the Firebase update
        if (value === '' || !isNaN(value)) {
            const updates = value !== '' ? { [index]: Number(value) } : { [index]: null };
            await update(dbRefs.array, updates);
            
            if (value !== '' && matchState.scrambleIndex < 6) {
                await set(dbRefs.scrambleIndex, index + 1);
                setMatchState(prev => ({
                    ...prev,
                    scrambleIndex: index + 1
                }));
            }
        }
    };

    const handleMatchupChange = async (direction) => {
        const newIndex = matchState.currentIndex + direction;
        if (newIndex >= 0 && newIndex <= 2) {
            await Promise.all([
                set(dbRefs.currentIndex, newIndex),
                set(dbRefs.scrambleIndex, 0)
            ]);
            
            // Load times for the new currentIndex
            const timesSnap = await get(ref(database, `currentMatch/team${teamNum}/times/${newIndex}`));
            const newTimes = timesSnap.exists() 
                ? Array(7).fill('').map((_, i) => timesSnap.val()[i]?.toString() || '')
                : Array(7).fill('');
            
            setMatchState(prev => ({
                ...prev,
                currentIndex: newIndex,
                scrambleIndex: 0,
                times: newTimes
            }));
        }
    };

    const handleScrambleChange = async (direction) => {
        const newIndex = matchState.scrambleIndex + direction;
        if (newIndex >= 0 && newIndex <= 6) {
            await set(dbRefs.scrambleIndex, newIndex);
            setMatchState(prev => ({
                ...prev,
                scrambleIndex: newIndex
            }));
        }
    };
    
    // Render UI
    return (
        <div className="judge-interface">
            <h1>Team {teamNum} Judge</h1>
            <h2>Current matchup: {matchState.currentName} vs {matchState.currentOpponentName}</h2>
            
            {/* Scramble Controls */}
            <div className="scramble-controls">
                <button onClick={() => handleScrambleChange(-1)}>Previous Scramble</button>
                <h3>Current Scramble, #{matchState.scrambleIndex + 1}: {matchState.scramble}</h3>
                <button onClick={() => handleScrambleChange(1)}>Next Scramble</button>
                <button onClick={async () => {
                    const newScramble = await randomScrambleForEvent("333");
                    await set(ref(database, `currentMatch/scrambles/${matchState.currentIndex}/${matchState.scrambleIndex}`), newScramble.toString());
                    setMatchState(prev => ({ ...prev, scramble: newScramble.toString() }));
                }}>Generate New Scramble</button>
                <scramble-display scramble={matchState.scramble} />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={matchState.scrambleChecked}
                            onChange={(e) => update(dbRefs.status, { scrambleChecked: e.target.checked })}
                        />
                        Scramble Checked
                    </label>
                    <br />
                    <label>
                        <input
                            type="checkbox"
                            checked={matchState.competitorMayStart}
                            onChange={(e) => update(dbRefs.status, { competitorMayStart: e.target.checked })}
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
                        {matchState.times.map((time, index) => (
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
                <button onClick={() => handleMatchupChange(-1)}>Previous Matchup</button>
                <button onClick={() => handleMatchupChange(1)}>Next Matchup</button>
            </div>
        </div>
    );
}