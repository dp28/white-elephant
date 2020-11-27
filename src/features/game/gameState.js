import { selectGame } from "./gameSlice";
import { selectPlayersById } from "../players/playersSlice";
import { selectGiftsById } from "../gifts/giftsSlice";
import { selectImages } from "../images/imagesSlice";
import { selectTurnsState } from "../turns/turnsSlice";
import { loadData, storeData } from "../../app/persistentStorage";

const GAME_STATE_KEY = "GAME_STATE";

export function selectGameState(state) {
  const game = selectGame(state);
  const playersById = selectPlayersById(state);
  const giftsById = selectGiftsById(state);
  const images = selectImages(state);
  const turns = selectTurnsState(state);
  return { game, playersById, giftsById, images, turns };
}

export function loadPersistedGameState() {
  return loadData(GAME_STATE_KEY);
}

export function persistGameState(rootState) {
  storeData(GAME_STATE_KEY, selectGameState(rootState));
}

export function clearPersistedGameState() {
  storeData(GAME_STATE_KEY, null);
}
