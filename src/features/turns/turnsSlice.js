import { createSlice } from "@reduxjs/toolkit";
import { gameReducers } from "../game/gameActions";
import { addPlayer } from "../players/playersSlice";
import { startExchangingGifts } from "../game/gameSlice";

export const turnsSlice = createSlice({
  name: "turns",
  initialState: {
    currentTurn: null,
    upcomingTurns: [],
    hostId: null,
    maxNumberOfStealsPerTurn: 3,
  },
  reducers: gameReducers({
    stealGift: (state, action) => {
      if (
        allowedToPerformTurn({
          turn: state.currentTurn,
          performedByHost: action.payload.performedByHost,
          performedByPlayerId: action.payload.performedByPlayerId,
          forPlayerId: action.payload.forPlayerId,
        })
      ) {
        state.currentTurn.stolenGifts.push({
          giftId: action.payload.giftId,
          fromPlayerId: action.payload.fromPlayerId,
          toPlayerId: action.payload.toPlayerId,
        });
        state.currentTurn.currentPlayerId = action.payload.fromPlayerId;
      }
    },
    openGift: (state, action) => {
      if (
        allowedToPerformTurn({
          turn: state.currentTurn,
          performedByHost: action.payload.performedByHost,
          performedByPlayerId: action.payload.performedByPlayerId,
        })
      ) {
        moveToNextTurn(state);
      }
    },
  }),
  extraReducers: (builder) => {
    builder.addCase("game/setGameState", (state, action) => {
      state.upcomingTurns = action.payload.turns.upcomingTurns;
      state.currentTurn = action.payload.turns.currentTurn;
      state.maxNumberOfStealsPerTurn =
        action.payload.turns.maxNumberOfStealsPerTurn;
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
          stolenGifts: [],
          currentPlayerId: turn.playerId,
        })
      );
      moveToNextTurn(state);
    });
  },
});

export const { stealGift, openGift } = turnsSlice.actions;

export const selectUpcomingTurns = (state) => state.turns.upcomingTurns;
export const selectTurnsState = (state) => state.turns;

export const selectCurrentTurn = (state) => state.turns.currentTurn;

export default turnsSlice.reducer;

function allowedToPerformTurn({ turn, performedByPlayerId, performedByHost }) {
  return performedByPlayerId === turn.currentPlayerId || performedByHost;
}

function moveToNextTurn(turnsState) {
  const wrappedGiftCount = turnsState.upcomingTurns.filter(
    (turn) => !turn.repeat
  ).length;

  const currentTurn = turnsState.upcomingTurns.shift();

  turnsState.currentTurn = {
    ...currentTurn,
    wrappedGiftCount,
    maxSteals: calculateMaxSteals(turnsState),
  };
}

function calculateMaxSteals(turnsState) {
  const { upcomingTurns, maxNumberOfStealsPerTurn } = turnsState;
  if (upcomingTurns.length >= 1) {
    return { limited: false };
  }

  const openedGiftCount = turnsState.currentTurn.index;

  return {
    limited: true,
    count: Math.min(openedGiftCount, maxNumberOfStealsPerTurn),
  };
}
