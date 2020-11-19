import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectGift } from "./giftsSlice";
import { selectImage } from "../images/imagesSlice";
import { selectGame } from "../game/gameSlice";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import { openGift, selectCurrentTurn, stealGift } from "../turns/turnsSlice";
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
    height: "100%",
    width: "100%",
  },
  imageWrapper: {
    height: "80%",
    width: "100%",
  },
  actionArea: {
    height: "100%",
    width: "100%",
  },
  ownerLabel: {
    fontSize: "1em",
    color: theme.palette.grey[600],
  },
  actionPrompt: {
    position: "absolute",
    backgroundColor: theme.palette.grey[100] + "33",
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  actionPromptInner: {
    padding: theme.spacing(1),
    cursor: "pointer",
  },
}));

export function Gift({ id, openable = false }) {
  const classes = useStyles();
  const gift = useSelector(selectGift(id));
  const owner = useSelector(selectPlayer(gift.ownerId));
  const game = useSelector(selectGame);
  const image = useSelector(selectImage(gift.imageId));
  const currentTurn = useSelector(selectCurrentTurn);
  const [emphasized, setEmphasized] = useState(false);
  const dispatch = useDispatch();
  const canSteal = calculateCanSteal(currentTurn, gift, game.hostId);

  const whenCanInteract = (func) => (event) => {
    if ((openable && gift.wrapped) || canSteal) {
      func(event);
    }
  };

  const performAction = () => {
    const params = {
      performedByPlayerId: fetchId(),
      performedByHost: fetchId() === game.hostId,
      giftId: gift.id,
      forPlayerId: currentTurn.currentPlayerId,
    };
    const action = canSteal
      ? stealGift({ ...params, fromPlayerId: gift.ownerId })
      : openGift(params);
    dispatch(action);
    setEmphasized(false);
  };

  return (
    <Card
      className={classes.giftContainer}
      raised={emphasized}
      onMouseOver={whenCanInteract(() => setEmphasized(true))}
    >
      {emphasized && (
        <div
          className={classes.actionPrompt}
          onClick={performAction}
          onMouseOut={() => setEmphasized(false)}
        >
          <Card className={classes.actionPromptInner}>
            <Typography>
              {canSteal ? `Steal ${gift.name} from ${owner.name}` : "Open"}
            </Typography>
          </Card>
        </div>
      )}

      {gift.wrapped && (
        <div className={classes.actionArea}>
          <div
            className={classes.wrapping}
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
            <Typography className={classes.ownerLabel}>
              Currently held by {owner.name}
            </Typography>
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

function calculateCanSteal(
  { maxSteals, stolenGifts, currentPlayerId },
  gift,
  hostId
) {
  return (
    (currentPlayerId === fetchId() || hostId === fetchId()) &&
    !gift.wrapped &&
    gift.ownerId !== currentPlayerId &&
    stolenGifts[stolenGifts.length - 1]?.giftId !== gift.id &&
    (!maxSteals.limited || maxSteals.count > stolenGifts.length)
  );
}
