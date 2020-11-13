import React from "react";
import { useSelector } from "react-redux";
import { selectGame, selectGameToJoin } from "./gameSlice";
import { CurrentGame } from "./CurrentGame";
import { NewGame } from "./NewGame";
import { JoinGame } from "./JoinGame";
export function Game() {
  const game = useSelector(selectGame);
  const gameToJoin = useSelector(selectGameToJoin);

  if (game) {
    return <CurrentGame />;
  } else if (gameToJoin.loading || gameToJoin.game) {
    return <JoinGame />;
  } else {
    return <NewGame />;
  }
}
