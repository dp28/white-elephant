import React from "react";
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
import { Username } from "../username/Username";
import { selectUsername } from "../username/usernameSlice";

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

export function JoinGame() {
  const classes = useStyles();
  const { game, loading } = useSelector(selectGameToJoin);
  const username = useSelector(selectUsername);
  const dispatch = useDispatch();

  if (loading) {
    return (
      <Backdrop open={true}>
        <div className={classes.loadingContent}>
          <Typography variant="h6">Trying to join game ...</Typography>
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
            <div className={classes.username}>
              <Username />
            </div>
          </CardContent>
          <CardActions>
            <Button onClick={() => dispatch(stopJoiningGame())}>Cancel</Button>
            <Button
              color="primary"
              disabled={!username}
              onClick={(event) => {
                event.preventDefault();
                console.log("CLICK JOIN", game);
                dispatch(
                  joinGame({
                    username,
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