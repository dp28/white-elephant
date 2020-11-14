import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { selectUsername, updateUsername } from "../username/usernameSlice";
import { fetchId } from "../../app/identity";

const useStyles = makeStyles((theme) => ({
  loadingContent: {
    display: "block",
    textAlign: "center",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  content: {
    padding: theme.spacing(1),
  },
}));

export function BuildPlayer({ onPlayerChange, id = fetchId() }) {
  const classes = useStyles();
  const username = useSelector(selectUsername);
  const [name, setName] = useState(username || "");
  const dispatch = useDispatch();

  useEffect(() => {
    const player = { name, id, connectionId: id };
    if (isValidPlayer(player)) {
      onPlayerChange(player);

      if (id === fetchId()) {
        dispatch(updateUsername(name));
      }
    }
  }, [name, id, onPlayerChange, dispatch]);

  return (
    <div className={classes.container}>
      <TextField
        label="Player name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required={true}
      />
    </div>
  );
}

function isValidPlayer(player) {
  return player.name && player.id && player.connectionId;
}
