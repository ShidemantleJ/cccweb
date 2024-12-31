import { getSetsWon } from "../StatFunctions/MatchStats";
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function MatchWidget(props) {
    const match = props.match;
    
    
    return <div className="individual-match" key={match.matchId} onClick={() => window.location.href = `/matches/${match.matchId}`}>
        <p style={{fontWeight: 'bold'}}>{match.team1.teamName} [{getSetsWon(1, match)}] vs {match.team2.teamName} [{getSetsWon(2, match)}]</p>
        {(match.watchLink !== "" && match.watchLink !== undefined) && <p style={{ display: 'flex', alignItems: 'center' }}>Watch Here: <YouTubeIcon onClick={() => window.open("https://youtu.be/" + match.watchLink)} style={{ cursor: 'pointer', color: '#FF0000', fontSize: '1.5rem', marginLeft: '4px' }} /></p>}
        <p>{new Date(match.matchDateTime).toLocaleDateString()} at {new Date(match.matchDateTime).toLocaleTimeString()}</p>
    </div>
}