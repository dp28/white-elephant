import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { selectOpenErrors, dismissError } from "./errorAlertsSlice";

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    position: "fixed",
    top: theme.spacing(1),
    left: "10%",
    width: "80%",
    opacity: 0.85,
    zIndex: 20000,
  },
  error: {
    position: "relative",
    marginTop: theme.spacing(1),
  },
}));

export function ErrorAlert() {
  const classes = useStyles();
  const errors = useSelector(selectOpenErrors);
  const dispatch = useDispatch();

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={classes.errorContainer}>
      {errors.map((error) => (
        <Alert
          key={error.id}
          severity="error"
          className={classes.error}
          onClose={() => dispatch(dismissError({ id: error.id }))}
        >
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      ))}
    </div>
  );
}
