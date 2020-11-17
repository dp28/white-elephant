import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectGifts } from "../gifts/giftsSlice";
import { Gift } from "../gifts/Gift";
import { selectGame, startExchangingGifts } from "./gameSlice";
import { fetchId } from "../../app/identity";
import { CurrentTurnNotification } from "../turns/CurrentTurnNotification";
import { shuffle } from "../../utils/arrays";
import { selectUpcomingTurns } from "../turns/turnsSlice";

const useStyles = makeStyles((theme) => ({
  board: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  offset: theme.mixins.toolbar,
  content: {
    marginTop: theme.spacing(1),
  },
  cover: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: `${theme.palette.grey[900]}33`,
    textAlign: "center",
    verticalAlign: "center",
  },
  text: {
    margin: theme.spacing(3),
  },
}));

export function Board() {
  const classes = useStyles();
  const gifts = useSelector(selectGifts);
  const game = useSelector(selectGame);
  const upcomingTurns = useSelector(selectUpcomingTurns);
  const dispatch = useDispatch();

  if (!game.exchangingGifts) {
    return (
      <div className={classes.board}>
        <div className={classes.cover}>
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
    <div className={classes.board}>
      <Grid container spacing={1} className={classes.content}>
        <Grid item xs={12}>
          <CurrentTurnNotification />
        </Grid>
        {gifts.map((gift) => (
          <Grid key={gift.id} item xs={12} sm={6} md={4}>
            <Gift id={gift.id} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
