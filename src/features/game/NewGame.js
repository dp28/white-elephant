import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { startGame, selectGameToJoin } from "./gameSlice";
import { Card, CardContent, CardActions, CardHeader } from "@material-ui/core";
import { BuildPlayer } from "../players/BuildPlayer";
import { updateUsername } from "../username/usernameSlice";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: theme.spacing(3),
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
  },
  button: {
    margin: theme.spacing(1),
  },
  alert: {
    position: "absolute",
    margin: "auto",
    top: theme.spacing(1),
  },
  card: {
    maxWidth: "600px",
  },
}));

export function NewGame() {
  const classes = useStyles();
  const gameToJoin = useSelector(selectGameToJoin);
  const [name, setName] = useState("");
  const [host, setHost] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(updateUsername(host.name));
    dispatch(
      startGame({
        host,
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
      <Card className={classes.card}>
        <CardHeader title="Create a new game" />
        <CardContent>
          <TextField
            label="Game name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            margin="normal"
            required={true}
            helperText="The name players will see when joining your game"
          />
          <BuildPlayer onPlayerChange={setHost} />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            disabled={!name || !host}
            className={classes.button}
            onClick={onSubmit}
          >
            Create game
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
