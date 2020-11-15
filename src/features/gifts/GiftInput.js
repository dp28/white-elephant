import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Typography, Button } from "@material-ui/core";
import { isValidGiftInput } from "./giftValidity";
import { createImage, storeImage } from "../images/imagesSlice";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  item: {
    display: "flex",
    flexBasis: "100%",
  },
  imageContainer: {
    display: "flex",
    flexBasis: "100%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  imageOutline: {
    width: "300px",
    height: "300px",
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
}));

export function GiftInput({ onGiftChange }) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const uploadImage = (event) => {
    event.preventDefault();
    const files = event.target.files;
    const image = createImage({ files });
    setImage(image);
    dispatch(storeImage(image));
  };

  useEffect(() => {
    const gift = { name, description, imageId: image?.id };
    if (isValidGiftInput(gift)) {
      onGiftChange(gift);
    }
  }, [name, onGiftChange, description, image]);

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.item}>
        Your gift
      </Typography>
      <Typography className={classes.item}>
        You need to add a gift to join the game. Don't tell anyone what you've
        added, at least until after it's been revealed!
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

      <TextField
        label="Gift description"
        multiline
        className={classes.item}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required={false}
        margin="normal"
        helperText="Optional - any extra details you'd like to add"
      />
    </div>
  );
}
