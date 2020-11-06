import { getPeer } from "./peer";
import { listen } from "./handleMessages";

export async function buildConnections(store) {
  const peer = await getPeer();
  const connections = {};

  peer.on("connection", (connection) => {
    const id = connection.metadata.id;
    connections[id] = connection;
    // dispatch(addConnection({ id }));
    listen({ connection, store });
  });

  const connect = (id) => {
    console.debug("Connecting to", id);

    if (connections[id]) {
      console.debug("Already connect to", id);
      return Promise.resolve(connections[id]);
    }

    return new Promise((resolve, reject) => {
      const connection = peer.connect(id, { metadata: { id }, reliable: true });

      connection.on("open", () => {
        console.debug("Connected to", id);
        connections[id] = connection;
        resolve(connection);
      });

      connection.on("error", (error) => {
        console.error("Failed to connect", error);
        reject(error);
      });

      connection.on("close", () => {
        console.error("Closed", id);
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
