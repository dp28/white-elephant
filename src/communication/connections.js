import { getPeer } from "./peer";
import { listen } from "./handleMessages";
import {
  addConnection,
  logConnectionError,
  disconnect,
  startConnecting,
} from "../features/connections/connectionsSlice";
import { fetchId } from "../app/identity";

export async function buildConnections(store) {
  const peer = await getPeer();
  const connections = {};

  peer.on("connection", (connection) => {
    const id = connection.metadata.id;
    connections[id] = connection;
    store.dispatch(addConnection({ id, incoming: true }));
    listen({ connection, store });
  });

  const connect = (id) => {
    console.debug("Connecting to", id);

    if (connections[id]) {
      console.debug("Already connect to", id);
      return Promise.resolve(connections[id]);
    }

    store.dispatch(startConnecting(id));

    return new Promise((resolve, reject) => {
      const connection = peer.connect(id, {
        metadata: { id: fetchId() },
        reliable: true,
      });

      connection.on("open", () => {
        console.debug("Connected to", id);
        connections[id] = connection;
        store.dispatch(addConnection({ id }));
        resolve(connection);
      });

      connection.on("error", (error) => {
        console.error("Failed to connect", error);
        store.dispatch(logConnectionError({ id }));
        reject(error);
      });

      connection.on("close", () => {
        console.debug("Closed", id);
        store.dispatch(disconnect({ id }));
      });

      listen({ connection, store });
    });
  };

  const send = async (id, message) => {
    const connection = await connect(id);
    console.debug("Sending", { message, to: id, open: connection.open });
    connection.send(message);
  };

  const broadcast = (message) => {
    console.debug("Broadcasting", message, "to", Object.keys(connections));
    Object.values(connections).forEach((connection) => {
      connection.send(message);
    });
  };

  return {
    send,
    broadcast,
    connect,
  };
}
