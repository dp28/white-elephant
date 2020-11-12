import React from "react";
import { useSelector } from "react-redux";
import { selectPlayers } from "./playersSlice";
import { selectConnectionMap } from "../connections/connectionsSlice";
import { fetchId } from "../../app/identity";

export function Players() {
  const players = useSelector(selectPlayers);
  const connectionsById = useSelector(selectConnectionMap);

  return (
    <div>
      {players.map((player) => (
        <div key={player.id}>
          {player.name} &nbsp; (
          {player.id === fetchId() ? (
            "you"
          ) : (
            <span>Status: {connectionsById[player.connectionId].status}</span>
          )}
          )
        </div>
      ))}
    </div>
  );
}
