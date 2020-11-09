import React from "react";
import { useSelector } from "react-redux";
import {
  selectConnections,
  isConnected,
  isConnecting,
} from "./connectionsSlice";

export function Connections() {
  const connections = useSelector(selectConnections);
  const errors = connections.map(({ error }) => error).filter(Boolean);
  const connectionCount = connections.filter(isConnected).length;
  const connectingCount = connections.filter(isConnecting).length;

  return (
    <div>
      {errors.length && <p>Errors: {errors}</p>}

      <p>Current connections: {connectionCount}</p>

      {connectingCount && <p>Connecting to {connectingCount} ...</p>}
    </div>
  );
}
