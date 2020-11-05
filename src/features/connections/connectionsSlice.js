import { createSlice } from "@reduxjs/toolkit";
import { connect } from "../../app/peer";

export const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    connectingTo: [],
    connectionsById: {},
    failedConnectionsById: {},
  },
  reducers: {
    startConnecting: (state, action) => {
      if (state.connectingTo.indexOf(action.payload) < 0) {
        state.connectingTo.push(action.payload);
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
  },
});

export const {
  startConnecting,
  addConnection,
  logConnectionError,
} = connectionsSlice.actions;

export const attemptToConnect = (peerId) => (dispatch) => {
  dispatch(startConnecting(peerId));

  connect(peerId)
    .then(() =>
      dispatch(addConnection({ id: peerId, connection: { id: peerId } }))
    )
    .catch((error) => dispatch(logConnectionError({ id: peerId, error })));
};

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
