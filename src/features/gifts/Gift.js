import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectGift, focusOnGift } from "./giftsSlice";
import { selectImage } from "../images/imagesSlice";
import { selectGame, GameStates } from "../game/gameSlice";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Fade,
  Chip,
} from "@material-ui/core";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";
import { selectCurrentTurn } from "../turns/turnsSlice";
import { Wrapping } from "./Wrapping";

const useStyles = makeStyles((theme) => ({
  giftContainer: {
    width: "100%",
    height: "100%",
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "visible",
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
    height: "100%",
    width: "100%",
  },
  giftName: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  ownerLabel: {
    fontSize: "1em",
    fontStyle: "italic",
  },
  actionPrompt: {
    position: "absolute",
    backgroundColor: theme.palette.grey[800] + "55",
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  ownedBySelf: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  ownerChip: {
    position: "absolute",
    bottom: -theme.spacing(1),
    right: -theme.spacing(1),
    zIndex: 1000,
    fontSize: "1.1rem",
    maxWidth: "100%",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);",
  },
}));

export function Gift({ id, interactive = false, ribbonColour = "gold" }) {
  const classes = useStyles();
  const gift = useSelector(selectGift(id));
  const owner = useSelector(selectPlayer(gift.ownerId));
  const game = useSelector(selectGame);
  const image = useSelector(selectImage(gift.imageId));
  const currentTurn = useSelector(selectCurrentTurn);
  const [hovering, setHovering] = useState(false);
  const dispatch = useDispatch();
  const ownedBySelf = owner?.id === fetchId();
  const ownedByCurrentTurnPlayer =
    game.state === GameStates.STARTED &&
    owner?.id === currentTurn.currentPlayerId;

  const performAction = () => {
    dispatch(focusOnGift({ giftId: id }));
    setHovering(false);
  };

  return (
    <Card
      className={classes.giftContainer}
      raised={hovering}
      onMouseOver={() => {
        if (interactive) {
          setHovering(true);
        }
      }}
    >
      {gift.wrapped ? (
        <Wrapping wrappingColour={gift.wrapping.colour} />
      ) : (
        <>
          {image ? (
            <div className={classes.imageWrapper}>
              <CardMedia
                image={image.url}
                title={gift.name}
                className={classes.image}
              />
            </div>
          ) : (
            <CardContent className={classes.textContent}>
              <Typography className={classes.giftName}>{gift.name}</Typography>
            </CardContent>
          )}
          <Chip
            className={classes.ownerChip}
            label={owner.name}
            color={
              ownedBySelf
                ? "primary"
                : ownedByCurrentTurnPlayer
                ? "secondary"
                : "default"
            }
          />
        </>
      )}

      <Fade in={hovering}>
        <div
          className={classes.actionPrompt}
          onClick={performAction}
          onMouseOut={() => setHovering(false)}
        ></div>
      </Fade>
    </Card>
  );
}
