import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startGame } from "./gameSlice";
import { fetchId } from "../../app/identity";

export function NewGame() {
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
