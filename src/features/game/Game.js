import React from "react";
import { useSelector } from "react-redux";
import { selectGame } from "./gameSlice";
import { CurrentGame } from "./CurrentGame";
import { NewGame } from "./NewGame";

export function Game() {
  const game = useSelector(selectGame);

  if (game) {
    return <CurrentGame />;
  } else {
    return <NewGame />;
  }
}
