import { createSlice } from "@reduxjs/toolkit";
import { addPlayer } from "../players/playersSlice";
import { startExchangingGifts } from "../game/gameSlice";
import { sortByOrdering } from "../../utils/arrays";
import { openGift, stealGift } from "../turns/turnsSlice";

export const giftsSlice = createSlice({
  name: "gifts",
  initialState: {
    giftsById: {},
  },
  reducers: {},
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

    builder.addCase(startExchangingGifts, (state, action) => {
      action.payload.orderedGiftIds.forEach((giftId, index) => {
        state.giftsById[giftId].ordering = index;
      });
    });

    builder.addCase(openGift, (state, action) => {
      const gift = state.giftsById[action.payload.giftId];
      gift.wrapped = false;
      gift.ownerId = action.payload.forPlayerId;
    });

    builder.addCase(stealGift, (state, action) => {
      const previousGift = Object.values(state.giftsById).find(
        (otherGift) => otherGift.ownerId === action.payload.forPlayerId
      );
      const gift = state.giftsById[action.payload.giftId];
      gift.ownerId = action.payload.forPlayerId;

      if (previousGift) {
        previousGift.ownerId = action.payload.fromPlayerId;
      }
    });

    builder.addCase("game/startNewGame", (state) => {
      state.giftsById = {};
    });
  },
});

export const selectGifts = (state) =>
  sortByOrdering(Object.values(state.gifts.giftsById));
export const selectGiftsById = (state) => state.gifts.giftsById;
export const selectGift = (id) => (state) => state.gifts.giftsById[id];

export default giftsSlice.reducer;
