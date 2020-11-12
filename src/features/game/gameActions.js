import { fetchId } from "../../app/identity";

export const isGameAction = (action) => action.meta?.isGameAction;

export const gameAction = (reducer) => ({
  reducer,
  prepare: (payload) => ({
    payload,
    meta: { isGameAction: true, from: fetchId() },
  }),
});

export const gameReducers = (reducers) => {
  const mappedReducers = Object.entries(reducers).map(([name, reducer]) => [
    name,
    gameAction(reducer),
  ]);
  return Object.fromEntries(mappedReducers);
};
