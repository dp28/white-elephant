import { createSlice } from "@reduxjs/toolkit";

export const CONNECTING = "CONNECTING";
export const CONNECTED = "CONNECTED";
export const DISCONNECTED = "DISCONNECTED";

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    connectionsById: {},
  },
  reducers: {
    startConnecting: (state, action) => {
      setConnectionStatus({
        state,
        connectionId: action.payload,
        status: CONNECTING,
      });
    },
    addConnection: (state, action) => {
      setConnectionStatus({
        state,
        connectionId: action.payload.id,
        status: CONNECTED,
      });
    },
    logConnectionError: (state, action) => {
      setConnectionStatus({
        state,
        connectionId: action.payload.id,
        status: DISCONNECTED,
        error: action.payload.error,
      });
    },
    disconnect: (state, action) => {
      setConnectionStatus({
        state,
        connectionId: action.payload.id,
        status: DISCONNECTED,
      });
    },
  },
});

export const {
  startConnecting,
  addConnection,
  logConnectionError,
  disconnect,
} = connectionsSlice.actions;

export const selectConnections = (state) =>
  Object.values(state.connections.connectionsById);

export const selectConnectionMap = (state) => state.connections.connectionsById;

export const selectConnection = (id) => (state) =>
  state.connections.connectionsById[id];

export const isConnecting = (connection) => connection.status === CONNECTING;
export const isConnected = (connection) => connection.status === CONNECTED;
export const isDisconnected = (connection) =>
  connection.status === DISCONNECTED;

export default connectionsSlice.reducer;

function setConnectionStatus({
  state,
  connectionId,
  status,
  error = undefined,
}) {
  const connection = fetchConnection(state, connectionId);
  connection.status = status;
  connection.error = error;
}

function fetchConnection(state, id) {
  if (!state.connectionsById[id]) {
    state.connectionsById[id] = { id };
  }
  return state.connectionsById[id];
}
