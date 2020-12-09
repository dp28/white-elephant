import React from "react";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectGame, finishGame, GameStates } from "../game/gameSlice";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";
import { selectCurrentTurn } from "./turnsSlice";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

export function FinishGameButton() {
  const classes = useStyles();
  const currentTurn = useSelector(selectCurrentTurn);
  const player = useSelector(selectPlayer(currentTurn?.currentPlayerId));
  const game = useSelector(selectGame);
  const gameFinished = game.state === GameStates.FINISHED;
  const isHost = fetchId() === game.hostId;
  const dispatch = useDispatch();

  const isSelf = player?.id === fetchId();
  const canFinishGame =
    (isSelf || isHost) && currentTurn?.wrappedGiftCount <= 0 && !gameFinished;

  if (!canFinishGame) {
    return null;
  }
  return (
    <div className={classes.wrapper}>
      <Button
        color="primary"
        variant="contained"
        onClick={() => dispatch(finishGame())}
        className={classes.button}
      >
        Finish game
      </Button>
      <Typography>or continue exchanging gifts</Typography>
    </div>
  );
}
