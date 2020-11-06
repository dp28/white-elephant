import { configureStore } from "@reduxjs/toolkit";
import counter from "../features/counter/counterSlice";
import connections from "../features/connections/connectionsSlice";
import images from "../features/images/imagesSlice";
import game from "../features/game/gameSlice";

export default configureStore({
  reducer: {
    counter,
    connections,
    images,
    game,
  },
});
