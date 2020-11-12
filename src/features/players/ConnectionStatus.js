import React from "react";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { fetchId } from "../../app/identity";

const useStyles = makeStyles((theme) => ({
  circle: {
    height: "1em",
    width: "1em",
    borderRadius: "1em",
    display: "inline-block",
    flexGrow: 0,
  },
  connected: {
    background: theme.palette.success.main,
  },
  disconnected: {
    background: theme.palette.error.main,
  },
}));

export function ConnectionStatus({ player }) {
  const classes = useStyles();
  const content = calculateContent(player, classes);
  if (!content) {
    return null;
  }
  return (
    <Tooltip title={content.message} aria-label={content.message}>
      <div className={`${content.className} ${classes.circle}`}></div>
    </Tooltip>
  );
}

function calculateContent(player, classes) {
  if (player.id === fetchId()) {
    return null;
  } else if (player.connected) {
    return { className: classes.connected, message: "Connected" };
  } else {
    return { className: classes.disconnected, message: "Disonnected" };
  }
}
