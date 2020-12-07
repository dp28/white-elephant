import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Typography, Button } from "@material-ui/core";
import { ChromePicker } from "react-color";
import { ratio as calculateContrastRatio } from "get-contrast";
import { isValidGiftInput } from "./giftValidity";
import { createImage, storeImage } from "../images/imagesSlice";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  item: {
    display: "flex",
    flexBasis: "100%",
  },
  imageInput: {
    marginLeft: theme.spacing(1),
    cursor: "pointer",
  },
  imageContainer: {
    display: "flex",
    flexBasis: "100%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  imageOutline: {
    width: "250px",
    height: "250px",
    border: `3px dashed ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
  imageHelp: {
    color: theme.palette.grey[600],
  },
  wrapping: {
    cursor: "pointer",
    padding: theme.spacing(1),
    textAlign: "center",
  },
  colourPicker: {
    position: "absolute",
    zIndex: 1000,
  },
}));

export function GiftInput({ onGiftChange, forCurrentUser = true }) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [colour, setColour] = useState(generateRandomColour());
  const [showColourPicker, setShowColourPicker] = useState(false);
  const dispatch = useDispatch();

  const uploadImage = (event) => {
    event.preventDefault();
    const files = event.target.files;
    const image = createImage({ files });
    setImage(image);
    dispatch(storeImage(image));
  };

  useEffect(() => {
    const gift = {
      name,
      imageId: image?.id,
      wrapping: { colour },
    };
    if (isValidGiftInput(gift)) {
      onGiftChange(gift);
    }
  }, [name, onGiftChange, image, colour]);

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.item}>
        {forCurrentUser ? "Your gift" : "The player's gift"}
      </Typography>
      <Typography className={classes.item}>
        Every player needs to add a gift to join the game. Don't tell anyone
        what you've added, at least until after it's been revealed!
      </Typography>
      <TextField
        label="Gift name"
        placeholder=""
        className={classes.item}
        value={name}
        onChange={(event) => setName(event.target.value)}
        required={true}
        margin="normal"
        helperText="This will be shown to other players once this gift is unwrapped"
      />

      <label className={classes.imageInput}>
        <div className={classes.imageContainer}>
          <div className={classes.imageOutline}>
            {image ? (
              <img
                src={image.url}
                alt={image.fileName}
                className={classes.image}
              />
            ) : (
              <Typography className={classes.imageHelp}>
                Upload an image of your gift
              </Typography>
            )}
          </div>
        </div>

        <Button
          component="label"
          color={image ? "default" : "primary"}
          variant="contained"
        >
          {image ? "Change image" : "Upload image"}
          <input hidden type="file" accept="image/*" onChange={uploadImage} />
        </Button>
      </label>

      <div className={classes.imageInput}>
        <div className={classes.imageContainer}>
          <div
            className={`${classes.imageOutline} ${classes.wrapping}`}
            style={{ backgroundColor: colour }}
            onClick={() => setShowColourPicker(!showColourPicker)}
          >
            <Typography
              className={classes.imageHelp}
              style={{ color: calculateContrastingColour(colour) }}
            >
              Select a colour to wrap your gift in
            </Typography>
          </div>
        </div>

        {showColourPicker && (
          <ChromePicker
            className={classes.colourPicker}
            color={colour}
            onChange={({ hex }) => setColour(hex)}
          />
        )}
      </div>
    </div>
  );
}

function generateRandomColour() {
  const hexValue = Math.floor(Math.random() * 16777215).toString(16);
  return `#${hexValue}`;
}

function calculateContrastingColour(colour) {
  const black = "#000000";
  const white = "#ffffff";
  const blackContrastRatio = calculateContrastRatio(colour, black);
  const whiteContrastRatio = calculateContrastRatio(colour, white);
  if (blackContrastRatio > whiteContrastRatio) {
    return black;
  } else {
    return white;
  }
}
