import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue, get } from "firebase/database";
import { useParams } from "react-router-dom";
import './styles.css';


function StreamStats () {
  const params = useParams();
  let element = params.element;

  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const matchRef = ref(database, "currentMatch");
    
    // Initial fetch
    get(matchRef).then((snapshot) => {
      if (snapshot.exists()) {
        setMatchData(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error("Error fetching initial data: ", error);
    });

    const onDataChange = (snapshot) => {
      if (snapshot.exists()) {
        setMatchData(snapshot.val());
      } else {
        console.log("No data available");
      }
    };

    const onError = (error) => {
      console.error("Error fetching data: ", error);
    };

    const unsubscribe = onValue(matchRef, onDataChange, onError);

    return () => unsubscribe();
  }, []);

  if (!matchData) return <div>Loading...</div>;

  const { team1, team2 } = matchData;
  switch (element) {
    case "team1name":
      return <h1 style={{marginTop: '3px'}}>{team1?.teamName}</h1>
    case "team2name":
      return <h1 style={{marginTop: '3px'}}>{team2?.teamName}</h1>
    case "team1times":
      return (
        <div style={{backgroundColor: "#bdbdbd", width: "100vw", height: "100vh"}}>
          {[...team1?.times?.[team1?.currentIndex]].reverse().map((time, index) => (
              <h1 style={{fontWeight: '600', marginBottom: '0px', marginTop: '0px'}} key={index}>{time}</h1>
            ))
          }
        </div>
      )
    case "team2times":
      return (
        <div style={{backgroundColor: "#bdbdbd", width: "100vw", height: "100vh"}}>
          {[...team2?.times?.[team2?.currentIndex]].reverse().map((time, index) => (
              <h1 style={{fontWeight: '600', marginBottom: '0px', marginTop: '0px'}} key={index}>{time}</h1>
            ))
          }
        </div>
      )
    case "team1playername":
      return <h1 style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', marginBottom: '25px'}}>{team1?.names?.[team1?.currentIndex]}</h1>
    case "team2playername":
      return <h1 style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', marginBottom: '25px'}}>{team2?.names?.[team2?.currentIndex]}</h1>
    case "team1recenttime":
      return (
        <h1 style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', marginBottom: '25px'}}>
          {team1?.times?.[team1?.currentIndex]?.length > 0 ? team1.times[team1.currentIndex][team1.times[team1.currentIndex].length - 1] : ''}
        </h1>
      )
    case "team2recenttime":
      return (
        <h1 style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', marginBottom: '25px'}}>
          {team2?.times?.[team2?.currentIndex]?.length > 0 ? team2.times[team2.currentIndex][team2.times[team2.currentIndex].length - 1] : ''}
        </h1>
      )
      default:
      return <div>Invalid element</div>;
  }
};
export default StreamStats;