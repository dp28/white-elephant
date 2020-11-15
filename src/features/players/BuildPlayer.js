import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { selectUsername } from "../username/usernameSlice";
import { fetchId } from "../../app/identity";
import { isValidPlayerInput } from "./playerValidity";
import { GiftInput } from "../gifts/GiftInput";

const useStyles = makeStyles((theme) => ({
  container: {},
  textField: {
    marginBottom: theme.spacing(4),
  },
}));

export function BuildPlayer({ onPlayerChange, id = fetchId() }) {
  const classes = useStyles();
  const username = useSelector(selectUsername);
  const [name, setName] = useState(username || "");
  const [gift, setGift] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const player = { name, id, connectionId: id, gift };
    if (isValidPlayerInput(player)) {
      onPlayerChange(player);
    }
  }, [name, id, gift, onPlayerChange, dispatch]);

  return (
    <div className={classes.container}>
      <TextField
        label="Your player name"
        value={name}
        className={classes.textField}
        onChange={(event) => setName(event.target.value)}
        required={true}
        margin="normal"
      />
      <GiftInput onGiftChange={setGift} />
    </div>
  );
}
