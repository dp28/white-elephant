import { createSlice } from "@reduxjs/toolkit";
import cuid from "cuid";
import { ask } from "../../app/peer";
import { fetchId } from "../../app/identity";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    game: null,
  },
  reducers: {
    inGame: (state, action) => {
      state.game = action.game;
    },
  },
});

export const { inGame } = gameSlice.actions;

export const startGame = ({ hostId, name }) => (dispatch) => {
  const game = { id: cuid(), hostId, name };
  setURLSearchParams({ hostId, gameId: game.id });
  dispatch(inGame(game));
};

export async function tryToJoinGame(dispatch) {
  const queryParams = new URLSearchParams(window.location.search);
  const hostId = queryParams.get("hostId");
  const gameId = queryParams.get("gameId");

  if (!hostId || !gameId) {
    return;
  }

  if (hostId === fetchId()) {
    console.debug("Can't currently join self-hosted games");
    setURLSearchParams({ gameId: undefined, hostId: undefined });
    return;
  }

  console.debug("Trying to join game", gameId, "on host", hostId);

  const game = await ask({
    connectionId: hostId,
    dispatch,
    requestBody: { type: "JOIN_GAME", payload: gameId },
  });

  dispatch(inGame(game));
}

export const selectGame = (state) => state.game.game;

export default gameSlice.reducer;

function setURLSearchParams(params) {
  const queryParams = new URLSearchParams(window.location.search);

  Object.entries(params).forEach(([name, value]) => {
    if (value === undefined) {
      queryParams.delete(name);
    } else {
      queryParams.set(name, value);
    }
  });

  window.history.pushState({}, "", "?" + queryParams.toString());
}
