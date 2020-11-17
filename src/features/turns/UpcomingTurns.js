import React from "react";
import { useSelector } from "react-redux";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectUpcomingTurns } from "./turnsSlice";
import { Turn } from "./Turn";

const useStyles = makeStyles((theme) => ({
  turns: {
    background: theme.palette.grey[100],
    padding: theme.spacing(1),
  },
}));

export function UpcomingTurns() {
  const classes = useStyles();
  const turns = useSelector(selectUpcomingTurns);

  return (
    <Paper elevation={0} className={classes.turns}>
      <Typography variant="h6">Turns</Typography>
      {turns.map((turn) => (
        <Turn turn={turn} key={turn.index} />
      ))}
    </Paper>
  );
}
