import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import connections from "../features/connections/connectionsSlice";
import images from "../features/images/imagesSlice";
import game from "../features/game/gameSlice";
import messages from "../features/messages/messagesSlice";
import username from "../features/username/usernameSlice";
import { communicationMiddleware } from "../communication/middleware";

export default configureStore({
  reducer: {
    connections,
    images,
    game,
    messages,
    username,
  },
  middleware: [communicationMiddleware].concat(getDefaultMiddleware()),
});
