import React from "react";
import { Card, Typography, Chip, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { ConnectionStatus } from "../players/ConnectionStatus";
import { selectGame } from "../game/gameSlice";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";

const useStyles = makeStyles((theme) => ({
  player: {
    display: "flex",
    alignItems: "center",
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
}));

export function Turn({ turn }) {
  const classes = useStyles();
  const player = useSelector(selectPlayer(turn.playerId));
  const isHost = player.id === useSelector(selectGame).hostId;
  const isSelf = player.id === fetchId();

  return (
    <Card className={classes.player}>
      <Typography className={classes.number}>{turn.number}</Typography>
      <Typography className={classes.name}>{player.name}</Typography>{" "}
      {turn.repeat && (
        <Tooltip title="This player gets a second turn because their first turn was so early on they did not have the chance to swap their gift">
          <Chip className={classes.repeat} size="small" label="Repeat" />
        </Tooltip>
      )}
      {isHost && <Chip className={classes.host} size="small" label="Host" />}
      {isSelf && <Chip size="small" label="You" color="primary" />}
      <ConnectionStatus player={player} />
    </Card>
  );
}
