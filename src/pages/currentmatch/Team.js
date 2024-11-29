import {useState, useEffect} from 'react';
import {ref, onValue} from 'firebase/database';
import {useParams} from 'react-router-dom';
import {database} from '../../firebase';
import { FullMatchTable } from '../../StatFunctions/TableFunctions';

export default function Team() {
    const {teamNum} = useParams();
    const oppTeamNum = teamNum === '1' ? '2' : '1';
    
    const [scrambleChecked, setScrambleChecked] = useState(false);
    const [competitorMayStart, setCompetitorMayStart] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrambleIndex, setScrambleIndex] = useState(0);
    const [currentName, setCurrentName] = useState('');
    const [currentOpponentName, setCurrentOpponentName] = useState('');
    const [scramble, setScramble] = useState('');
    const [matchData, setMatchData] = useState([]);

    useEffect(() => {
        const refs = {
            matchData: ref(database, `currentMatch`),
            teamStatus: ref(database, `currentMatch/team${teamNum}/status`),
            currentIndex: ref(database, `currentMatch/team${teamNum}/currentIndex`),
            scrambleIndex: ref(database, `currentMatch/team${teamNum}/scrambleIndex`),
            currentName: ref(database, `currentMatch/team${teamNum}/names/${currentIndex}`),
            currentOpponentName: ref(database, `currentMatch/team${oppTeamNum}/names/${currentIndex}`),
            scramble: ref(database, `currentMatch/scrambles/${currentIndex}/${scrambleIndex}`)
        };

        const unsubscribes = [
            onValue(refs.matchData, (snapshot => {
                const data = snapshot.val();
                setMatchData(data);
            })),

            onValue(refs.scramble, (snapshot) => {
                const data = snapshot.val();
                setScramble(data !== null && data !== undefined ? data : '');
            }),

            onValue(refs.currentOpponentName, (snapshot) => {
                const data = snapshot.val();
                setCurrentOpponentName(data !== null && data !== undefined ? data : '');
            }),

            onValue(refs.currentName, (snapshot) => {
                const data = snapshot.val();
                setCurrentName(data !== null && data !== undefined ? data : '');
            }),

            onValue(refs.teamStatus, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setScrambleChecked(data.scrambleChecked || false);
                    setCompetitorMayStart(data.competitorMayStart || false);
                }
            }),

            onValue(refs.currentIndex, (snapshot) => {
                const data = snapshot.val();
                setCurrentIndex(data !== null && data !== undefined ? data : 0);
            }),

            onValue(refs.scrambleIndex, (snapshot) => {
                const data = snapshot.val();
                setScrambleIndex(data !== null && data !== undefined ? data : 0);
            })
        ];

        return () => unsubscribes.forEach(unsubscribe => unsubscribe());
    }, [teamNum, oppTeamNum, currentIndex, scrambleIndex]);
    const getStatusStyle = (isChecked, mayStart) => ({
        width: '50%',
        margin: '0 auto',
        textAlign: 'center',
        padding: '30px',
        fontSize: '24px',
        borderRadius: '20px',
        backgroundColor: mayStart ? 'green' : isChecked ? 'yellow' : '#ff5959',
        color: !isChecked && !mayStart ? 'white' : 'inherit'
    });

    return (
        <>
            <div>
                <div>
                    <h1>Team {teamNum}</h1>
                    <h2>Current matchup: {currentName} vs {currentOpponentName}</h2>
                    <h1>Scramble for solve #{scrambleIndex + 1}:</h1>
                    <h2>{scramble}</h2>
                </div>
            </div>
            <div style={{width: '50%', margin: '0 auto', textAlign: 'center'}}>
                <div style={getStatusStyle(scrambleChecked, competitorMayStart)}>
                    {competitorMayStart ? 'Start whenever you\'re ready' :
                     scrambleChecked ? 'Do not start, but your scramble has been checked' :
                     'Do not start'}
                </div>
            </div>
            {matchData !== undefined && <FullMatchTable match={matchData} />}
        </>
    );
}