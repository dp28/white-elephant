import { createSlice } from "@reduxjs/toolkit";
import { gameReducers } from "../game/gameActions";
import { addPlayer } from "../players/playersSlice";
import { startExchangingGifts } from "../game/gameSlice";

export const turnsSlice = createSlice({
  name: "turns",
  initialState: {
    performedTurns: [],
    upcomingTurns: [],
    hostId: null,
  },
  reducers: gameReducers({
    stealGift: (state, action) => {
      if (
        allowedToPerformTurn({
          turn: state.upcomingTurns[0],
          hostId: state.hostId,
          performedByPlayerId: action.payload.performedByPlayerId,
          forPlayerId: action.payload.forPlayerId,
        })
      ) {
        const currentTurn = state.upcomingTurns.shift();
        state.performedTurns.push({
          ...currentTurn,
          performedByPlayerId: action.payload.performedByPlayerId,
          type: "steal",
          giftId: action.payload.giftId,
          fromPlayerId: action.payload.fromPlayerId,
          forPlayerId: action.payload.forPlayerId,
        });
      }
    },
    openGift: (state, action) => {
      if (
        allowedToPerformTurn({
          turn: state.upcomingTurns[0],
          hostId: state.hostId,
          performedByPlayerId: action.payload.performedByPlayerId,
        })
      ) {
        const currentTurn = state.upcomingTurns.shift();
        state.performedTurns.push({
          ...currentTurn,
          performedByPlayerId: action.payload.performedByPlayerId,
          type: "open",
          giftId: action.payload.giftId,
        });
      }
    },
  }),
  extraReducers: (builder) => {
    builder.addCase("game/setGameState", (state, action) => {
      state.performedTurns = action.payload.turns.performedTurns;
      state.upcomingTurns = action.payload.turns.upcomingTurns;
      state.hostId = action.payload.game.hostId;
    });

    builder.addCase(addPlayer, (state, action) => {
      if (
        !state.upcomingTurns.find(
          ({ playerId }) => playerId === action.payload.id
        )
      ) {
        state.upcomingTurns.push({ playerId: action.payload.id });
      }
    });

    builder.addCase(startExchangingGifts, (state, action) => {
      const orderedTurns = action.payload.orderedTurns;
      state.upcomingTurns = [...orderedTurns, orderedTurns[0]].map(
        (turn, index) => ({
          ...turn,
          index,
          number: index + 1,
          repeat: index >= orderedTurns.length,
        })
      );
    });
  },
});

export const { stealGift, openGift } = turnsSlice.actions;

export const selectUpcomingTurns = (state) => state.turns.upcomingTurns;
export const selectCurrentTurn = (state) => state.turns.upcomingTurns[0];
export const selectTurnsState = (state) => state.turns;

export default turnsSlice.reducer;

function allowedToPerformTurn({ turn, performedByPlayerId, hostId }) {
  return (
    performedByPlayerId === turn.playerId || performedByPlayerId === hostId
  );
}
