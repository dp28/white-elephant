import React, { useState } from "react";
import {
  Card,
  CardActions,
  Button,
  CardHeader,
  CardContent,
  Typography,
  Backdrop,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { BuildPlayer } from "./BuildPlayer";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useDispatch } from "react-redux";
import { addPlayer } from "./playersSlice";

const useStyles = makeStyles((theme) => ({
  addOfflinePlayer: {
    position: "fixed",
    margin: "auto",
    top: 0,
    left: 0,
    width: "100%",
    maxHeight: "100%",
    zIndex: 10000,
    overflow: "auto",
  },
  form: {
    maxWidth: "800px",
    padding: theme.spacing(1),
    margin: "auto",
    marginTop: theme.spacing(3),
  },
  instructions: {
    marginTop: theme.spacing(1),
  },
}));

export function AddOfflinePlayer({ onClose }) {
  const classes = useStyles();
  const [player, setPlayer] = useState(null);
  const dispatch = useDispatch();

  return (
    <div className={classes.addOfflinePlayer}>
      <Backdrop open />
      <Card className={classes.form}>
        <CardHeader title="Add an offline player" />
        <CardContent>
          <Alert severity="warning">
            <AlertTitle>Caution! Are you sharing your screen?</AlertTitle>
            If you're on a video call and sharing your screen, you might want to
            stop sharing before adding this player. If you add their gift with
            everyone watching you'll spoil the surprise!
          </Alert>
          <Typography className={classes.instructions}>
            If people want to join your game but can't join it online, you can
            add them as an offline player. They can still take part in the game
            - they just need to send you their gift name and image to join. When
            it's their turn they can tell the host to open or steal gifts for
            them.
          </Typography>
          <BuildPlayer onPlayerChange={setPlayer} forCurrentUser={false} />
        </CardContent>
        <CardActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color="primary"
            disabled={!player}
            onClick={() => {
              dispatch(addPlayer(player));
              onClose();
            }}
          >
            Add player
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
