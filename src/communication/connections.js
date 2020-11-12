import { getPeer } from "./peer";
import { listen } from "./handleMessages";
import {
  addConnection,
  logConnectionError,
  disconnect,
  startConnecting,
} from "../features/connections/connectionsSlice";
import {
  addPlayer,
  playerConnected,
  playerDisconnected,
} from "../features/players/playersSlice";
import { fetchId } from "../app/identity";
import { selectUsername } from "../features/username/usernameSlice";

export async function buildConnections(store) {
  const peer = await getPeer();
  const connections = {};

  const startListening = ({ connection, connectionId }) => {
    connections[connectionId] = connection;
    listen({ connection, store });

    connection.on("open", () => {
      console.debug("Connected to", connectionId);
      store.dispatch(addConnection({ id: connectionId }));
      store.dispatch(playerConnected({ playerId: connectionId }));
    });

    connection.on("error", (error) => {
      console.error("Failed to connect", error);
      delete connections[connectionId];
      store.dispatch(logConnectionError({ id: connectionId }));
      store.dispatch(playerDisconnected({ playerId: connectionId }));
    });

    connection.on("close", () => {
      console.debug("Closed", connectionId);
      delete connections[connectionId];
      store.dispatch(disconnect({ id: connectionId }));
      store.dispatch(playerDisconnected({ playerId: connectionId }));
    });
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
        resolve(connection);
      });

      connection.on("error", reject);
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
  });

  return {
    send,
    broadcast,
    connect,
  };
}
