import { createSlice } from "@reduxjs/toolkit";
import { gameReducers } from "../game/gameActions";
import { addPlayer } from "../players/playersSlice";

export const giftsSlice = createSlice({
  name: "gifts",
  initialState: {
    giftsById: {},
  },
  reducers: gameReducers({
    unwrapGift: (state, action) => {
      state.giftsById[action.payload].wrapped = false;
    },
  }),
  extraReducers: (builder) => {
    builder.addCase("game/setGameState", (state, action) => {
      state.giftsById = action.payload.giftsById;
    });

    builder.addCase(addPlayer, (state, action) => {
      const { id, name, description, imageId, wrapping } = action.payload.gift;
      state.giftsById[id] = {
        id,
        name,
        description,
        wrapping,
        imageId,
        wrapped: true,
        broughtByPlayerId: action.payload.id,
      };
    });
  },
});

export const selectGifts = (state) => Object.values(state.gifts.giftsById);
export const selectGiftsById = (state) => state.gifts.giftsById;
export const selectGift = (id) => (state) => state.gifts.giftsById[id];

export default giftsSlice.reducer;
