import React from "react";
import { useSelector } from "react-redux";
import { Paper, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectUpcomingTurns } from "./turnsSlice";
import { Turn } from "./Turn";
import { CurrentTurn } from "./CurrentTurn";

const useStyles = makeStyles((theme) => ({
  turns: {
    background: theme.palette.grey[100],
    padding: theme.spacing(1),
  },
  title: {
    color: theme.palette.primary.dark,
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

export function UpcomingTurns() {
  const classes = useStyles();
  const turns = useSelector(selectUpcomingTurns);

  return (
    <Paper elevation={0} className={classes.turns}>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Current Turn
      </Typography>
      <CurrentTurn />
      <Divider className={classes.divider} />

      <Typography variant="h6" gutterBottom className={classes.title}>
        Upcoming Turns ({turns.length})
      </Typography>
      {turns.map((turn, index) => (
        <Turn turn={turn} key={turn.index} index={index} />
      ))}
    </Paper>
  );
}
