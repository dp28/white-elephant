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
import { updateUsername } from "../username/usernameSlice";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

const useStyles = makeStyles((theme) => ({
  loadingContent: {
    display: "block",
    textAlign: "center",
    padding: theme.spacing(1),
  },
  backdrop: {
    zIndex: 10000,
    padding: theme.spacing(1),
  },
  spinner: {
    marginTop: theme.spacing(2),
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
  emphasis: {
    fontWeight: "bold",
  },
}));

export function JoinGame() {
  const classes = useStyles();
  const { game, loading, joining, error } = useSelector(selectGameToJoin);
  const [player, setPlayer] = useState(null);
  const image = useSelector(selectImage(player?.gift?.imageId));
  const dispatch = useDispatch();

  if (loading) {
    return (
      <Backdrop open={true} className={classes.backdrop}>
        <Card className={classes.loadingContent}>
          <CardContent>
            <Typography>Finding game ...</Typography>
            <CircularProgress color="inherit" className={classes.spinner} />
          </CardContent>
        </Card>
      </Backdrop>
    );
  } else if (error) {
    return (
      <Backdrop open={true} className={classes.backdrop}>
        <Alert severity="error">
          <AlertTitle>Unable to join game</AlertTitle>
          <Typography gutterBottom>
            Unfortunately this game can't be loaded right now. Please confirm
            with the player hosting your game that the game is available. The
            host needs to have the game open on their browser when other players
            try to join.
          </Typography>
          <Typography gutterBottom>
            If the host confirms the game is available, there may be a browser
            or networking error. Try refreshing the page, or opening the link in
            another browser.
          </Typography>
          <Typography gutterBottom>
            If none of these steps work, you can ask the host to add you as an{" "}
            <span className={classes.emphasis}>offline player</span>. You can
            still take part in the game over video chat, but you'll need to tell
            the host what you want to do on your turn and they will take your
            turn for you. You'll also need to send the host your gift
            information.
          </Typography>
          <Typography gutterBottom>
            Alternatively, if you want you can create your own game!
          </Typography>
          <Button
            variant="outlined"
            onClick={() => dispatch(stopJoiningGame())}
          >
            Create new game
          </Button>
        </Alert>
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
              disabled={!player || joining}
              onClick={(event) => {
                event.preventDefault();
                dispatch(updateUsername(player.name));
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
        <Backdrop open={joining} className={classes.backdrop}>
          <Card className={classes.loadingContent}>
            <CardContent>
              <Typography>Joining game ...</Typography>
              <CircularProgress color="inherit" className={classes.spinner} />
            </CardContent>
          </Card>
        </Backdrop>
      </div>
    );
  }
}
