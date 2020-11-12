import { createSlice } from "@reduxjs/toolkit";
import { storeData, loadData } from "../../app/persistentStorage";
import { updatePlayerName } from "../players/playersSlice";
import { fetchId } from "../../app/identity";

const USERNAME_KEY = "USERNAME";

export const usernameSlice = createSlice({
  name: "username",
  initialState: {
    username: loadData(USERNAME_KEY) || null,
  },
  reducers: {
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const updateUsername = (username) => (dispatch) => {
  storeData(USERNAME_KEY, username);
  dispatch(usernameSlice.actions.updateUsername(username));
  dispatch(
    updatePlayerName({
      playerId: fetchId(),
      name: username,
    })
  );
};

export const selectUsername = (state) => state.username.username;

export default usernameSlice.reducer;
