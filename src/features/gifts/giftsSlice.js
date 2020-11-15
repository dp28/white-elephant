import { createSlice } from "@reduxjs/toolkit";
import cuid from "cuid";
import { gameReducers } from "../game/gameActions";
import { addPlayer } from "../players/playersSlice";

export const giftsSlice = createSlice({
  name: "gifts",
  initialState: {
    giftsById: {},
  },
  reducers: gameReducers({}),
  extraReducers: (builder) => {
    builder.addCase("game/setGameState", (state, action) => {
      state.giftsById = action.payload.giftsById;
    });

    builder.addCase(addPlayer, (state, action) => {
      const { name, description, imageId } = action.payload.gift;
      const id = cuid();
      state.giftsById[id] = {
        id: id,
        name: name,
        description: description,
        imageId: imageId,
        broughtByPlayerId: action.payload.id,
      };
    });
  },
});

export const selectGifts = (state) => Object.values(state.gifts.giftsById);
export const selectGiftsById = (state) => state.gifts.giftsById;
export const selectGift = (id) => (state) => state.gifts.giftsById[id];

export default giftsSlice.reducer;
