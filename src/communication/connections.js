import { getPeer } from "./peer";
import { listen } from "./handleMessages";
import {
  addConnection,
  logConnectionError,
  disconnect,
  startConnecting,
} from "../features/connections/connectionsSlice";
import { addPlayer } from "../features/players/playersSlice";
import { fetchId } from "../app/identity";
import { selectUsername } from "../features/username/usernameSlice";

export async function buildConnections(store) {
  const peer = await getPeer();
  const connections = {};

  const startListening = ({ connection, connectionId }) => {
    connections[connectionId] = connection;
    listen({ connection, store });
  };

  const connect = (id) => {
    console.debug("Connecting to", id);

    if (connections[id]) {
      console.debug("Already connected to", id);
      return Promise.resolve(connections[id]);
    }

    store.dispatch(startConnecting(id));

    const connection = peer.connect(id, {
      metadata: { id: fetchId(), name: selectUsername(store.getState()) },
      reliable: true,
    });
    startListening({ connection, connectionId: id });

    return new Promise((resolve, reject) => {
      connection.on("open", () => {
        console.debug("Connected to", id);
        store.dispatch(addConnection({ id }));
        resolve(connection);
      });

      connection.on("error", (error) => {
        console.error("Failed to connect", error);
        delete connections[id];
        store.dispatch(logConnectionError({ id }));
        reject(error);
      });

      connection.on("close", () => {
        console.debug("Closed", id);
        delete connections[id];
        store.dispatch(disconnect({ id }));
      });
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

  peer.on("connection", (connection) => {
    const id = connection.metadata.id;
    startListening({ connection, connectionId: id });

    store.dispatch(addConnection({ id, incoming: true }));

    store.dispatch(
      addPlayer({ id, connectionId: id, name: connection.metadata.name })
    );
  });

  return {
    send,
    broadcast,
    connect,
  };
}
