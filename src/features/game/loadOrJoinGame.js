import { fetchId } from "../../app/identity";
import { loadPersistedGameState } from "./gameState";
import {
  startLoadingGame,
  setGameState,
  stopJoiningGame,
  REQUEST_GAME_TO_JOIN,
} from "./gameSlice";
import { sendMessage } from "../messages/messagesSlice";
import { buildRequest } from "../../communication/messages";
import { hostConnected } from "../players/playersSlice";

export const loadGame = () => (dispatch) => {
  dispatch(startLoadingGame());

  const gameState = loadPersistedGameState();
  const { hostId, gameId } = loadGameDataFromURL();

  if (gameState && (!gameId || gameState.game.id === gameId)) {
    console.debug("Loaded persisted game");
    dispatch(setGameState(gameState));
    dispatch(hostConnected({ hostId: fetchId() }));
  } else if (gameId && hostId && hostId !== fetchId()) {
    console.debug("Attempting to join game on host", hostId);
    startToJoinGame({ hostId, gameId, dispatch });
  } else {
    console.debug("No game found in URL or storage");
    dispatch(stopJoiningGame());
  }
};

function startToJoinGame({ hostId, gameId, dispatch }) {
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
}

function loadGameDataFromURL() {
  const queryParams = new URLSearchParams(window.location.search);
  const hostId = queryParams.get("hostId");
  const gameId = queryParams.get("gameId");
  return { hostId, gameId };
}
