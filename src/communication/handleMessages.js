import { REQUEST, buildResponse } from "./messages";
import {
  receiveMessage,
  sendMessage,
} from "../features/messages/messagesSlice";
import {
  STORE_IMAGE,
  STORE_GIFT_IMAGE,
  toReduxStoreImageAction,
  convertImagesToReduxFormat,
  storeGiftImage,
  toReduxImage,
} from "../features/images/imagesSlice";
import {
  JOIN_GAME,
  REQUEST_GAME_TO_JOIN,
  selectGame,
  setGameState,
  setGameToJoin,
  gameNotFound,
} from "../features/game/gameSlice";
import {
  addPlayer,
  toReduxAddPlayerAction,
  selectPlayer,
} from "../features/players/playersSlice";
import { selectUsername } from "../features/username/usernameSlice";
import { selectGameState } from "../features/game/gameState";

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
  const stateBefore = store.getState();
  const {
    responsePayload,
    actions,
    calculateResponsePayload,
  } = calculateResponse(stateBefore, message.payload);

  if (actions) {
    actions.forEach((action) => store.dispatch(action));
  }

  const response = buildResponse({
    request: message,
    payload: responsePayload || calculateResponsePayload(store.getState()),
  });

  store.dispatch(sendMessage(response));
}

const ResponderMap = {
  [REQUEST_GAME_TO_JOIN]: (state, request) => {
    const game = selectGame(state);
    const username = selectUsername(state);
    const { gameId, playerId } = request.payload;
    if (game && game.id === gameId) {
      if (selectPlayer(playerId)(state)) {
        return { calculateResponsePayload: buildSetGameState };
      }
      return {
        responsePayload: setGameToJoin({
          game: { ...game, hostName: username },
        }),
      };
    }
    return { responsePayload: gameNotFound(gameId) };
  },
  [JOIN_GAME]: (state, request) => {
    const game = selectGame(state);
    const { gameId, player, image } = request.payload;
    if (game && game.id === gameId) {
      const actions = [addPlayer({ ...player, connected: true })];
      if (image) {
        actions.push(storeGiftImage(image));
      }
      return {
        calculateResponsePayload: buildSetGameState,
        actions,
      };
    } else {
      return {
        responsePayload: gameNotFound(gameId),
      };
    }
  },
};

function buildSetGameState(state) {
  return setGameState(selectGameState(state));
}

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
  switch (actionInRTCFormat.type) {
    case STORE_IMAGE:
    case STORE_GIFT_IMAGE:
      return toReduxStoreImageAction(actionInRTCFormat);
    case "players/addPlayer":
      return toReduxAddPlayerAction(actionInRTCFormat);
    case "game/setGameState":
      return {
        ...actionInRTCFormat,
        payload: {
          ...actionInRTCFormat.payload,
          images: convertImagesToReduxFormat(actionInRTCFormat.payload.images),
        },
      };
    case JOIN_GAME:
      const image = actionInRTCFormat.payload.image;
      if (!image) {
        return actionInRTCFormat;
      }
      return {
        ...actionInRTCFormat,
        payload: {
          ...actionInRTCFormat.payload,
          image: toReduxImage(image),
        },
      };
    default:
      return actionInRTCFormat;
  }
}
