import { buildConnections } from "./connections";
import { SEND_MESSAGE } from "../features/messages/messagesSlice";

export const communicationMiddleware = (store) => {
  const connectionsPromise = buildConnections(store);

  return (next) => (action) => {
    if (action.type === SEND_MESSAGE) {
      connectionsPromise.then((_) => _.send(action.payload.to, action.payload));
    }
    next(action);
  };
};
