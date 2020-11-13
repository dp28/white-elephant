import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { startGame, selectGameToJoin } from "./gameSlice";
import { fetchId } from "../../app/identity";

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
  alert: {
    position: "absolute",
    margin: "auto",
    top: theme.spacing(1),
  },
}));

export function NewGame() {
  const classes = useStyles();
  const gameToJoin = useSelector(selectGameToJoin);
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(
      startGame({
        hostId: fetchId(),
        name,
      })
    );
  };
  return (
    <div className={classes.container}>
      {gameToJoin.error && (
        <Alert severity="error" className={classes.alert}>
          <p>{gameToJoin.error}</p>
          <p>
            Unfortunately this game can't be loaded right now. Either ask the
            game host for a new link, or try creating a game yourself!
          </p>
        </Alert>
      )}
      <form className={classes.form} onSubmit={onSubmit}>
        <FormControl fullWidth={true}>
          <TextField
            label="Game name"
            className={classes.textField}
            value={name}
            onChange={(event) => setName(event.target.value)}
            margin="normal"
            required={true}
          />
        </FormControl>
        <FormControl fullWidth={false}>
          <Button
            variant="contained"
            color="primary"
            disabled={!name}
            className={classes.button}
            onClick={onSubmit}
          >
            Create game
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
