import React from "react";
import { Card, Typography, CardHeader, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { selectGame } from "../game/gameSlice";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";
import { selectCurrentTurn } from "./turnsSlice";

const useStyles = makeStyles((theme) => ({
  notification: {
    marginBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export function CurrentTurnNotification() {
  const classes = useStyles();
  const currentTurn = useSelector(selectCurrentTurn);
  const player = useSelector(selectPlayer(currentTurn.playerId));
  const isHost = fetchId() === useSelector(selectGame).hostId;
  const isSelf = player.id === fetchId();

  if (isSelf) {
    return (
      <Card className={classes.notification}>
        <CardHeader title="It's your turn!" />
        <CardContent>
          <Typography>{chooseInstructions(currentTurn)}</Typography>
        </CardContent>
      </Card>
    );
  } else if (isHost) {
    return (
      <Card className={classes.notification}>
        <CardHeader title={`It's ${player.name}'s turn`} />
        <CardContent>
          <Typography>
            As the host, you can either wait for {player.name} to take their
            turn or you can take it for them. If you decide to take it for them,
            you {chooseHostInstructions(currentTurn)}
          </Typography>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className={classes.notification}>
        <CardHeader title={`It's ${player.name}'s turn`} />
        <CardContent>
          <Typography>{chooseComments(currentTurn)}</Typography>
        </CardContent>
      </Card>
    );
  }
}

function chooseInstructions(currentTurn) {
  if (currentTurn.index === 0) {
    return "Choose a gift to open.";
  } else if (currentTurn.repeat) {
    return "Choose a gift to steal";
  } else {
    return "You can either choose to open a new gift or choose to steal a gift someone has already opened.";
  }
}

function chooseHostInstructions(currentTurn) {
  if (currentTurn.index === 0) {
    return "should choose a gift to open.";
  } else if (currentTurn.repeat) {
    return "should choose a gift to steal";
  } else {
    return "can either choose to open a new gift or choose to steal a gift someone has already opened.";
  }
}

function chooseComments(currentTurn) {
  if (currentTurn.index === 0) {
    return "They must choose a gift to open.";
  } else if (currentTurn.repeat) {
    return "They must choose a gift to steal";
  } else {
    return "They can either choose to open a new gift or choose to steal a gift someone has already opened.";
  }
}
