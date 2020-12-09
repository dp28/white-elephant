import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { AddOfflinePlayer } from "./AddOfflinePlayer";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  title: {
    fontSize: "1.1rem",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    color: theme.palette.primary.dark,
  },
  text: {
    marginBottom: theme.spacing(1),
  },
  emphasis: {
    color: theme.palette.primary.dark,
    fontWeight: "bold",
  },
  buttonWrapper: {
    position: "relative",
    marginBottom: theme.spacing(1),
  },
  message: {
    position: "absolute",
    bottom: 0,
  },
}));

export function HowToAddPlayers() {
  const classes = useStyles();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOfflinePlayerForm, setShowOfflinePlayerForm] = useState(false);

  const hideMessage = () => setShowSuccess(false);

  const copyUrlToClipboard = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setShowSuccess(true);
    setTimeout(hideMessage, 2000);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>How to add players</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <Typography gutterBottom>
            Before starting this game, we need some players! This is normally
            done by the host (the player who created the game), but can be done
            by anyone.
          </Typography>

          <Typography className={classes.title}>
            Adding other players' details yourself
          </Typography>
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              size="small"
              onClick={() => setShowOfflinePlayerForm(true)}
            >
              Add offline player
            </Button>
            {showOfflinePlayerForm && (
              <AddOfflinePlayer
                onClose={() => setShowOfflinePlayerForm(false)}
              />
            )}
          </div>

          <Typography gutterBottom>
            If you fill out the details for another player, only the host will
            be able to take their turns.
          </Typography>
          <Typography gutterBottom>
            This works well for games over video calls where multiple players
            are sharing the same device and/or the host is sharing their screen
            and in control of the whole game. It's also a useful backup if
            someone can't connect to this game, but can connect to the video
            call.
          </Typography>

          <Typography className={classes.title}>
            Inviting other players
          </Typography>
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              size="small"
              onClick={copyUrlToClipboard}
            >
              Copy invite link
            </Button>

            <Snackbar
              className={classes.message}
              open={showSuccess}
              onClose={hideMessage}
            >
              <Alert onClose={hideMessage} severity="success">
                Invite link copied!
              </Alert>
            </Snackbar>
          </div>

          <Typography gutterBottom>
            If other players join the game from a link then they can upload
            their gifts and take their turns on their own devices (the host can
            still take their turn for them, too). Every player then uploads a
            gift themselves, so not even the host knows who brought which gift!
            This is also great over video calls, but the host doesn't have to
            share their screen if they don't want to.
          </Typography>
          <Typography gutterBottom>
            <span className={classes.emphasis}>Note:</span> Other players can
            only this game if the host is online. If you're hosting and have
            sent the invite link to other players,{" "}
            <span className={classes.emphasis}>
              please don't close this page
            </span>
            .
          </Typography>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
