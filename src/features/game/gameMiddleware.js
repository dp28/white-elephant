import { isGameAction } from "./gameActions";
import { buildBroadcast } from "../../communication/messages";
import { selectGame } from "./gameSlice";
import { fetchId } from "../../app/identity";
import { broadcastMessage } from "../messages/messagesSlice";

export const gameMiddleware = (store) => (next) => (action) => {
  next(action);
  if (isGameAction(action) && actingAsHost(store)) {
    console.debug("Forwarding game action", action);
    store.dispatch(broadcastMessage(buildBroadcast({ payload: action })));
  }
};

function actingAsHost(store) {
  return selectGame(store.getState())?.hostId === fetchId();
}
