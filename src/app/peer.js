import Peer from "peerjs";
import { fetchId } from "./identity";
import { addConnection } from "../features/connections/connectionsSlice";
import { receiveImage } from "../features/images/imagesSlice";

const peer = new Peer(fetchId());

const connections = {};

export function connect(id, dispatch) {
  const connection = peer.connect(id, { metadata: { id }, reliable: true });

  return new Promise((resolve, reject) => {
    connection.on("error", reject);
    connection.on("open", () => {
      connections[id] = connection;
      listenForData(connection, dispatch);
      resolve(id);
    });
  });
}

export function startListening(dispatch) {
  peer.on("connection", (connection) => {
    const id = connection.metadata.id;
    connections[id] = connection;
    dispatch(addConnection({ id }));
    listenForData(connection, dispatch);
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

  Object.entries(connections).forEach(([connectionId, connection]) => {
    console.debug("Sending image", fileName, "to", connectionId);
    connection.send({ type: "IMAGE", payload });
  });
}

function listenForData(connection, dispatch) {
  connection.on("data", (data) => {
    console.log("Received", data);
    switch (data.type) {
      case "IMAGE":
        dispatch(receiveImage(data.payload));
        break;
      default:
        console.warn("Received unknown message", data);
    }
  });
}
