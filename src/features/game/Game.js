import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectGame, startGame } from "./gameSlice";
import { fetchId } from "../../app/identity";

export function Game() {
  const game = useSelector(selectGame);
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(
      startGame({
        hostId: fetchId(),
        name,
      })
    );
  };

  if (game) {
    return <div>Game: {game.name}</div>;
  } else {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required={true}
          />
          <input type="submit" value="Start new game" />
        </form>
      </div>
    );
  }
}
