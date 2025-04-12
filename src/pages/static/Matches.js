import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MatchViewer from "../../components/MatchViewer";
import GroupViewer from "../../components/GroupViewer";

const Matches = () => {
  let params = useParams();
  let navigate = useNavigate();

  const buttonStyle = {
    padding: "10px 20px",
    margin: "20px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <>
      <button style={buttonStyle} onClick={() => navigate(-1)}>
        Back
      </button>
      {params.matchId === "final" ? (
        <GroupViewer matchIds={["30", "31", "32"]} matchName={"CCC Final"} />
      ) : (
        <MatchViewer matchId={params.matchId} />
      )}
    </>
  );
};
export default Matches;
