import { configureStore } from "@reduxjs/toolkit";
import counter from "../features/counter/counterSlice";
import connections from "../features/connections/connectionsSlice";

export default configureStore({
  reducer: {
    counter,
    connections,
  },
});
