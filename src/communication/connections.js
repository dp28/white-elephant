import { getPeer } from "./peer";
import { listen } from "./handleMessages";
import {
  addConnection,
  logConnectionError,
  disconnect,
  startConnecting,
} from "../features/connections/connectionsSlice";
import {
  playerDisconnected,
  hostDisconnected,
} from "../features/players/playersSlice";
import { fetchId } from "../app/identity";
import { selectUsername } from "../features/username/usernameSlice";
import { selectGame } from "../features/game/gameSlice";

export async function buildConnections(store) {
  const peer = await getPeer();
  const connections = {};

  const dispatchPlayerDisconnected = (connectionId) => {
    const hostId = selectGame(store.getState())?.hostId;
    if (hostId === fetchId()) {
      store.dispatch(playerDisconnected({ playerId: connectionId }));
    } else if (hostId === connectionId) {
      store.dispatch(hostDisconnected({ playerId: connectionId }));
    }
  };

  const startListening = ({ connection, connectionId }) => {
    console.debug("adding connection", connectionId);
    connections[connectionId] = connection;
    listen({ connection, store });

    connection.on("open", () => {
      console.debug("Connected to", connectionId);
      store.dispatch(addConnection({ id: connectionId }));
    });

    connection.on("error", (error) => {
      console.error("Failed to connect", error);
      delete connections[connectionId];
      store.dispatch(logConnectionError({ id: connectionId }));
      dispatchPlayerDisconnected(connectionId);
    });

    connection.on("close", () => {
      console.debug("Closed", connectionId);
      delete connections[connectionId];
      store.dispatch(disconnect({ id: connectionId }));
      dispatchPlayerDisconnected(connectionId);
    });
  };

  const connect = (id) => {
    console.debug("Connecting to", id);

    if (connections[id]) {
      console.debug("Already connected to", id);
      return Promise.resolve(connections[id]);
    }

    if (id === fetchId()) {
      return Promise.reject(new Error("Can't connect to self"));
    }

    store.dispatch(startConnecting(id));

    const connection = peer.connect(id, {
      metadata: { id: fetchId(), name: selectUsername(store.getState()) },
      reliable: true,
    });

    const result = new Promise((resolve, reject) => {
      connection.on("open", () => {
        resolve(connection);
      });

      connection.on("error", reject);
    });

    startListening({ connection, connectionId: id });

    return result;
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

  const relay = (message) => {
    const connectionIds = Object.keys(connections).filter(
      (id) => id !== message.except
    );
    console.debug("Relaying", message, "to", connectionIds);
    connectionIds.forEach((connectionId) => {
      send(connectionId, message);
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
    relay,
  };
}
