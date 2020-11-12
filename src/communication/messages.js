import cuid from "cuid";
import { fetchId } from "../app/identity";

export const MESSAGE = "MESSAGE";
export const REQUEST = "REQUEST";
export const RESPONSE = "RESPONSE";
export const BROADCAST = "BROADCAST";
export const RELAY = "RELAY";

export function buildMessage({ type, to, payload, containsAction = true }) {
  return {
    id: cuid(),
    createdAt: new Date().toISOString(),
    messageType: type || MESSAGE,
    from: fetchId(),
    to,
    payload,
    containsAction,
  };
}

export const buildRequest = ({ to, payload, containsAction = true }) =>
  buildMessage({ type: REQUEST, to, payload, containsAction });

export const buildResponse = ({ request, payload, containsAction = true }) => ({
  ...buildMessage({
    type: RESPONSE,
    to: request.from,
    payload,
    containsAction,
  }),
  replyingTo: request.id,
});

export const buildBroadcast = ({ payload, containsAction = true }) =>
  buildMessage({ type: BROADCAST, payload, containsAction });

export const buildRelay = ({ payload, containsAction = true, except }) => ({
  ...buildMessage({ type: RELAY, payload, containsAction }),
  except,
});
