import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Typography, Button } from "@material-ui/core";
import { ChromePicker } from "react-color";
import { ratio as calculateContrastRatio } from "get-contrast";
import { isValidGiftInput } from "./giftValidity";
import { createImage, storeImage } from "../images/imagesSlice";
import { Wrapping } from "./Wrapping";

const ImageSideLength = "250px";

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
    width: ImageSideLength,
    height: ImageSideLength,
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
  wrappingContainer: {
    position: "relative",
    width: ImageSideLength,
    height: ImageSideLength,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  wrappingInput: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
  },
  colourPicker: {
    position: "absolute",
    zIndex: 1000,
  },
  colourPickerButton: {
    display: "block",
    width: ImageSideLength,
    marginBottom: theme.spacing(1),
  },
}));

export function GiftInput({ onGiftChange, forCurrentUser = true }) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [wrappingColour, setWrappingColour] = useState(generateRandomColour());
  const [ribbonColour, setRibbonColour] = useState(generateRandomColour());
  const [showWrappingColourPicker, setShowWrappingColourPicker] = useState(
    false
  );
  const [showRibbonColourPicker, setShowRibbonColourPicker] = useState(false);
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
      wrapping: { colour: wrappingColour, ribbonColour },
    };
    if (isValidGiftInput(gift)) {
      onGiftChange(gift);
    }
  }, [name, onGiftChange, image, wrappingColour, ribbonColour]);

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
          className={classes.colourPickerButton}
          component="label"
          color={image ? "default" : "primary"}
          variant="contained"
        >
          {image ? "Change image" : "Upload image"}
          <input hidden type="file" accept="image/*" onChange={uploadImage} />
        </Button>
      </label>

      <div className={classes.wrappingInput}>
        <div className={classes.wrappingContainer}>
          <Wrapping
            wrappingColour={wrappingColour}
            ribbonColour={ribbonColour}
            animated={false}
            onWrappingClick={() => {
              setShowWrappingColourPicker(!showWrappingColourPicker);
              setShowRibbonColourPicker(false);
            }}
            onRibbonClick={() => {
              setShowRibbonColourPicker(!showRibbonColourPicker);
              setShowWrappingColourPicker(false);
            }}
          />
        </div>

        <Button
          className={classes.colourPickerButton}
          variant="contained"
          style={{
            backgroundColor: wrappingColour,
            color: calculateContrastingColour(wrappingColour),
          }}
          onClick={() => setShowWrappingColourPicker(!showWrappingColourPicker)}
        >
          Change wrapping colour
        </Button>

        {showWrappingColourPicker && (
          <ChromePicker
            className={classes.colourPicker}
            color={wrappingColour}
            onChange={({ hex }) => setWrappingColour(hex)}
            onChangeComplete={() => setShowWrappingColourPicker(false)}
          />
        )}

        <Button
          className={classes.colourPickerButton}
          variant="contained"
          style={{
            backgroundColor: ribbonColour,
            color: calculateContrastingColour(ribbonColour),
          }}
          onClick={() => setShowRibbonColourPicker(!showRibbonColourPicker)}
        >
          Change ribbon colour
        </Button>

        {showRibbonColourPicker && (
          <ChromePicker
            className={classes.colourPicker}
            color={ribbonColour}
            onChange={({ hex }) => setRibbonColour(hex)}
            onChangeComplete={() => setShowRibbonColourPicker(false)}
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
