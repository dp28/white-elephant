import cuid from "cuid";
import { fetchId } from "../app/identity";

export const MESSAGE = "MESSAGE";
export const REQUEST = "REQUEST";
export const RESPONSE = "RESPONSE";
export const BROADCAST = "BROADCAST";

export function buildMessage({ type, to, payload }) {
  return {
    id: cuid(),
    createdAt: new Date().toISOString(),
    messageType: type || MESSAGE,
    from: fetchId(),
    to,
    payload,
  };
}

export const buildRequest = ({ to, payload }) =>
  buildMessage({ type: REQUEST, to, payload });

export const buildResponse = ({ request, payload }) => ({
  ...buildMessage({ type: RESPONSE, to: request.from, payload }),
  replyingTo: request.id,
});

export const buildBroadcast = ({ payload }) =>
  buildMessage({ type: BROADCAST, payload });
