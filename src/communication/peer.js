import PeerJSPeer from "peerjs";
import { fetchId } from "../app/identity";

const Peer = createPeer();

export const getPeer = () => Peer;

function createPeer() {
  const peer = new PeerJSPeer(fetchId());
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
