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
  selectPlayer,
  playerReconnected,
} from "../features/players/playersSlice";
import { fetchId } from "../app/identity";
import { selectUsername } from "../features/username/usernameSlice";
import { selectGame } from "../features/game/gameSlice";

export async function buildConnections(store) {
  const peer = await getPeer();
  const connectionPromises = {};

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

    connectionPromises[connectionId] = new Promise((resolve, reject) => {
      listen({ connection, store });

      connection.on("open", () => {
        console.debug("Connected to", connectionId);
        store.dispatch(addConnection({ id: connectionId }));
        if (selectPlayer(connectionId)(store.getState())) {
          store.dispatch(playerReconnected({ playerId: connectionId }));
        }
        resolve(connection);
      });

      connection.on("error", (error) => {
        console.error("Failed to connect", error);
        delete connectionPromises[connectionId];
        store.dispatch(logConnectionError({ id: connectionId }));
        dispatchPlayerDisconnected(connectionId);
        reject(error);
      });

      connection.on("close", () => {
        console.debug("Closed", connectionId);
        delete connectionPromises[connectionId];
        store.dispatch(disconnect({ id: connectionId }));
        dispatchPlayerDisconnected(connectionId);
        reject(new Error(`Player ${connectionId} disconnected`));
      });
    });

    return connectionPromises[connectionId];
  };

  const connect = async (id) => {
    console.debug("Connecting to", id);
    const existingConnection = await connectionPromises[id];

    if (existingConnection?.open) {
      console.debug("Already connected to", id);
      return existingConnection;
    }

    if (id === fetchId()) {
      throw new Error("Can't connect to self");
    }

    store.dispatch(startConnecting(id));

    const connection = peer.connect(id, {
      metadata: { id: fetchId(), name: selectUsername(store.getState()) },
      reliable: true,
    });

    return startListening({ connection, connectionId: id });
  };

  const send = async (id, message) => {
    const connection = await connect(id);
    console.debug("Sending", { message, to: id, open: connection.open });
    connection.send(message);
  };

  const broadcast = (message) => {
    console.debug(
      "Broadcasting",
      message,
      "to",
      Object.keys(connectionPromises)
    );
    Object.keys(connectionPromises).forEach((id) => {
      send(id, message);
    });
  };

  const relay = (connectionIds, message) => {
    console.debug("Relaying", message, "to", connectionIds);
    connectionIds.forEach((connectionId) => {
      send(connectionId, message);
    });
  };

  peer.on("connection", (connection) => {
    const id = connection.metadata.id;
    startListening({ connection, connectionId: id });

    store.dispatch(addConnection({ id, incoming: true }));
    if (selectPlayer(id)(store.getState())) {
      store.dispatch(playerReconnected({ playerId: id }));
    }
  });

  return {
    send,
    broadcast,
    connect,
    relay,
  };
}
