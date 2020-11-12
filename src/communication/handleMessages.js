import { REQUEST, buildResponse } from "./messages";
import {
  receiveMessage,
  sendMessage,
} from "../features/messages/messagesSlice";
import {
  STORE_IMAGE,
  toReduxStoreImageAction,
} from "../features/images/imagesSlice";
import {
  JOIN_GAME,
  selectGame,
  setGameState,
} from "../features/game/gameSlice";
import { selectPlayersById, addPlayer } from "../features/players/playersSlice";

export function listen({ connection, store }) {
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
  const { responsePayload, action } = calculateResponse(state, message.payload);
  const response = buildResponse({
    request: message,
    payload: responsePayload,
  });
  store.dispatch(sendMessage(response));
  connection.send(response);

  if (action) {
    store.dispatch(action);
  }
}

const ResponderMap = {
  [JOIN_GAME]: (state, request) => {
    const game = selectGame(state);
    const { gameId, player } = request.payload;
    if (game && game.id === gameId) {
      const playersById = selectPlayersById(state);
      return {
        responsePayload: setGameState({ game, playersById }),
        action: addPlayer({ ...player, connected: true }),
      };
    } else {
      return {
        responsePayload: {
          type: "GAME_NOT_FOUND",
          payload: {
            gameId: request.payload,
          },
        },
      };
    }
  },
};

const DefaultResponder = (_state, request) => ({
  responsePayload: {
    type: "ERROR",
    payload: {
      message: "Unknown request type",
      request,
    },
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
