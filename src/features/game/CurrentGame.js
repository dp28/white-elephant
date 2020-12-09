import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  AppBar,
  Typography,
  Toolbar,
  Grid,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectGame, GameStates } from "./gameSlice";
import { Players } from "../players/Players";
import { Board } from "./Board";
import { selectPlayer } from "../players/playersSlice";
import { fetchId } from "../../app/identity";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { UpcomingTurns } from "../turns/UpcomingTurns";
import { NewGameButton } from "./NewGameButton";
import { CurrentTurnNotification } from "../turns/CurrentTurnNotification";
import { Rules } from "./Rules";
import { FinishGameButton } from "../turns/FinishGameButton";
import { HowToAddPlayers } from "../players/HowToAddPlayers";

const useStyles = makeStyles((theme) => ({
  spinner: {
    marginLeft: "calc(50% - 30px)",
    marginTop: theme.spacing(2),
  },
  game: {
    width: "100%",
    background: theme.palette.grey[100],
    height: "100vh",
  },
  offset: theme.mixins.toolbar,
  boardContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    background: theme.palette.grey[100],
  },
  content: {
    marginTop: theme.spacing(1),
    height: `calc(100vh - ${theme.spacing(1)}px - 64px)`,
  },
  backdrop: {
    zIndex: 10000,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

export function CurrentGame() {
  const classes = useStyles();
  const game = useSelector(selectGame);
  const host = useSelector(selectPlayer(game.hostId));
  const lostConnectionToHost = !host.connected && host.id !== fetchId();

  useEffect(() => {
    document.getElementById("root").classList.add("full-height");
    return () => {
      document.getElementById("root").classList.remove("full-height");
    };
  }, []);

  useEffect(() => {
    const showBrowserConfirmNavigationPopup = (event) => {
      event.preventDefault();
      event.returnValue = true;
    };

    window.addEventListener("beforeunload", showBrowserConfirmNavigationPopup);
    return () =>
      window.removeEventListener(
        "beforeunload",
        showBrowserConfirmNavigationPopup
      );
  }, []);

  return (
    <div className={classes.game}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {game.name}
          </Typography>
          <NewGameButton />
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />

      <Grid container spacing={3} className={classes.content}>
        <Grid item xs={12} sm={8} md={9} className={classes.boardContainer}>
          {game.state !== GameStates.FINISHED && <Rules />}
          {game.state === GameStates.WAITING && <HowToAddPlayers />}
          {game.state !== GameStates.WAITING && <CurrentTurnNotification />}
          <FinishGameButton />
          <Board />
        </Grid>
        <Grid item xs={12} sm={4} md={3} className={classes.playersContainer}>
          {game.state === GameStates.STARTED ? <UpcomingTurns /> : <Players />}
        </Grid>
      </Grid>

      <Backdrop open={lostConnectionToHost} className={classes.backdrop}>
        <Alert severity="error">
          <AlertTitle>Lost connection to host</AlertTitle>
          <Typography>
            Attempting to reconnect now. If this is taking too long, try
            refreshing the page.
          </Typography>
          <CircularProgress color="inherit" className={classes.spinner} />
        </Alert>
      </Backdrop>
    </div>
  );
}
