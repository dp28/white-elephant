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
  imageLabel: {
    marginLeft: theme.spacing(2),
  },
  imageForm: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  wrapping: {
    cursor: "pointer",
    padding: theme.spacing(1),
    textAlign: "center",
  },
  wrappingContainer: {
    position: "relative",
    width: ImageSideLength,
    minWidth: ImageSideLength,
    maxWidth: ImageSideLength,
    height: ImageSideLength,
    minHeight: ImageSideLength,
    maxHeight: ImageSideLength,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  wrappingInput: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  colourPicker: {
    position: "absolute",
    zIndex: 1000,
  },
  button: {
    marginTop: theme.spacing(1),
  },
  emphasis: {
    fontWeight: "bold",
  },
}));

export function GiftInput({ onGiftChange, forCurrentUser = true }) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [messageToReceiver, setMessageToReceiver] = useState("");
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
    if (!event.target.files.length) {
      return;
    }
    const image = createImage({ files });
    setImage(image);
    dispatch(storeImage(image));
  };

  useEffect(() => {
    const gift = {
      name,
      imageId: image?.id,
      messageToReceiver: messageToReceiver || null,
      wrapping: { colour: wrappingColour, ribbonColour },
    };
    if (isValidGiftInput(gift)) {
      onGiftChange(gift);
    }
  }, [
    name,
    onGiftChange,
    image,
    wrappingColour,
    ribbonColour,
    messageToReceiver,
  ]);

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.item} gutterBottom>
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

      <div className={classes.imageForm}>
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
          <input hidden type="file" accept="image/*" onChange={uploadImage} />
        </label>

        <div className={classes.imageLabel}>
          <Typography>Upload an image that represents your gift</Typography>

          <Button
            className={classes.button}
            component="label"
            color={image ? "default" : "primary"}
            variant="contained"
          >
            {image ? "Change image" : "Upload image"}
            <input hidden type="file" accept="image/*" onChange={uploadImage} />
          </Button>
        </div>
      </div>

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

        <div className={classes.imageLabel}>
          {showWrappingColourPicker && (
            <ChromePicker
              className={classes.colourPicker}
              color={wrappingColour}
              onChange={({ hex }) => setWrappingColour(hex)}
              onChangeComplete={() => setShowWrappingColourPicker(false)}
            />
          )}

          {showRibbonColourPicker && (
            <ChromePicker
              className={classes.colourPicker}
              color={ribbonColour}
              onChange={({ hex }) => setRibbonColour(hex)}
              onChangeComplete={() => setShowRibbonColourPicker(false)}
            />
          )}
          <Typography className={classes.emphasis}>
            Remember this wrapping!
          </Typography>
          <Typography>
            It's the only way you'll have during the game to identify the gift
            you brought. You don't want to open your own gift, do you?
          </Typography>
          <div>
            <Button
              className={classes.button}
              variant="contained"
              style={{
                backgroundColor: wrappingColour,
                color: calculateContrastingColour(wrappingColour),
              }}
              onClick={() =>
                setShowWrappingColourPicker(!showWrappingColourPicker)
              }
            >
              Change wrapping colour
            </Button>
          </div>

          <div>
            <Button
              className={classes.button}
              variant="contained"
              style={{
                backgroundColor: ribbonColour,
                color: calculateContrastingColour(ribbonColour),
              }}
              onClick={() => setShowRibbonColourPicker(!showRibbonColourPicker)}
            >
              Change ribbon colour
            </Button>
          </div>
        </div>
      </div>

      <div>
        <TextField
          multiline
          label="Secret message"
          placeholder="The gift card redemption code is XYZ123. Hope you enjoy it!"
          className={classes.item}
          value={messageToReceiver}
          onChange={(event) => setMessageToReceiver(event.target.value)}
          required={false}
          margin="normal"
          helperText="A message to be shown only to the person who has this gift when the game finishes. A useful place to put more gift details, like gift card redemption codes, or your contact details if you need to post them the gift."
        />
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
