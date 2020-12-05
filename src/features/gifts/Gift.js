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
  Chip,
} from "@material-ui/core";
import { fetchId } from "../../app/identity";
import { selectPlayer } from "../players/playersSlice";
import { selectCurrentTurn } from "../turns/turnsSlice";

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
  wrapping: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
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
    padding: theme.spacing(1),
    maxWidth: "100%",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);",
  },
  ribbon: {
    position: "absolute",
    boxShadow:
      "0px 1px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 1px 0px rgba(0,0,0,0.12);",
  },
  topRibbon: {
    width: "10%",
    height: "100%",
    top: 0,
    left: "45%",
  },
  bottomRibbon: {
    width: "100%",
    height: "10%",
    left: 0,
    top: "45%",
  },
  ribbonCentre: {
    filter: "brightness(95%)",
    backgroundColor: "inherit",
  },
  ribbonCentreTop: {
    width: "100%",
    height: "50%",
    marginTop: "2.5%",
  },
  ribbonCentreBottom: {
    height: "100%",
    width: "50%",
    marginLeft: "25%",
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
    game.state === GameStates.STARTED && owner?.id === currentTurn.playerId;

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
        <div
          className={classes.wrapping}
          style={{ backgroundColor: gift.wrapping.colour }}
        >
          <div
            className={`${classes.bottomRibbon} ${classes.ribbon}`}
            style={{ backgroundColor: ribbonColour }}
          >
            <div
              className={`${classes.ribbonCentreTop} ${classes.ribbonCentre}`}
            ></div>
          </div>
          <div
            className={`${classes.topRibbon} ${classes.ribbon}`}
            style={{ backgroundColor: ribbonColour }}
          >
            <div
              className={`${classes.ribbonCentreBottom} ${classes.ribbonCentre}`}
            ></div>
          </div>
        </div>
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
