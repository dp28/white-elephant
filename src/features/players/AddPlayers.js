import React, { useState } from "react";
import { Card, CardActions, Button, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { AddOfflinePlayer } from "./AddOfflinePlayer";

const useStyles = makeStyles((theme) => ({
  addPlayers: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    position: "relative",
  },
  message: {
    position: "absolute",
    top: "130%",
    width: "100%",
  },
}));

export function AddPlayers() {
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
    <div className={classes.addPlayers}>
      <Card>
        <CardActions>
          <Button color="primary" onClick={copyUrlToClipboard}>
            Copy invite link
          </Button>
          <Button
            color="primary"
            onClick={() => setShowOfflinePlayerForm(true)}
          >
            Add offline player
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        className={classes.message}
        open={showSuccess}
        onClose={hideMessage}
      >
        <Alert onClose={hideMessage} severity="success">
          Invite link copied!
        </Alert>
      </Snackbar>
      {showOfflinePlayerForm && (
        <AddOfflinePlayer onClose={() => setShowOfflinePlayerForm(false)} />
      )}
    </div>
  );
}
