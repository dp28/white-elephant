import { buildConnections } from "./connections";
import {
  SEND_MESSAGE,
  BROADCAST_MESSAGE,
} from "../features/messages/messagesSlice";
import { STORE_IMAGE, toRTCStoreImage } from "../features/images/imagesSlice";

export const communicationMiddleware = (store) => {
  const connectionsPromise = buildConnections(store);

  return (next) => async (action) => {
    if (action.type === SEND_MESSAGE || action.type === BROADCAST_MESSAGE) {
      await sendMessage(action, connectionsPromise);
    }
    next(action);
  };
};

async function sendMessage(action, connectionsPromise) {
  const message = await toRTCMessage(action.payload);
  const connections = await connectionsPromise;
  if (action.type === BROADCAST_MESSAGE) {
    connections.broadcast(message);
  } else {
    connections.send(action.payload.to, message);
  }
}

async function toRTCMessage(message) {
  const payload = await toRTCPayload(message.payload);
  if (payload === message.payload) {
    return message;
  } else {
    return { ...message, payload };
  }
}

async function toRTCPayload(action) {
  if (action.type === STORE_IMAGE) {
    return toRTCStoreImage(action);
  } else {
    return action;
  }
}
