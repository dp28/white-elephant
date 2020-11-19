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
  const player = useSelector(selectPlayer(currentTurn.currentPlayerId));
  const isHost = fetchId() === useSelector(selectGame).hostId;
  const isSelf = player.id === fetchId();

  const instructions = buildInstructions(currentTurn);
  const showStolenMessage = currentTurn.stolenGifts.length > 0;

  if (isSelf) {
    return (
      <Card className={classes.notification}>
        <CardHeader
          title={`It's your turn${
            showStolenMessage ? " because your gift was stolen!" : "!"
          }`}
        />
        <CardContent>
          <Typography>{instructions.currentPlayer}</Typography>
        </CardContent>
      </Card>
    );
  } else if (isHost) {
    return (
      <Card className={classes.notification}>
        <CardHeader
          title={`It's ${player.name}'s turn${
            showStolenMessage ? " because their gift was stolen" : ""
          }`}
        />
        <CardContent>
          <Typography>
            As the host, you can either wait for {player.name} to take their
            turn or you can take it for them. If you decide to take it for them,
            you {instructions.host}
          </Typography>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className={classes.notification}>
        <CardHeader
          title={`It's ${player.name}'s turn${
            showStolenMessage ? " because their gift was stolen" : ""
          }`}
        />
        <CardContent>
          <Typography>{instructions.otherPlayers}</Typography>
        </CardContent>
      </Card>
    );
  }
}

function buildInstructions({ maxSteals, wrappedGiftCount, stolenGifts }) {
  const stealsRemaining = (maxSteals.count || 0) - stolenGifts.length;
  const stealCountString = buildStealCountString(stealsRemaining);
  const giftChoiceString = buildGiftChoiceString(wrappedGiftCount);

  if (maxSteals.limited && stealsRemaining <= 0) {
    return {
      currentPlayer: `Choose ${giftChoiceString} to open.`,
      host: `should choose ${giftChoiceString} to open.`,
      otherPlayers: `They must choose ${giftChoiceString} to open.`,
    };
  } else if (wrappedGiftCount === 0) {
    return {
      currentPlayer:
        "All gifts have been unwrapped! Choose a gift to steal or finish the game.",
      host: " should choose a gift to steal or finish the game.",
      otherPlayers: "They can choose a gift to steal or can finish the game.",
    };
  } else {
    return {
      currentPlayer: `You can either choose to open ${giftChoiceString} or choose to steal a gift someone has already unwrapped. Only ${stealCountString} can be stolen before someone must open a gift`,
      host: `can either choose to open ${giftChoiceString} or choose to steal a gift someone has already unwrapped. Only ${stealCountString} can be stolen before someone must open a gift`,
      otherPlayers: `They can either choose to open ${giftChoiceString} or choose to steal a gift someone has already unwrapped. Only ${stealCountString} can be stolen before someone must open a gift`,
    };
  }
}

function buildGiftChoiceString(wrappedCount) {
  if (wrappedCount === 1) {
    return `the last remaining wrapped gift`;
  } else {
    return `one of the ${wrappedCount} wrapped gifts`;
  }
}

function buildStealCountString(count) {
  if (count === 1) {
    return "1 more gift";
  }
  return `${count} more gifts`;
}
