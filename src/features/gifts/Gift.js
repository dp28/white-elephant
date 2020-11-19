import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectGift } from "./giftsSlice";
import { selectImage } from "../images/imagesSlice";
import { selectGame } from "../game/gameSlice";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@material-ui/core";
import { openGift, selectCurrentTurn } from "../turns/turnsSlice";
import { fetchId } from "../../app/identity";

const useStyles = makeStyles((theme) => ({
  giftContainer: {
    width: "100%",
    height: "300px",
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
  },
  textContent: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
  wrapping: {
    height: "100%",
    width: "100%",
  },
  openable: {
    cursor: "pointer",
  },
  emphasized: {
    filter: "saturate(95%) brightness(95%) ",
  },
  imageWrapper: {
    height: "80%",
    width: "100%",
  },
  actionArea: {
    height: "100%",
    width: "100%",
  },
}));

export function Gift({ id, openable = false }) {
  const classes = useStyles();
  const gift = useSelector(selectGift(id));
  const game = useSelector(selectGame);
  const image = useSelector(selectImage(gift.imageId));
  const currentTurn = useSelector(selectCurrentTurn);
  const [emphasized, setEmphasized] = useState(false);
  const dispatch = useDispatch();

  const whenCanInteract = (func) => (event) => {
    if (openable && gift.wrapped) {
      func(event);
    }
  };

  return (
    <Card
      className={classes.giftContainer}
      raised={emphasized && gift.wrapped}
      onClick={whenCanInteract(() =>
        dispatch(
          openGift({
            performedByPlayerId: fetchId(),
            performedByHost: fetchId() === game.hostId,
            giftId: gift.id,
            forPlayerId: currentTurn.playerId,
          })
        )
      )}
      onMouseOver={whenCanInteract(() => setEmphasized(true))}
      onMouseOut={whenCanInteract(() => setEmphasized(false))}
    >
      {gift.wrapped && (
        <div className={classes.actionArea}>
          <div
            className={`${classes.wrapping} ${
              openable ? classes.openable : ""
            } ${emphasized ? classes.emphasized : ""}`}
            style={calculateStyles(game, gift)}
          ></div>
        </div>
      )}
      {!gift.wrapped && (
        <>
          {image && (
            <div className={classes.imageWrapper}>
              <CardMedia
                image={image.url}
                title={gift.name}
                className={classes.image}
              />
            </div>
          )}
          <CardContent className={classes.textContent}>
            <Typography>{gift.name}</Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
}

function calculateStyles(game, gift) {
  if (game.exchangingGifts && gift.wrapped) {
    return { backgroundColor: gift.wrapping.colour };
  } else {
    return {};
  }
}
