import { REQUEST, buildResponse } from "./messages";
import {
  receiveMessage,
  sendMessage,
} from "../features/messages/messagesSlice";
import {
  STORE_IMAGE,
  toReduxStoreImageAction,
} from "../features/images/imagesSlice";

export function listen({ connection, store }) {
  console.log("CALLED LISTEN");
  connection.on("data", (messageInRTCFormat) => {
    console.debug("Message received", messageInRTCFormat);
    const message = toReduxFormat(messageInRTCFormat);
    store.dispatch(receiveMessage(message));

    if (message.containsAction) {
      store.dispatch(message.payload);
    }

    if (message.messageType === REQUEST) {
      respond({ store, message, connection });
    }
  });
}

function respond({ store, message, connection }) {
  const state = store.getState();
  const responsePayload = calculateResponse(state, message.payload);
  const response = buildResponse({
    request: message,
    payload: responsePayload,
  });
  store.dispatch(sendMessage(response));
  connection.send(response);
}

const ResponderMap = {};

const DefaultResponder = (_state, request) => ({
  type: "ERROR",
  payload: {
    message: "Unknown request type",
    request,
  },
});

function calculateResponse(state, request) {
  const responder = ResponderMap[request.type] || DefaultResponder;
  return responder(state, request);
}

function toReduxFormat(message) {
  const payload = toReduxAction(message.payload);
  return { ...message, payload };
}

function toReduxAction(actionInRTCFormat) {
  if (actionInRTCFormat.type === STORE_IMAGE) {
    return toReduxStoreImageAction(actionInRTCFormat);
  } else {
    return actionInRTCFormat;
  }
}
