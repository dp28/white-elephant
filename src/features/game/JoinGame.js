import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Backdrop,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
} from "@material-ui/core";
import { selectGameToJoin, stopJoiningGame, joinGame } from "./gameSlice";
import { BuildPlayer } from "../players/BuildPlayer";
import { selectImage } from "../images/imagesSlice";

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
    padding: theme.spacing(3),
  },
  content: {
    maxWidth: "600px",
    padding: theme.spacing(1),
  },
}));

export function JoinGame() {
  const classes = useStyles();
  const { game, loading } = useSelector(selectGameToJoin);
  const [player, setPlayer] = useState(null);
  const image = useSelector(selectImage(player?.gift?.imageId));
  const dispatch = useDispatch();

  if (loading) {
    return (
      <Backdrop open={true}>
        <div className={classes.loadingContent}>
          <Typography variant="h6">Finding game ...</Typography>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    );
  } else {
    return (
      <div className={classes.container}>
        <Card className={classes.content}>
          <CardHeader
            title={`Joining "${game.name}"`}
            subheader={`Hosted by ${game.hostName}`}
          />
          <CardContent>
            <BuildPlayer onPlayerChange={setPlayer} />
          </CardContent>
          <CardActions>
            <Button onClick={() => dispatch(stopJoiningGame())}>Cancel</Button>
            <Button
              color="primary"
              disabled={!player}
              onClick={(event) => {
                event.preventDefault();
                dispatch(
                  joinGame({
                    image,
                    player: player,
                    gameId: game.gameId,
                    hostId: game.hostId,
                  })
                );
              }}
            >
              Join Game
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}
