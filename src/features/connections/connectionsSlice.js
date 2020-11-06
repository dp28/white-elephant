import { createSlice } from "@reduxjs/toolkit";

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    connectingTo: [],
    connectionsById: {},
    failedConnectionsById: {},
  },
  reducers: {
    startConnecting: (state, action) => {
      const id = action.payload;
      if (!state.connectionsById[id] && state.connectingTo.indexOf(id) < 0) {
        state.connectingTo.push(id);
      }
    },
    addConnection: (state, action) => {
      delete state.failedConnectionsById[action.payload.id];
      remove(state.connectingTo, action.payload.id);
      state.connectionsById[action.payload.id] = action.payload.connection;
    },
    logConnectionError: (state, action) => {
      state.failedConnectionsById[action.payload.id] = action.payload.error;
    },
    disconnect: (state, action) => {
      delete state.connectionsById[action.payload.id];
    },
  },
});

export const {
  startConnecting,
  addConnection,
  logConnectionError,
  disconnect,
} = connectionsSlice.actions;

export const selectConnectingCount = (state) =>
  state.connections.connectingTo.length;

export const selectConnectionCount = (state) =>
  Object.keys(state.connections.connectionsById).length;

export const selectConnectionErrors = (state) =>
  Object.values(state.connections.failedConnectionsById);

export default connectionsSlice.reducer;

function remove(array, value) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
}
