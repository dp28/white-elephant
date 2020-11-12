import React from "react";
import { useSelector } from "react-redux";
import { selectPlayers } from "./playersSlice";
import { fetchId } from "../../app/identity";

export function Players() {
  const players = useSelector(selectPlayers);

  return (
    <div>
      {players.map((player) => (
        <div key={player.id}>
          {player.name} &nbsp; (
          {player.id === fetchId() ? (
            "you"
          ) : (
            <span>Connected: {player.connected ? "YES" : "NO"}</span>
          )}
          )
        </div>
      ))}
    </div>
  );
}
