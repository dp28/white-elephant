import { REQUEST, buildResponse } from "./messages";
import {
  receiveMessage,
  sendMessage,
} from "../features/messages/messagesSlice";

export function listen({ connection, store }) {
  connection.on("data", (message) => {
    console.debug("Message received", message);
    store.dispatch(receiveMessage(message));

    if (message.messageType === REQUEST) {
      const state = store.getState();
      const responsePayload = calculateResponse(state, message.payload);
      const response = buildResponse({
        request: message,
        payload: responsePayload,
      });
      store.dispatch(sendMessage(response));
      connection.send(response);
    }
  });
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
