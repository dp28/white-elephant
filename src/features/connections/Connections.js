import React from "react";
import { useSelector } from "react-redux";
import {
  selectConnectingCount,
  selectConnectionCount,
  selectConnectionErrors,
} from "./connectionsSlice";

export function Connections() {
  const connectingCount = useSelector(selectConnectingCount);
  const connectionCount = useSelector(selectConnectionCount);
  const errors = useSelector(selectConnectionErrors);

  return (
    <div>
      {errors.length && <p>Errors: {errors}</p>}

      <p>Current connections: {connectionCount}</p>

      {connectingCount && <p>Connecting to {connectingCount} ...</p>}
    </div>
  );
}
