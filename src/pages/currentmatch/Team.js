/*

This page should display the current scramble (notation only,) the match table, and the state of the judge's confirmation for team 1

*/

import {useState, useEffect} from 'react';
import {ref, onValue} from 'firebase/database';
import {useParams} from 'react-router-dom';
import {database} from '../../firebase';

export default function Team() {
    let params = useParams();
    const teamNum = params.teamNum;

    let oppTeamNum;
    if (teamNum === '1') {
        oppTeamNum = '2';
    } else oppTeamNum = '1';
    console.log(teamNum, oppTeamNum);
    
    const [scrambleChecked, setScrambleChecked] = useState(false);
    const [competitorMayStart, setCompetitorMayStart] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrambleIndex, setScrambleIndex] = useState(0);
    const [currentName, setCurrentName] = useState('');
    const [currentOpponentName, setCurrentOpponentName] = useState('');
    const [scramble, setScramble] = useState('');

    useEffect(() => {
        const teamStatus = ref(database, `currentMatch/team${teamNum}/status`);
        const currentIndexRef = ref(database, `currentMatch/team${teamNum}/currentIndex`);
        const scrambleIndexRef = ref(database, `currentMatch/team${teamNum}/scrambleIndex`);
        const currentNameRef = ref(database, `currentMatch/team${teamNum}/names/${currentIndex}`);
        const currentOpponentNameRef = ref(database, `currentMatch/team${oppTeamNum}/names/${currentIndex}`);

        onValue(currentOpponentNameRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCurrentOpponentName(data);
            }
        });

        onValue(currentNameRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCurrentName(data);
            }
        });

        onValue(teamStatus, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setScrambleChecked(data.scrambleChecked || false);
                setCompetitorMayStart(data.competitorMayStart || false);
            }
        });

        onValue(currentIndexRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                console.log("changing matchup index");
                setCurrentIndex(data);
                onValue(ref(database, `currentMatch/scrambles/${data}/${scrambleIndex}`), (snapshot) => {
                    const scrambleData = snapshot.val();
                    if (scrambleData !== null) {
                        setScramble(scrambleData);
                    }
                });
            }
        });

        onValue(scrambleIndexRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                setScrambleIndex(data);
                onValue(ref(database, `currentMatch/scrambles/${currentIndex}/${data}`), (snapshot) => {
                    const scrambleData = snapshot.val();
                    if (scrambleData !== null) {
                        setScramble(scrambleData);
                    }
                });
            }
        });
    }, [currentIndex, scrambleIndex]);

    return (
        <>
        <div>
            <div>
            <h1>Team {teamNum}</h1>
            <h2>Current matchup: {currentName} vs {currentOpponentName}</h2>
            <h1>Scramble for solve #{scrambleIndex+1}:</h1>
            <h2>{scramble}</h2>
            </div>
        </div>
        <div style={{width: '50%', margin: '0 auto', textAlign: 'center'}}>
            {!scrambleChecked && !competitorMayStart && <div style={{backgroundColor: 'red', width: '50%', margin: '0 auto'}}>Do not start</div>}
            {scrambleChecked && !competitorMayStart && <div style={{backgroundColor: 'yellow', width: '50%', margin: '0 auto'}}>Do not start, but your scramble has been checked</div>}
            {competitorMayStart && <div style={{backgroundColor: 'green', width: '50%', margin: '0 auto'}}>Start whenever you're ready</div>}
        </div>
        </>
    );
}