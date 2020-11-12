import React from "react";
import { useSelector } from "react-redux";
import { selectGame } from "./gameSlice";

export function CurrentGame() {
  const game = useSelector(selectGame);
  return <div>Game: {game.name}</div>;
}
