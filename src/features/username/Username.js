import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectUsername, updateUsername } from "./usernameSlice";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export function Username() {
  const classes = useStyles();
  const savedUsername = useSelector(selectUsername) || "";
  const [username, setUsername] = useState(savedUsername);
  const dispatch = useDispatch();

  const editing = username !== savedUsername;

  const onSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      dispatch(updateUsername(username));
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={onSubmit}>
        <FormControl fullWidth={true}>
          <TextField
            label="Player name"
            className={classes.textField}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            margin="normal"
            required={true}
          />
        </FormControl>
        <FormControl fullWidth={false}>
          <Button
            variant="contained"
            disabled={!editing}
            color={editing || !savedUsername ? "primary" : "default"}
            className={classes.button}
            onClick={onSubmit}
          >
            {savedUsername ? "Change name" : "Set name"}
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
