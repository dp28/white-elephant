import { REQUEST, buildResponse } from "./messages";
import {
  receiveMessage,
  sendMessage,
} from "../features/messages/messagesSlice";
import {
  STORE_IMAGE,
  toReduxStoreImageAction,
  asyncSelectImagesInRTCFormat,
  convertImagesToReduxFormat,
  storeImage,
  toReduxImage,
  selectImages,
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
  selectPlayersById,
  addPlayer,
  toReduxAddPlayerAction,
} from "../features/players/playersSlice";
import { selectUsername } from "../features/username/usernameSlice";
import { selectGiftsById } from "../features/gifts/giftsSlice";

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
  const { responsePayload, actions } = calculateResponse(
    state,
    message.payload
  );
  const response = buildResponse({
    request: message,
    payload: responsePayload,
  });
  store.dispatch(sendMessage(response));

  if (actions) {
    actions.forEach((action) => store.dispatch(action));
  }
}

const ResponderMap = {
  [REQUEST_GAME_TO_JOIN]: (state, request) => {
    const game = selectGame(state);
    const username = selectUsername(state);
    const { gameId } = request.payload;
    if (game && game.id === gameId) {
      return {
        responsePayload: setGameToJoin({
          game: { ...game, hostName: username },
        }),
      };
    } else {
      return { responsePayload: gameNotFound(gameId) };
    }
  },
  [JOIN_GAME]: (state, request) => {
    const game = selectGame(state);
    const { gameId, player, image } = request.payload;
    if (game && game.id === gameId) {
      const playersById = selectPlayersById(state);
      const giftsById = selectGiftsById(state);
      const images = selectImages(state);
      return {
        responsePayload: setGameState({ game, playersById, giftsById, images }),
        actions: [storeImage(image), addPlayer({ ...player, connected: true })],
      };
    } else {
      return {
        responsePayload: gameNotFound(gameId),
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
  switch (actionInRTCFormat.type) {
    case STORE_IMAGE:
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
      return {
        ...actionInRTCFormat,
        payload: {
          ...actionInRTCFormat.payload,
          image: toReduxImage(actionInRTCFormat.payload.image),
        },
      };
    default:
      return actionInRTCFormat;
  }
}
