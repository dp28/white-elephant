import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { startGame, selectGameToJoin } from "./gameSlice";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { BuildPlayer } from "../players/BuildPlayer";
import { updateUsername } from "../username/usernameSlice";
import AlertTitle from "@material-ui/lab/AlertTitle";

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
    maxWidth: "800px",
  },
  title: {
    fontSize: "1.3rem",
  },
  smallTitle: {
    fontSize: "1.1rem",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  text: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  emphasis: {
    fontWeight: "bold",
  },
  expandable: {
    boxShadow: "none",
    backgroundColor: "inherit",
    color: "inherit",
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
          <Alert severity="info">
            <Accordion defaultExpanded className={classes.expandable}>
              <AlertTitle>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.title}>
                    How to host a game
                  </Typography>
                </AccordionSummary>
              </AlertTitle>
              <AccordionDetails>
                <div>
                  <Typography className={classes.text}>
                    Hosting a game couldn't be easier! Just fill out some
                    details below to create the game. Once you've created the
                    game you can add players by either sending them a link to
                    the game or by filling out their details for them.
                  </Typography>
                  <Typography className={classes.smallTitle}>
                    Adding players
                  </Typography>

                  <Typography className={classes.text}>
                    <span className={classes.emphasis}>
                      Option 1: Add other players' details yourself
                    </span>{" "}
                    - "offline players". If you fill out the details for another
                    player, only the host (you) will be able to take their
                    turns. This is great for games over video calls - everyone
                    sends you their gift information beforehand and you set up
                    the game. Then you share your screen and each player takes
                    their turn by telling you what they want to do.{" "}
                  </Typography>
                  <Typography className={classes.text}>
                    <span className={classes.emphasis}>
                      Option 2: Invite players to join on their own devices.
                    </span>{" "}
                    If other players join the game from a link then they can
                    upload their gifts and take their turns on their own devices
                    (you can still take their turn for them, too). Every player
                    then uploads a gift themselves, so not even the host knows
                    who brought which gift! This is also great over video calls,
                    but you don't have to share your screen.
                  </Typography>
                  <Typography className={classes.text}>
                    Other players can only your game if you are still on this
                    page, so please{" "}
                    <span className={classes.emphasis}>
                      don't close this page
                    </span>{" "}
                    if you invite anyone to your game!
                  </Typography>
                  <Typography className={classes.text}>
                    You can also mix and match - inviting some players andd
                    adding others yourself. This is great for when some players
                    are sharing devices and some are not.
                  </Typography>
                </div>
              </AccordionDetails>
            </Accordion>
          </Alert>
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
