import React from "react";
import {
  Card,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { selectGame, finishGame, GameStates } from "../game/gameSlice";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";
import { selectCurrentTurn } from "./turnsSlice";

const useStyles = makeStyles((theme) => ({
  notification: {
    marginBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

export function CurrentTurnNotification() {
  const classes = useStyles();
  const currentTurn = useSelector(selectCurrentTurn);
  const player = useSelector(selectPlayer(currentTurn.currentPlayerId));
  const game = useSelector(selectGame);
  const gameFinished = game.state === GameStates.FINISHED;
  const isHost = fetchId() === game.hostId;
  const dispatch = useDispatch();

  const isSelf = player.id === fetchId();
  const isOffline = !player.connectionId;
  const canFinishGame = currentTurn.wrappedGiftCount <= 0 && !gameFinished;

  const instructions = buildInstructions(currentTurn);
  const showStolenMessage = currentTurn.stolenGifts.length > 0;

  const finishGameButton = (
    <CardActions>
      <Button
        color="primary"
        onClick={() => dispatch(finishGame())}
        className={classes.finishGameButton}
      >
        Finish game
      </Button>
    </CardActions>
  );

  if (gameFinished) {
    return (
      <Card className={classes.notification}>
        <CardHeader title="Thanks for playing!" />
        <CardContent>
          <Typography>
            All gifts have now been unwrapped and exchanged - hopefully you got
            something you wanted. Or at least got something absolutely
            ridiculous.
          </Typography>
        </CardContent>
      </Card>
    );
  } else if (isSelf) {
    return (
      <Accordion>
        <AccordionSummary
          className={classes.header}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.title}>
            It's your turn
            {showStolenMessage ? " because your gift was stolen!" : "!"}
          </Typography>
          {canFinishGame && finishGameButton}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{instructions.currentPlayer}</Typography>
        </AccordionDetails>
      </Accordion>
    );
  } else if (isHost) {
    return (
      <Accordion>
        <AccordionSummary
          className={classes.header}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.title}>
            It's {player.name}'s turn
            {showStolenMessage ? " because their gift was stolen" : ""}
          </Typography>
          {canFinishGame && finishGameButton}
        </AccordionSummary>
        <AccordionDetails>
          {isOffline ? (
            <Typography>
              {player.name} can't take their turn themselves - as host, you need
              to take it for them. Ask {player.name} what they'd like to do -
              they {instructions.host}
            </Typography>
          ) : (
            <Typography>
              As the host, you can either wait for {player.name} to take their
              turn or you can take it for them. If you decide to take it for
              them, you {instructions.host}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    );
  } else {
    return (
      <Accordion>
        <AccordionSummary
          className={classes.header}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.title}>
            It's {player.name}'s turn
            {showStolenMessage ? " because their gift was stolen" : ""}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{instructions.otherPlayers}</Typography>
        </AccordionDetails>
      </Accordion>
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
