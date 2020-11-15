import { fetchId } from "../../app/identity";

export const isGameAction = (action) => action.meta?.isGameAction;

const GameActionMeta = { isGameAction: true, from: fetchId() };

export const gameAction = (actionBuilder) => {
  if (!actionBuilder.prepare) {
    return {
      reducer: actionBuilder,
      prepare: (payload) => ({
        payload,
        meta: GameActionMeta,
      }),
    };
  }

  const prepare = (originalPayload) => {
    const preparedAction = actionBuilder.prepare(originalPayload);
    return {
      ...preparedAction,
      meta: {
        ...(preparedAction.meta || {}),
        ...GameActionMeta,
      },
    };
  };

  return {
    ...actionBuilder,
    prepare,
  };
};

export const gameReducers = (reducers) => {
  const mappedReducers = Object.entries(reducers).map(([name, reducer]) => [
    name,
    gameAction(reducer),
  ]);
  return Object.fromEntries(mappedReducers);
};
