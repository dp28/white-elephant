import { createSlice } from "@reduxjs/toolkit";
import cuid from "cuid";

export const errorAlertsSlice = createSlice({
  name: "errorAlerts",
  initialState: {
    errorsById: {},
  },
  reducers: {
    addError: {
      reducer: (state, action) => {
        state.errorsById[action.payload.id] = {
          id: action.payload.id,
          message: action.payload.message,
          dismissed: false,
        };
      },
      prepare: (payload) => {
        return {
          payload: {
            ...payload,
            id: cuid(),
          },
        };
      },
    },
    dismissError: (state, action) => {
      state.errorsById[action.payload.id].dismissed = true;
    },
  },
});

export const { addError, dismissError } = errorAlertsSlice.actions;

export const selectOpenErrors = (state) =>
  Object.values(state.errorAlerts.errorsById).filter(
    (error) => !error.dismissed
  );

export default errorAlertsSlice.reducer;
