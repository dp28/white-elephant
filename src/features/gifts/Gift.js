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
  Divider,
  Fade,
} from "@material-ui/core";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";

const useStyles = makeStyles((theme) => ({
  giftContainer: {
    width: "100%",
    height: "300px",
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    position: "relative",
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
  wrapping: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  imageWrapper: {
    height: "80%",
    width: "100%",
  },
  giftName: {
    fontWeight: "bold",
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
}));

export function Gift({ id, interactive = false }) {
  const classes = useStyles();
  const gift = useSelector(selectGift(id));
  const owner = useSelector(selectPlayer(gift.ownerId));
  const game = useSelector(selectGame);
  const image = useSelector(selectImage(gift.imageId));
  const [hovering, setHovering] = useState(false);
  const dispatch = useDispatch();
  const gameFinished = game.state === GameStates.FINISHED;
  const ownedBySelf = owner?.id === fetchId();

  const performAction = () => {
    dispatch(focusOnGift({ giftId: id }));
    setHovering(false);
  };

  return (
    <>
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
          <div
            className={classes.wrapping}
            style={{ backgroundColor: gift.wrapping.colour }}
          ></div>
        ) : (
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
            <CardContent
              className={`${classes.textContent} ${
                ownedBySelf ? classes.ownedBySelf : ""
              }`}
            >
              <Typography className={classes.giftName}>{gift.name}</Typography>
              <Typography className={classes.ownerLabel}>
                {gameFinished ? "Belongs to" : "Currently held by"}{" "}
                {ownedBySelf ? "you" : owner.name}
              </Typography>
            </CardContent>
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
    </>
  );
}
