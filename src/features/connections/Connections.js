import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  attemptToConnect,
  selectConnectingCount,
  selectConnectionCount,
  selectConnectionErrors,
} from "./connectionsSlice";

export function Connections() {
  const connectingCount = useSelector(selectConnectingCount);
  const connectionCount = useSelector(selectConnectionCount);
  const errors = useSelector(selectConnectionErrors);
  const [peerId, setPeerId] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(attemptToConnect(peerId));
    setPeerId("");
  };

  return (
    <div>
      {errors.length && <p>Errors: {errors}</p>}

      <p>Current connections: {connectionCount}</p>

      {connectingCount && <p>Connecting to {connectingCount} ...</p>}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={peerId}
          onChange={(event) => setPeerId(event.target.value)}
          required={true}
        />
        <input type="submit" value="Connect" />
      </form>
    </div>
  );
}
