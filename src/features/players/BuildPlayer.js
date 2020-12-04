import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { selectUsername } from "../username/usernameSlice";
import { fetchId } from "../../app/identity";
import { isValidPlayerInput } from "./playerValidity";
import { GiftInput } from "../gifts/GiftInput";
import cuid from "cuid";

const useStyles = makeStyles((theme) => ({
  container: {},
  textField: {
    marginBottom: theme.spacing(4),
  },
}));

export function BuildPlayer({ onPlayerChange, forCurrentUser = true }) {
  const classes = useStyles();
  const username = useSelector(selectUsername);
  const [name, setName] = useState(forCurrentUser ? username || "" : "");
  const [gift, setGift] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const id = forCurrentUser ? fetchId() : cuid();
    const player = { name, id, connectionId: forCurrentUser ? id : null, gift };
    if (isValidPlayerInput(player)) {
      onPlayerChange(player);
    }
  }, [name, gift, onPlayerChange, dispatch, forCurrentUser]);

  return (
    <div className={classes.container}>
      <TextField
        label={forCurrentUser ? "Your player name" : "The player's name"}
        value={name}
        className={classes.textField}
        onChange={(event) => setName(event.target.value)}
        required={true}
        margin="normal"
      />
      <GiftInput onGiftChange={setGift} forCurrentUser={forCurrentUser} />
    </div>
  );
}
