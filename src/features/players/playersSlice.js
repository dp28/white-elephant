import { createSlice } from "@reduxjs/toolkit";
import { fetchId } from "../../app/identity";
import { loadData } from "../../app/persistentStorage";

export const playersSlice = createSlice({
  name: "players",
  initialState: {
    playersById: {
      [fetchId()]: {
        id: fetchId(),
        name: loadData("USERNAME") || null,
        connectionId: fetchId(),
      },
    },
  },
  reducers: {
    addPlayer: (state, action) => {
      state.playersById[action.payload.id] = {
        id: action.payload.id,
        name: action.payload.name,
        connectionId: action.payload.connectionId,
      };
    },
    updatePlayerName: (state, action) => {
      const player = state.playersById[action.payload.playerId];
      if (player) {
        player.name = action.payload.name;
      }
    },
  },
});

export const { addPlayer, updatePlayerName } = playersSlice.actions;

export const selectPlayers = (state) =>
  Object.values(state.players.playersById);

export const selectSelfPlayer = (state) => state.players.playersById[fetchId()];

export default playersSlice.reducer;
