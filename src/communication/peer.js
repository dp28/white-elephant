import PeerJSPeer from "peerjs";
import { fetchId } from "../app/identity";
import store from "../app/store";
import { addError } from "../features/errorAlerts/errorAlertsSlice";
import {
  startConnectingToServer,
  disconnectedFromServer,
  connectedToServer,
} from "../features/connections/connectionsSlice";
import { loadGameDataFromURL } from "../features/game/loadOrJoinGame";
import { failedToConnectToHost } from "../features/game/gameSlice";

const Peer = createPeer();

export const getPeer = () => Peer;

function createPeer({ attemptToRecover = true } = {}) {
  const peer = new PeerJSPeer(fetchId(), {
    host: process.env.REACT_APP_HOSTNAME || "localhost",
    port: process.env.REACT_APP_PORT || 9000,
    secure: process.env.REACT_APP_SSL || false,
    key: "white-elephant",
  });
  return new Promise((resolve, reject) => {
    peer.on("error", (error) => {
      console.error("Failed to connect to PeerJS server", error);
      const recoveryAttempt = attemptToRecover
        ? attemptToRecoverFromConnectionError(error)
        : Promise.reject(error);

      recoveryAttempt.then(resolve).catch(() => {
        store.dispatch(addError({ message: error.toString() }));
        store.dispatch(disconnectedFromServer());
        reject(error);
      });
    });

    peer.on("open", () => {
      console.debug("Connected to server");
      store.dispatch(connectedToServer());
      resolve(peer);
    });
  });
}

// Corresponds to alive_timeout on server
const SECONDS_TO_WAIT_BEFORE_RECONNECTING = 60;

async function attemptToRecoverFromConnectionError(error) {
  if (idAlreadyTaken(error)) {
    // Client has changed network, so server hasn't registered a disconnect,
    // but the client needs to reconnect
    console.debug("Retrying connecting to server after error", error);
    store.dispatch(
      startConnectingToServer({
        secondsToConnect: SECONDS_TO_WAIT_BEFORE_RECONNECTING + 5,
      })
    );

    await wait(SECONDS_TO_WAIT_BEFORE_RECONNECTING);
    return createPeer({ attemptToRecover: false });
  } else if (couldNotConnectToPeer(error)) {
    const peerId = couldNotConnectToPeer(error);
    if (peerId === loadGameDataFromURL().hostId) {
      store.dispatch(failedToConnectToHost({ hostId: peerId }));
    } else {
      throw error;
    }
  } else {
    throw error;
  }
}

function idAlreadyTaken(error) {
  return error.message.match(/ID.*is taken/);
}

function couldNotConnectToPeer(error) {
  return error.message.match(/Could not connect to peer (\w+)/)[1];
}

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, seconds * 1000);
  });
}
