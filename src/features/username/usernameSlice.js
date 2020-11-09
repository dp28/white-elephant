import { createSlice } from "@reduxjs/toolkit";
import { storeData, loadData } from "../../app/persistentStorage";

const USERNAME_KEY = "USERNAME";

export const InitialUsername = loadData(USERNAME_KEY) || null;

export const usernameSlice = createSlice({
  name: "username",
  initialState: {
    username: InitialUsername,
  },
  reducers: {
    updateUsername: (state, action) => {
      state.username = action.username;
    },
  },
});

export const updateUsername = (username) => (dispatch) => {
  storeData(USERNAME_KEY, username);
  dispatch(usernameSlice.actions.updateUsername(username));
};

export const selectUsername = (state) => state.username.username;

export default usernameSlice.reducer;
