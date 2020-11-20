import PeerJSPeer from "peerjs";
import { fetchId } from "../app/identity";
import store from "../app/store";
import { addError } from "../features/errorAlerts/errorAlertsSlice";

const Peer = createPeer();

export const getPeer = () => Peer;

function createPeer() {
  const peer = new PeerJSPeer(fetchId(), {
    host: process.env.REACT_APP_HOSTNAME || "localhost",
    port: process.env.REACT_APP_PORT || 9000,
    secure: process.env.REACT_APP_SSL || false,
    key: "white-elephant",
  });
  return new Promise((resolve, reject) => {
    peer.on("error", (error) => {
      console.error("Failed to connect to PeerJS server", error);
      store.dispatch(addError({ message: error.toString() }));
      reject(error);
    });

    peer.on("open", () => {
      console.debug("Connected to server");
      resolve(peer);
    });
  });
}
