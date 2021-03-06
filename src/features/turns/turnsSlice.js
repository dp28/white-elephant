import { createSlice } from "@reduxjs/toolkit";
import { gameReducers } from "../game/gameActions";
import { addPlayer } from "../players/playersSlice";
import { startExchangingGifts } from "../game/gameSlice";

const InitialState = {
  currentTurn: null,
  upcomingTurns: [],
  hostId: null,
  maxNumberOfStealsPerTurn: 3,
};

export const turnsSlice = createSlice({
  name: "turns",
  initialState: InitialState,
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

    builder.addCase("game/startNewGame", (state) => {
      state.currentTurn = InitialState.currentTurn;
      state.upcomingTurns = InitialState.upcomingTurns;
      state.hostId = InitialState.hostId;
      state.maxNumberOfStealsPerTurn = InitialState.maxNumberOfStealsPerTurn;
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
    maxSteals: calculateMaxSteals(
      currentTurn,
      turnsState.maxNumberOfStealsPerTurn
    ),
  };
}

function calculateMaxSteals(currentTurn, maxNumberOfStealsPerTurn) {
  if (currentTurn.repeat) {
    return { limited: false };
  }

  if (maxNumberOfStealsPerTurn <= 0) {
    return {
      limited: true,
      count: 0,
    };
  }

  const openedGiftCount = currentTurn.index;

  return {
    limited: true,
    count:
      openedGiftCount === 0
        ? 0
        : openedGiftCount === 1
        ? 1
        : maxNumberOfStealsPerTurn,
  };
}
