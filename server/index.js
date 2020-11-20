const { PeerServer } = require("peer");

PeerServer({
  port: process.env.PORT || 443,
  key: "white-elephant",
  allow_discovery: false,
  secure: true,
});
