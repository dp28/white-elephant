import PeerJSPeer from "peerjs";
import { fetchId } from "../app/identity";

const Peer = createPeer();

export const getPeer = () => Peer;

function createPeer() {
  const peer = new PeerJSPeer(fetchId(), {
    host: process.env.REACT_APP_HOSTNAME || "localhost",
    port: process.env.REACT_APP_PORT || 9000,
    secure: false,
  });
  return new Promise((resolve, reject) => {
    peer.on("error", (error) => {
      console.error("Failed to connect to PeerJS server", error);
      reject(error);
    });

    peer.on("open", () => {
      console.debug("Connected to server");
      resolve(peer);
    });
  });
}
