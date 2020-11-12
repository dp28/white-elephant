import React from "react";
import { useSelector } from "react-redux";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectPlayers } from "./playersSlice";
import { Player } from "./Player";

const useStyles = makeStyles((theme) => ({
  players: {
    background: theme.palette.grey[100],
    padding: theme.spacing(1),
  },
}));

export function Players() {
  const classes = useStyles();
  const players = useSelector(selectPlayers);

  return (
    <Paper elevation={0} className={classes.players}>
      <Typography variant="h6">Players</Typography>
      {players.map((player) => (
        <Player player={player} key={player.id} />
      ))}
    </Paper>
  );
}
