import React from "react";
import { Card, Typography, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ConnectionStatus } from "./ConnectionStatus";
import { selectGame } from "../game/gameSlice";
import { useSelector } from "react-redux";
import { fetchId } from "../../app/identity";

const useStyles = makeStyles((theme) => ({
  player: {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  name: {
    flexGrow: 1,
  },
  host: {
    marginRight: theme.spacing(1),
    background: theme.palette.warning.main,
  },
}));

export function Player({ player }) {
  const classes = useStyles();
  const isHost = player.id === useSelector(selectGame).hostId;
  const isSelf = player.id === fetchId();

  return (
    <Card className={classes.player}>
      <Typography className={classes.name}>{player.name}</Typography>{" "}
      {isHost && (
        <Chip
          className={classes.host}
          size="small"
          label="Host"
          color="warning.main"
        />
      )}
      {isSelf && <Chip size="small" label="You" color="primary" />}
      <ConnectionStatus player={player} />
    </Card>
  );
}
