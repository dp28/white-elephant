import { createSlice } from "@reduxjs/toolkit";
import cuid from "cuid";
import { fetchId } from "../../app/identity";
import { sendMessage } from "../messages/messagesSlice";
import { buildRequest } from "../../communication/messages";
import { addPlayer } from "../players/playersSlice";
import { gameReducers } from "./gameActions";

export const GameStates = {
  WAITING: "WAITING",
  STARTED: "STARTED",
  FINISHED: "FINISHED",
};

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    game: null,
    gameToJoin: { game: null, loading: false, error: null, joining: false },
  },
  reducers: {
    createGame: (state, action) => {
      state.game = { ...action.payload, state: GameStates.WAITING };
    },
    startLoadingGame: (state, action) => {
      state.gameToJoin.loading = true;
    },
    setGameToJoin: (state, action) => {
      state.gameToJoin.game = {
        gameId: action.payload.game.id,
        hostId: action.payload.game.hostId,
        hostName: action.payload.game.hostName,
        name: action.payload.game.name,
      };
      state.gameToJoin.error = null;
      state.gameToJoin.loading = false;
      state.gameToJoin.joining = false;
    },
    startJoiningGame: (state, action) => {
      state.gameToJoin.joining = true;
    },
    setGameState: (state, action) => {
      state.game = action.payload.game;
      state.gameToJoin.game = null;
      state.gameToJoin.loading = false;
      state.gameToJoin.joining = false;
    },
    gameNotFound: (state, action) => {
      state.gameToJoin.error = action.payload.message || "Game not found";
      state.gameToJoin.loading = false;
      state.gameToJoin.joining = false;
    },
    stopJoining: (state) => {
      state.game = null;
      state.gameToJoin.game = null;
      state.gameToJoin.loading = false;
      state.gameToJoin.joining = false;
    },
    ...gameReducers({
      startExchangingGifts: (state, action) => {
        state.game.state = GameStates.STARTED;
      },
      finishGame: (state, action) => {
        state.game.state = GameStates.FINISHED;
      },
    }),
  },
});

export const {
  createGame,
  setGameState,
  setGameToJoin,
  gameNotFound,
  startLoadingGame,
  startJoiningGame,
  startExchangingGifts,
  finishGame,
} = gameSlice.actions;

export const startGame = ({ host, name }) => (dispatch) => {
  const game = { id: cuid(), hostId: host.id, name };
  setURLSearchParams({ hostId: host.id, gameId: game.id });
  dispatch(createGame(game));
  dispatch(addPlayer({ ...host, connected: true }));
};

export const selectGame = (state) => state.game.game;
export const selectGameToJoin = (state) => state.game.gameToJoin;

export default gameSlice.reducer;

export const REQUEST_GAME_TO_JOIN = "REQUEST_GAME_TO_JOIN";
export const JOIN_GAME = "JOIN_GAME";

export const stopJoiningGame = () => (dispatch) => {
  setURLSearchParams({ gameId: undefined, hostId: undefined });
  dispatch(gameSlice.actions.stopJoining());
};

export const requestGameToJoin = () => (dispatch) => {
  dispatch(startLoadingGame());
  const { hostId, gameId } = loadGameDataFromURL();

  if (!gameId || !hostId) {
    console.debug("No game to join found in URL");
    dispatch(stopJoiningGame());
    return;
  }

  if (hostId === fetchId()) {
    console.debug("Can't currently join self-hosted games");
    dispatch(stopJoiningGame());
    return;
  }

  dispatch(
    sendMessage(
      buildRequest({
        to: hostId,
        payload: {
          type: REQUEST_GAME_TO_JOIN,
          payload: {
            playerId: fetchId(),
            gameId,
          },
        },
      })
    )
  );
};

export const joinGame = ({ player, image, gameId, hostId }) => (dispatch) => {
  if (!hostId || !gameId) {
    return;
  }

  console.debug("Trying to join game", gameId, "on host", hostId);
  dispatch(startJoiningGame());

  dispatch(
    sendMessage(
      buildRequest({
        to: hostId,
        payload: {
          type: JOIN_GAME,
          payload: {
            gameId,
            player,
            image,
          },
        },
      })
    )
  );
};

function loadGameDataFromURL() {
  const queryParams = new URLSearchParams(window.location.search);
  const hostId = queryParams.get("hostId");
  const gameId = queryParams.get("gameId");
  return { hostId, gameId };
}

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
