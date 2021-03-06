import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import connections from "../features/connections/connectionsSlice";
import images from "../features/images/imagesSlice";
import game from "../features/game/gameSlice";
import messages from "../features/messages/messagesSlice";
import username from "../features/username/usernameSlice";
import players from "../features/players/playersSlice";
import gifts from "../features/gifts/giftsSlice";
import turns from "../features/turns/turnsSlice";
import errorAlerts from "../features/errorAlerts/errorAlertsSlice";
import { communicationMiddleware } from "../communication/middleware";
import { gameMiddleware } from "../features/game/gameMiddleware";

export default configureStore({
  reducer: {
    connections,
    images,
    game,
    messages,
    username,
    players,
    gifts,
    turns,
    errorAlerts,
  },
  middleware: [communicationMiddleware, gameMiddleware].concat(
    getDefaultMiddleware()
  ),
});
