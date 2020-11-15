import { createSlice } from "@reduxjs/toolkit";
import { fetchId } from "../../app/identity";
import { gameReducers } from "../game/gameActions";
import { toRTCImage, toReduxImage } from "../images/imagesSlice";
import { selectGame } from "../game/gameSlice";

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
      playerReconnected: (state, action) => {
        const player = state.playersById[action.payload.playerId];
        if (player) {
          player.connected = true;
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
  playerReconnected,
  hostDisconnected,
} = playersSlice.actions;

export const selectPlayers = (state) =>
  Object.values(state.players.playersById);

export const selectPlayersById = (state) => state.players.playersById;
export const selectPlayer = (id) => (state) => state.players.playersById[id];

export const selectSelfPlayer = (state) => state.players.playersById[fetchId()];

export const toRTCAddPlayer = async (addPlayerAction) => {
  const player = addPlayerAction.payload;
  if (player.image) {
    const image = await toRTCImage(addPlayerAction.payload);
    return { ...addPlayerAction, payload: image };
  }
  return addPlayerAction;
};

export const toReduxAddPlayerAction = (addPlayerAction) => {
  const player = addPlayerAction.payload;
  if (player.image) {
    const image = toReduxImage(addPlayerAction.payload);
    return { ...addPlayerAction, payload: image };
  }
  return addPlayerAction;
};

export default playersSlice.reducer;
