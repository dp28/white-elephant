import { addError } from "./errorAlertsSlice";

export function listenForUnhandledErrors(store) {
  window.onerror = (message) => {
    store.dispatch(addError({ message }));
  };
}
