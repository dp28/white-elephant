import React from "react";
import { useSelector } from "react-redux";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectPlayers } from "./playersSlice";
import { Player } from "./Player";
import { AddPlayers } from "./AddPlayers";
import { selectGame, GameStates } from "../game/gameSlice";

const useStyles = makeStyles((theme) => ({
  players: {
    background: theme.palette.grey[100],
    padding: theme.spacing(1),
  },
}));

export function Players() {
  const classes = useStyles();
  const players = useSelector(selectPlayers);
  const game = useSelector(selectGame);

  return (
    <Paper elevation={0} className={classes.players}>
      <Typography variant="h6">Players</Typography>
      {game.state === GameStates.WAITING && <AddPlayers />}
      {players.map((player) => (
        <Player player={player} key={player.id} />
      ))}
    </Paper>
  );
}
