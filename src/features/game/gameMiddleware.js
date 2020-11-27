import { isGameAction } from "./gameActions";
import { buildRelay, buildMessage } from "../../communication/messages";
import {
  selectGame,
  startNewGame,
  clearGameURLSearchParams,
} from "./gameSlice";
import { fetchId } from "../../app/identity";
import { relayMessage, sendMessage } from "../messages/messagesSlice";
import { persistGameState, clearPersistedGameState } from "./gameState";

export const gameMiddleware = (store) => {
  const selfId = fetchId();

  return (next) => (action) => {
    next(action);

    if (!isGameAction(action)) {
      if (action.type === startNewGame.toString()) {
        clearPersistedGameState();
        clearGameURLSearchParams();
      }
      return;
    }
    const rootState = store.getState();
    const game = selectGame(rootState);

    if (!game) {
      return;
    }

    const hostId = game.hostId;

    if (selfId === hostId) {
      console.debug("Forwarding game action to all players", action);
      store.dispatch(
        relayMessage(buildRelay({ payload: action, except: action.meta.from }))
      );

      console.debug("Persisting game state");
      persistGameState(rootState);
    } else if (selfId === action.meta.from) {
      console.debug("Sending action to host", action);
      store.dispatch(
        sendMessage(buildMessage({ to: hostId, payload: action }))
      );
    }
  };
};
