import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  selectServerConnection,
  isConnected,
  isDisconnected,
  CONNECTING,
} from "./connectionsSlice";

const useStyles = makeStyles((theme) => ({
  bar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: theme.spacing(1),
    background: theme.palette.grey[300],
  },
  disconnected: {
    background: theme.palette.error.light,
  },
  progress: {
    position: "relative",
    height: "100%",
    background: theme.palette.primary.dark,
  },
}));

export function ConnectionProgress() {
  const classes = useStyles();
  const serverConnection = useSelector(selectServerConnection);
  const [progressRatio, setProgressRatio] = useState(0);

  const {
    status,
    startedAtSecond,
    expectedSecondsToConnect,
  } = serverConnection;

  useEffect(() => {
    if (status !== CONNECTING) {
      return;
    }

    const interval = setInterval(() => {
      const progress = calculateProgressRatio(
        startedAtSecond,
        expectedSecondsToConnect
      );

      setProgressRatio(progress);

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, expectedSecondsToConnect / 100);

    return () => clearInterval(interval);
  }, [setProgressRatio, status, startedAtSecond, expectedSecondsToConnect]);

  if (isConnected(serverConnection)) {
    return null;
  } else if (isDisconnected(serverConnection)) {
    return <div className={`${classes.bar} ${classes.disconnected}`}></div>;
  }

  return (
    <div className={classes.bar}>
      <div
        className={classes.progress}
        style={{ width: `${100 * progressRatio}%` }}
      ></div>
    </div>
  );
}

function calculateProgressRatio(startSecond, expectedDurationInSeconds) {
  const secondsSinceStart = nowInSeconds() - startSecond;
  return Math.min(1, secondsSinceStart / expectedDurationInSeconds);
}

function nowInSeconds() {
  return new Date().getTime() / 1000;
}
