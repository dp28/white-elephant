import { buildConnections } from "./connections";
import {
  SEND_MESSAGE,
  BROADCAST_MESSAGE,
  RELAY_MESSAGE,
} from "../features/messages/messagesSlice";
import {
  STORE_IMAGE,
  toRTCStoreImage,
  toRTCImage,
  asyncConvertImagesRTCFormat,
  STORE_GIFT_IMAGE,
} from "../features/images/imagesSlice";
import { toRTCAddPlayer } from "../features/players/playersSlice";
import { JOIN_GAME } from "../features/game/gameSlice";

export const communicationMiddleware = (store) => {
  const connectionsPromise = buildConnections(store);

  return (next) => (action) => {
    if (
      action.type === RELAY_MESSAGE ||
      action.type === SEND_MESSAGE ||
      action.type === BROADCAST_MESSAGE
    ) {
      sendMessage(action, connectionsPromise);
    }
    next(action);
  };
};

async function sendMessage(action, connectionsPromise) {
  const message = await toRTCMessage(action.payload);
  const connections = await connectionsPromise;
  switch (action.type) {
    case RELAY_MESSAGE:
      connections.relay(action.payload.to, message);
      break;
    case BROADCAST_MESSAGE:
      connections.broadcast(message);
      break;
    default:
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
  switch (action.type) {
    case STORE_IMAGE:
    case STORE_GIFT_IMAGE:
      return toRTCStoreImage(action);
    case "players/addPlayer":
      return toRTCAddPlayer(action);
    case "game/setGameState":
      return {
        ...action,
        payload: {
          ...action.payload,
          images: await asyncConvertImagesRTCFormat(action.payload.images),
        },
      };
    case JOIN_GAME:
      const image = action.payload.image;
      if (!image) {
        return action;
      }
      return {
        ...action,
        payload: {
          ...action.payload,
          image: await toRTCImage(image),
        },
      };
    default:
      return action;
  }
}
