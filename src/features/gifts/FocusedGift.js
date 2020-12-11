import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";
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
  CardHeader,
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
  secretMessage: {
    margin: theme.spacing(2),
    borderLeft: `3px solid ${theme.palette.primary.dark}`,
    color: theme.palette.primary.dark,
    padding: theme.spacing(1),
    background: theme.palette.grey[100],
    fontStyle: "italic",
  },
}));

export function FocusedGift({ gift, interactive = false }) {
  const classes = useStyles();
  const owner = useSelector(selectPlayer(gift.ownerId));
  const game = useSelector(selectGame);
  const image = useSelector(selectImage(gift.imageId));
  const currentTurn = useSelector(selectCurrentTurn);
  const [unwrapped, setUnwrapped] = useState(false);
  const [revealToHost, setRevealToHost] = useState(false);
  const dispatch = useDispatch();
  const gameFinished = game.state === GameStates.FINISHED;
  const ownedBySelf = owner.id === fetchId();
  const isHost = game.hostId === fetchId();

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
            ribbonColour={gift.wrapping.ribbonColour}
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
          {interactive && (
            <Card>
              <CardContent>
                {gift.wrapped && "Would you like to open this gift?"}
                {!gift.wrapped &&
                  !unwrapped &&
                  reasonNotToSteal &&
                  `You can't steal this gift - ${reasonNotToSteal}`}
                {!gift.wrapped && !reasonNotToSteal && !unwrapped && (
                  <span>
                    Steal <span>{gift.name}</span> from{" "}
                    <span>{owner.name}</span>?
                  </span>
                )}
                {unwrapped && (
                  <span>
                    You unwrapped <span>{gift.name}</span>!
                  </span>
                )}
              </CardContent>
              <Divider />
              <CardActions>
                {!unwrapped && <Button onClick={unfocus}>Cancel</Button>}
                {unwrapped && (
                  <Button color="primary" onClick={unfocus}>
                    Done
                  </Button>
                )}
                {gift.wrapped && (
                  <Button color="primary" onClick={unwrap}>
                    Open
                  </Button>
                )}
                {!gift.wrapped && !reasonNotToSteal && !unwrapped && (
                  <Button color="primary" onClick={steal}>
                    Steal
                  </Button>
                )}
              </CardActions>
            </Card>
          )}

          {gameFinished && (
            <Card>
              <CardHeader
                title={
                  ownedBySelf
                    ? "Your final gift!"
                    : `Now owned by ${owner.name}`
                }
              />
              {gift.messageToReceiver && (
                <>
                  <Divider />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Secret message
                    </Typography>
                    {(ownedBySelf || revealToHost) && (
                      <>
                        <Typography gutterBottom>
                          The player who brought this gift left the following
                          message:
                        </Typography>
                        <Typography className={classes.secretMessage}>
                          {gift.messageToReceiver}
                        </Typography>
                      </>
                    )}
                    {!ownedBySelf && !revealToHost && isHost && (
                      <div className={classes.secretMessageCover}>
                        <Alert severity="warning">
                          <Typography gutterBottom>
                            This message was written for the player who received
                            this gift, not you!
                          </Typography>
                          <Typography gutterBottom>
                            However, as the host, you can still choose to see
                            the message in case the player this was intended for
                            is unable to (eg if they're offline).
                          </Typography>
                          <Typography gutterBottom>
                            If you're sure you want to view this message, click
                            "reveal message" below.
                          </Typography>
                        </Alert>
                      </div>
                    )}
                  </CardContent>
                </>
              )}
              <Divider />
              <CardActions>
                <Button onClick={unfocus}>Cancel</Button>
                {!ownedBySelf && isHost && (
                  <Button onClick={() => setRevealToHost(!revealToHost)}>
                    {revealToHost ? "Hide message" : "Reveal message"}
                  </Button>
                )}
              </CardActions>
            </Card>
          )}
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
