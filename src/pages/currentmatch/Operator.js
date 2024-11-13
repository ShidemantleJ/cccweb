/*

This page should display links to judge and team pages, as well as the current match table and who's turn it is

Page should have forms for watch link, team 1 name, team 2 name, match ID, and individual competitor names for each team

*/

import { useState, useEffect } from 'react';
import { database, auth } from '../../firebase';
import {ref, get, update} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

function useAdminCheck() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists() && snapshot.val().isAdmin) {
            setIsAdmin(true);
          }
        }
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    return { isAdmin, loading };
  }

const Operator = () => {
    const {isAdmin, loading} = useAdminCheck();
    const [team1Name, setTeam1Name] = useState('');
    const [team2Name, setTeam2Name] = useState('');
    const [team1Members, setTeam1Members] = useState(['','','']);
    const [team2Members, setTeam2Members] = useState(['','','']);

    useEffect(() => {
        const fetchMatchData = async () => {
            const team1Ref = ref(database, 'currentMatch/team1');
            const team2Ref = ref(database, 'currentMatch/team2');
            
            const team1Snapshot = await get(team1Ref);
            const team2Snapshot = await get(team2Ref);

            if (team1Snapshot.exists()) {
                const team1Data = team1Snapshot.val();
                setTeam1Name(team1Data.teamName || '');
                setTeam1Members(team1Data.names || ['','','']);
            }

            if (team2Snapshot.exists()) {
                const team2Data = team2Snapshot.val();
                setTeam2Name(team2Data.teamName || '');
                setTeam2Members(team2Data.names || ['','','']);
            }
        };

        fetchMatchData();
    }, []);

    if (loading) return <h1>Loading</h1>;
    if (!isAdmin) return <h1>Access Denied, Admins Only</h1>

    const handleTeam1MemberChange = (index, value) => {
        const newMembers = [...team1Members];
        newMembers[index] = value;
        setTeam1Members(newMembers);
        const matchRef = ref(database, 'currentMatch/team1');
        update(matchRef, {
            names: newMembers
        });
    };

    const handleTeam2MemberChange = (index, value) => {
        const newMembers = [...team2Members];
        newMembers[index] = value;
        setTeam2Members(newMembers);
        const matchRef = ref(database, 'currentMatch/team2');
        update(matchRef, {
            names: newMembers
        });
    };

    const handleTeam1NameChange = (e) => {
        setTeam1Name(e.target.value);
        const matchRef = ref(database, 'currentMatch/team1');
        update(matchRef, {
            teamName: e.target.value
        });
    }

    const handleTeam2NameChange = (e) => {
        setTeam2Name(e.target.value);
        const matchRef = ref(database, 'currentMatch/team2');
        update(matchRef, {
            teamName: e.target.value
        });
    }

    return (
    <div>
        <table>
            <tbody>
                <tr>
                    <td>Team 1 Name:</td>
                    <td>
                        <input
                            type="text"
                            value={team1Name}
                            onChange={(e) => handleTeam1NameChange(e)}
                        />
                    </td>
                    <td>Team 2 Name:</td>
                    <td>
                        <input
                            type="text"
                            value={team2Name}
                            onChange={(e) => handleTeam2NameChange(e)}
                        />
                    </td>
                </tr>
                {[0, 1, 2].map((index) => (
                    <tr key={index}>
                        <td>Team 1 Member {index + 1}:</td>
                        <td>
                            <input
                                type="text"
                                value={team1Members[index]}
                                onChange={(e) => handleTeam1MemberChange(index, e.target.value)}
                            />
                        </td>
                        <td>Team 2 Member {index + 1}:</td>
                        <td>
                            <input
                                type="text"
                                value={team2Members[index]}
                                onChange={(e) => handleTeam2MemberChange(index, e.target.value)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}

export default Operator;