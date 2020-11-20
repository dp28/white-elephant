const { PeerServer } = require("peer");

PeerServer({
  port: process.env.PORT || 9000,
  key: "white-elephant",
  allow_discovery: false,
});
