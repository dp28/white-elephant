import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectGifts, selectFocusedGift } from "../gifts/giftsSlice";
import { Gift } from "../gifts/Gift";
import { selectGame, startExchangingGifts, GameStates } from "./gameSlice";
import { fetchId } from "../../app/identity";
import { shuffle } from "../../utils/arrays";
import { selectUpcomingTurns, selectCurrentTurn } from "../turns/turnsSlice";
import { FocusedGift } from "../gifts/FocusedGift";
import { useGiftGrid } from "./useGiftGrid";

const useStyles = makeStyles((theme) => ({
  board: {
    flexGrow: 1,
    position: "relative",
  },
  offset: theme.mixins.toolbar,
  content: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap",
  },
  waiting: {
    textAlign: "center",
    verticalAlign: "center",
  },
  text: {
    margin: theme.spacing(3),
  },
  gift: {
    margin: theme.spacing(1),
  },
}));

export function Board() {
  const classes = useStyles();
  const gifts = useSelector(selectGifts);
  const game = useSelector(selectGame);
  const currentTurn = useSelector(selectCurrentTurn);
  const upcomingTurns = useSelector(selectUpcomingTurns);
  const focusedGift = useSelector(selectFocusedGift);
  const [giftDimensions, giftGridRef] = useGiftGrid(gifts.length);
  const dispatch = useDispatch();

  const currentPlayerCanTakeTurn =
    game.state === GameStates.STARTED &&
    (game.hostId === fetchId() || currentTurn.currentPlayerId === fetchId());

  if (game.state === GameStates.WAITING) {
    return (
      <div className={classes.board}>
        <div className={classes.waiting}>
          {game.hostId === fetchId() ? (
            <>
              <Typography className={classes.text}>
                Wait until all players have joined, then click the button below
                to start the game
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  event.preventDefault();
                  const orderedGiftIds = shuffle(gifts.map((gift) => gift.id));
                  const orderedTurns = shuffle(upcomingTurns);
                  dispatch(
                    startExchangingGifts({ orderedGiftIds, orderedTurns })
                  );
                }}
              >
                Start game
              </Button>
            </>
          ) : (
            <Typography className={classes.text}>
              Waiting for all players to join and the host to start the game ...
            </Typography>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.board} ref={giftGridRef}>
      <div className={classes.content}>
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className={classes.gift}
            style={{
              width: giftDimensions.width,
              height: giftDimensions.height,
            }}
          >
            <Gift id={gift.id} interactive={currentPlayerCanTakeTurn} />
          </div>
        ))}
      </div>
      {focusedGift && (
        <FocusedGift
          gift={focusedGift}
          interactive={currentPlayerCanTakeTurn}
        />
      )}
    </div>
  );
}
