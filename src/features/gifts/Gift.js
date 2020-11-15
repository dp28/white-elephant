import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { selectGift } from "./giftsSlice";
import { selectImage } from "../images/imagesSlice";

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    display: "flex",
    flexBasis: "100%",
    margin: theme.spacing(1),
  },
  imageOutline: {
    width: "300px",
    height: "300px",
    backgroundColor: theme.palette.grey[300],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
}));

export function Gift({ id }) {
  const classes = useStyles();
  const gift = useSelector(selectGift(id));
  const image = useSelector(selectImage(gift.imageId));

  return (
    <div className={classes.imageContainer}>
      <div
        className={classes.imageOutline}
        style={{ backgroundColor: gift.wrapping.colour }}
      >
        {image ? (
          <img src={image.url} alt={image.fileName} className={classes.image} />
        ) : (
          gift.name
        )}
      </div>
    </div>
  );
}
