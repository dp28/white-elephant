import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUsername, updateUsername } from "./usernameSlice";

export function Username() {
  const savedUsername = useSelector(selectUsername) || "";
  const [editing, setEditing] = useState(savedUsername === "");
  const [username, setUsername] = useState(savedUsername);
  const dispatch = useDispatch();

  const startEditing = (event) => {
    event.preventDefault();
    setEditing(true);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(updateUsername(username));
    setEditing(false);
  };

  if (editing) {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required={true}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  } else {
    return (
      <div>
        Username: {username}
        <button onClick={startEditing}>Change</button>
      </div>
    );
  }
}
