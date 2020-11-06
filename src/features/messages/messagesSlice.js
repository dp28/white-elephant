import { createSlice } from "@reduxjs/toolkit";
import { RESPONSE, REQUEST } from "../../communication/messages";

export const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    sent: [],
    received: [],
    waitingForResponse: {},
  },
  reducers: {
    sendMessage: (state, action) => {
      const message = action.payload;
      state.sent.push(message);

      if (message.messageType === REQUEST) {
        state.waitingForResponse[message.id] = message;
      }
    },
    receiveMessage: (state, action) => {
      const message = action.payload;
      state.received.push(message);

      if (message.messageType === RESPONSE) {
        delete state.waitingForResponse[message.replyingTo];
      }
    },
  },
});

export const SEND_MESSAGE = "messages/sendMessage";

export const { sendMessage, receiveMessage } = messagesSlice.actions;

export const selectWaitingCount = (state) =>
  Object.keys(state.messages.waitingForResponse).length;

export default messagesSlice.reducer;
