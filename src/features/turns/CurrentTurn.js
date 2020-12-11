import React from "react";
import {
  Card,
  Typography,
  Chip,
  Tooltip,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";
import { selectCurrentTurn } from "./turnsSlice";

const useStyles = makeStyles((theme) => ({
  turn: {
    marginBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  name: {
    flexGrow: 1,
  },
  host: {
    marginRight: theme.spacing(1),
    background: theme.palette.warning.main,
  },
  repeat: {
    marginRight: theme.spacing(1),
  },
  number: {
    height: "100%",
    padding: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
  },
  playerChip: {
    fontSize: "1.1rem",
    marginBottom: theme.spacing(1),
    maxWidth: "100%",
  },
  content: {
    width: "100%",
  },
  stat: {
    fontWeight: "bold",
  },
  info: {
    marginTop: theme.spacing(1),
  },
}));

export function CurrentTurn() {
  const classes = useStyles();
  const turn = useSelector(selectCurrentTurn);
  const player = useSelector(selectPlayer(turn.currentPlayerId));
  const isSelf = player.id === fetchId();

  return (
    <Card className={classes.turn}>
      <CardContent className={classes.content}>
        <Tooltip title={player.name}>
          <Chip
            color={isSelf ? "primary" : "secondary"}
            label={player.name}
            className={classes.playerChip}
          />
        </Tooltip>
        <Typography
          color="textSecondary"
          variant="body1"
          className={classes.info}
        ></Typography>
        <Typography
          color="textSecondary"
          variant="body1"
          className={classes.info}
        >
          Max steals remaining:{" "}
          <span className={classes.stat}>
            {turn.maxSteals.limited
              ? turn.maxSteals.count - turn.stolenGifts.length
              : "unlimited"}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
}
