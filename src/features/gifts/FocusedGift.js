import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectImage } from "../images/imagesSlice";
import { selectGame, GameStates } from "../game/gameSlice";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Backdrop,
  CardActions,
  Button,
} from "@material-ui/core";
import { openGift, selectCurrentTurn, stealGift } from "../turns/turnsSlice";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";
import { stopFocusingOnGift } from "./giftsSlice";
import { Wrapping } from "./Wrapping";

const useStyles = makeStyles((theme) => ({
  focusedGift: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  content: {
    width: "90%",
    height: "90%",
    maxWidth: "600px",
    maxHeight: "600px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  giftContainer: {
    position: "relative",
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  textContent: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  image: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
  imageWrapper: {
    height: "80%",
    width: "100%",
  },
  actionArea: {
    height: "100%",
    width: "100%",
  },
  giftName: {
    fontSize: "2rem",
  },
  ownerLabel: {
    fontSize: "1.5rem",
    fontStyle: "italic",
  },
  actionWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
}));

export function FocusedGift({ gift, interactive = false }) {
  const classes = useStyles();
  const owner = useSelector(selectPlayer(gift.ownerId));
  const game = useSelector(selectGame);
  const image = useSelector(selectImage(gift.imageId));
  const currentTurn = useSelector(selectCurrentTurn);
  const [unwrapped, setUnwrapped] = useState(false);
  const dispatch = useDispatch();

  const reasonNotToSteal = calculateReasonCurrentPlayerCannotStealGift({
    gift,
    currentTurn,
  });

  const steal = () => {
    dispatch(
      stealGift({
        performedByPlayerId: fetchId(),
        performedByHost: fetchId() === game.hostId,
        giftId: gift.id,
        forPlayerId: currentTurn.currentPlayerId,
        fromPlayerId: gift.ownerId,
      })
    );
  };

  const unwrap = () => {
    dispatch(
      openGift({
        performedByPlayerId: fetchId(),
        performedByHost: fetchId() === game.hostId,
        giftId: gift.id,
        forPlayerId: currentTurn.currentPlayerId,
      })
    );
    setUnwrapped(true);
  };

  const unfocus = () => dispatch(stopFocusingOnGift());

  return (
    <Backdrop className={classes.focusedGift} open>
      <div className={classes.content}>
        <Card className={classes.giftContainer}>
          <Wrapping
            wrappingColour={gift.wrapping.colour}
            wrapped={gift.wrapped}
          />

          {!gift.wrapped && (
            <>
              {image && (
                <div className={classes.imageWrapper}>
                  <CardMedia
                    image={image.url}
                    title={gift.name}
                    className={classes.image}
                  />
                  <Divider />
                </div>
              )}
              <CardContent className={classes.textContent}>
                <Typography className={classes.giftName}>
                  {gift.name}
                </Typography>
              </CardContent>
            </>
          )}
        </Card>

        <div className={classes.actionWrapper}>
          <Card>
            <CardContent>
              {interactive &&
                gift.wrapped &&
                "Would you like to open this gift?"}
              {interactive &&
                !gift.wrapped &&
                !unwrapped &&
                reasonNotToSteal &&
                `You can't steal this gift - ${reasonNotToSteal}`}
              {interactive && !gift.wrapped && !reasonNotToSteal && !unwrapped && (
                <span>
                  Steal <span>{gift.name}</span> from <span>{owner.name}</span>?
                </span>
              )}
              {unwrapped && (
                <span>
                  You unwrapped <span>{gift.name}</span>!
                </span>
              )}
              {!interactive &&
                `${GameStates.FINISHED ? "Owned by" : "Currently held by"} ${
                  owner.name
                }`}
            </CardContent>
            <Divider />
            <CardActions>
              {!unwrapped && <Button onClick={unfocus}>Cancel</Button>}
              {unwrapped && (
                <Button color="primary" onClick={unfocus}>
                  Done
                </Button>
              )}
              {interactive && gift.wrapped && (
                <Button color="primary" onClick={unwrap}>
                  Open
                </Button>
              )}
              {interactive && !gift.wrapped && !reasonNotToSteal && !unwrapped && (
                <Button color="primary" onClick={steal}>
                  Steal
                </Button>
              )}
            </CardActions>
          </Card>
        </div>
      </div>
    </Backdrop>
  );
}

function calculateReasonCurrentPlayerCannotStealGift({ gift, currentTurn }) {
  const { maxSteals, stolenGifts, currentPlayerId } = currentTurn;
  if (gift.ownerId === currentPlayerId) {
    return "you can't steal a gift from yourself!";
  }
  if (stolenGifts[stolenGifts.length - 1]?.giftId === gift.id) {
    return "you can't steal back a gift that was just stolen from you!";
  }
  if (maxSteals.limited && maxSteals.count <= stolenGifts.length) {
    return "no more gifts are allowed to be stolen this round!";
  }
  return null;
}
