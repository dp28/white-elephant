import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { requestGameToJoin } from "./features/game/gameSlice";
import { listenForUnhandledErrors } from "./features/errorAlerts/globalListener";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

store.dispatch(requestGameToJoin());
listenForUnhandledErrors(store);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
