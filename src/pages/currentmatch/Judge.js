import React from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {JudgeInterface} from './JudgeInterface';
import { useState, useEffect } from 'react';
import { database, auth } from '../../firebase';
import {ref, get} from 'firebase/database';
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

export default function Judge () {
    const {isAdmin, loading} = useAdminCheck();
    let params = useParams();
    
    if (loading) return <h1>loading...</h1>;
    if (isAdmin) { 
        if (!params.team) {
            return (
                <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    <div style={{flex: 1}}>
                        <JudgeInterface teamNum={1} />
                    </div>
                    <div style={{width: '2px', backgroundColor: 'black'}}></div>
                    <div style={{flex: 1}}>
                        <JudgeInterface teamNum={2} />
                    </div>
                </div>
            );
        }
        switch (params.team) {
            case "1":
                return <JudgeInterface teamNum={1} />
            case "2":
                return <JudgeInterface teamNum={2} />
        }
    }
}