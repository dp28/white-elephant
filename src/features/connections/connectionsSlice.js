import { createSlice } from "@reduxjs/toolkit";

export const CONNECTING = "CONNECTING";
export const CONNECTED = "CONNECTED";
export const DISCONNECTED = "DISCONNECTED";

const DEFAULT_SECONDS_TO_CONNECT_ESTIMATE = 3;

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    connectionsById: {},
    serverConnection: {
      status: CONNECTING,
      startedAtSecond: nowInSeconds(),
      expectedSecondsToConnect: DEFAULT_SECONDS_TO_CONNECT_ESTIMATE,
    },
  },
  reducers: {
    startConnectingToServer: (state, action) => {
      state.serverConnection.status = CONNECTING;
      state.serverConnection.startedAtSecond = nowInSeconds();
      state.serverConnection.expectedSecondsToConnect =
        action.payload.secondsToConnect || DEFAULT_SECONDS_TO_CONNECT_ESTIMATE;
    },
    connectedToServer: (state, action) => {
      state.serverConnection.status = CONNECTED;
      state.serverConnection.startedAtSecond = null;
      state.serverConnection.expectedSecondsToConnect = null;
    },
    disconnectedFromServer: (state, action) => {
      state.serverConnection.status = DISCONNECTED;
      state.serverConnection.startedAtSecond = null;
      state.serverConnection.expectedSecondsToConnect = null;
    },
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
  startConnectingToServer,
  connectedToServer,
  disconnectedFromServer,
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

export const selectServerConnection = (state) =>
  state.connections.serverConnection;

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

function nowInSeconds() {
  return new Date().getTime() / 1000;
}
