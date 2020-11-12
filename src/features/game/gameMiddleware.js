import { isGameAction } from "./gameActions";
import { buildRelay, buildMessage } from "../../communication/messages";
import { selectGame } from "./gameSlice";
import { fetchId } from "../../app/identity";
import { relayMessage, sendMessage } from "../messages/messagesSlice";

export const gameMiddleware = (store) => {
  const selfId = fetchId();

  return (next) => (action) => {
    next(action);

    const hostId = selectGame(store.getState())?.hostId;

    if (isGameAction(action)) {
      if (selfId === hostId) {
        console.debug("Forwarding game action to all players", action);
        store.dispatch(
          relayMessage(
            buildRelay({ payload: action, except: action.meta.from })
          )
        );
      } else if (selfId === action.meta.from) {
        console.debug("Sending action to host", action);
        store.dispatch(
          sendMessage(buildMessage({ to: hostId, payload: action }))
        );
      }
    }
  };
};
