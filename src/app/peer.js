import Peer from "peerjs";
import { fetchId } from "./identity";
import { addConnection } from "../features/connections/connectionsSlice";

const peer = new Peer(fetchId());

const connections = {};

export function connect(id) {
  const connection = peer.connect(id, { metadata: { id } });

  return new Promise((resolve, reject) => {
    connection.on("error", reject);
    connection.on("open", () => {
      connections[id] = connection;
      resolve(id);
    });
  });
}

export function startListening(dispatch) {
  peer.on("connection", (connection) => {
    const id = connection.metadata.id;
    connections[id] = connection;
    dispatch(addConnection({ id }));
  });
}
