const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: process.env.PORT || 443,
  key: "white-elephant",
  allow_discovery: false,
  secure: true,
});

peerServer.on("connection", (client) => console.log("Connected:", client.id));
peerServer.on("disconnect", (client) =>
  console.log("Disconnected:", client.id)
);
