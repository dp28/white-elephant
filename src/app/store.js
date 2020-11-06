import { configureStore } from "@reduxjs/toolkit";
import counter from "../features/counter/counterSlice";
import connections from "../features/connections/connectionsSlice";
import images from "../features/images/imagesSlice";

export default configureStore({
  reducer: {
    counter,
    connections,
    images,
  },
});
