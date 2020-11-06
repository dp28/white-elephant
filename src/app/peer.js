import PeerJSPeer from "peerjs";
import { fetchId } from "./identity";
import { addConnection } from "../features/connections/connectionsSlice";
import { receiveImage } from "../features/images/imagesSlice";
import cuid from "cuid";

const Peer = createPeer();
const getPeer = () => Peer;

const Connections = {};
const Requests = {};

function createPeer() {
  const peer = new PeerJSPeer(fetchId());
  return new Promise((resolve, reject) => {
    peer.on("error", (error) => {
      console.error("Failed to connect to PeerJS server", error);
      reject(error);
    });

    peer.on("open", () => {
      console.debug("Connected to server");
      resolve(peer);
    });
  });
}

export async function connect(id, dispatch) {
  console.debug("Connecting to", id);

  if (Connections[id]) {
    console.debug("Already connect to", id);
    return Promise.resolve(id);
  }

  const peer = await getPeer();

  return new Promise((resolve, reject) => {
    const connection = peer.connect(id, { metadata: { id }, reliable: true });

    listenForData({ connection, dispatch, connectionId: id });

    connection.on("error", (error) => {
      console.error("Failed to connect", error);
      reject(error);
    });

    connection.on("close", () => {
      console.error("Closed", id);
    });

    connection.on("open", () => {
      console.debug("Connected to", id);
      Connections[id] = connection;
      resolve(id);
    });
  });
}

export async function startListening(dispatch) {
  const peer = await getPeer();

  peer.on("connection", (connection) => {
    const id = connection.metadata.id;
    Connections[id] = connection;
    dispatch(addConnection({ id }));
    listenForData({ connection, dispatch, connectionId: id });
  });
}

export async function broadcastImage(image) {
  const { id, fileName, fileType, caption, url } = image;
  const data = await fetch(url).then((r) => r.blob());
  const payload = {
    id,
    fileName,
    fileType,
    caption,
    data,
  };

  Object.keys(Connections).forEach((connectionId) => {
    tell(connectionId, { type: "IMAGE", payload });
  });
}

function tell(connectionId, message) {
  console.debug("Sending message", message, "to", `|${connectionId}|`);
  Connections[connectionId].send(message);
}

export async function ask({ connectionId, requestBody, dispatch }) {
  try {
    console.log(await connect(connectionId, dispatch));
    const request = {
      id: cuid(),
      body: requestBody,
    };

    tell(connectionId, { type: "REQUEST", payload: request });

    const requestData = {
      id: request.id,
      result: deferrable(),
      connectionId,
    };

    Requests[request.id] = requestData;

    setTimeout(() => {
      cancelRequest(request.id, new Error("Request timed out after 5 seconds"));
    }, 5000);

    return requestData.result.promise;
  } catch (error) {
    console.error(error);
  }
}

function listenForData({ connection, dispatch, connectionId }) {
  connection.on("data", (data) => {
    console.log("Received", data);
    switch (data.type) {
      case "IMAGE":
        return dispatch(receiveImage(data.payload));
      case "REQUEST":
        return respond({ connectionId, request: data.payload });
      case "RESPONSE":
        return forwardResponse(data.payload.requestId, data.payload.response);
      default:
        console.error("Received unknown message", data);
    }
  });

  connection.on("error", (error) => {
    cancelRequestsForConnection(connectionId, error);
  });
}

function respond({ request, connectionId }) {
  const response = handleRequest(request.body);
  tell(connectionId, {
    type: "RESPONSE",
    payload: { requestId: request.id, response },
  });
}

function handleRequest(requestBody) {
  switch (requestBody.type) {
    case "JOIN_GAME":
      return true;
    default:
      console.error("Unknown request", requestBody);
      return { type: "RESPONSE_ERROR", payload: "Unknown message" };
  }
}

function forwardResponse(requestId, response) {
  const request = Requests[requestId];
  delete Requests[requestId];

  if (response.type === "RESPONSE_ERROR") {
    request.result.reject(new Error(response.payload));
  } else {
    request.result.resolve(response);
  }
}

function cancelRequestsForConnection(connectionId, error) {
  const requestsToCancel = Object.values(Requests).filter(
    (_) => _.connectionId === connectionId
  );
  requestsToCancel.forEach((request) => {
    cancelRequest(request.id);
  });
}

function cancelRequest(requestId, error) {
  const request = Requests[requestId];

  if (request) {
    request.result.reject(error);
    delete Requests[request.id];
  }
}

function deferrable() {
  const result = {};

  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
