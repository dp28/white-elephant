import { createSlice } from "@reduxjs/toolkit";
import { fetchId } from "../../app/identity";
import { gameReducers } from "../game/gameActions";

export const playersSlice = createSlice({
  name: "players",
  initialState: {
    playersById: {},
  },
  reducers: {
    ...gameReducers({
      addPlayer: (state, action) => {
        state.playersById[action.payload.id] = {
          id: action.payload.id,
          name: action.payload.name,
          connectionId: action.payload.connectionId,
          connected: action.payload.connected,
        };
      },
      updatePlayerName: (state, action) => {
        const player = state.playersById[action.payload.playerId];
        if (player) {
          player.name = action.payload.name;
        }
      },
      playerDisconnected: (state, action) => {
        const player = state.playersById[action.payload.playerId];
        if (player) {
          player.connected = false;
        }
      },
    }),
    hostDisconnected: (state, action) => {
      const player = state.playersById[action.payload.playerId];
      if (player) {
        player.connected = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("game/setGameState", (state, action) => {
      state.playersById = action.payload.playersById;
    });
  },
});

export const {
  addPlayer,
  updatePlayerName,
  playerDisconnected,
  hostDisconnected,
} = playersSlice.actions;

export const selectPlayers = (state) =>
  Object.values(state.players.playersById);

export const selectPlayersById = (state) => state.players.playersById;

export const selectSelfPlayer = (state) => state.players.playersById[fetchId()];

export default playersSlice.reducer;
