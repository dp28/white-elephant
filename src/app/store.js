import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import connections from "../features/connections/connectionsSlice";
// import images from "../features/images/imagesSlice";
import game from "../features/game/gameSlice";
import messages from "../features/messages/messagesSlice";
import { communicationMiddleware } from "../communication/middleware";

export default configureStore({
  reducer: {
    connections,
    // images,
    game,
    messages,
  },
  middleware: [communicationMiddleware].concat(getDefaultMiddleware()),
});
