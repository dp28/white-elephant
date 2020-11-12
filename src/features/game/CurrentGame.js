import React from "react";
import { useSelector } from "react-redux";
import { AppBar, Typography, Toolbar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectGame } from "./gameSlice";
import { Players } from "../players/Players";

const useStyles = makeStyles((theme) => ({
  game: {
    height: "100%",
    width: "100%",
  },
  offset: theme.mixins.toolbar,
  content: {
    marginTop: theme.spacing(1),
  },
}));

export function CurrentGame() {
  const classes = useStyles();
  const game = useSelector(selectGame);
  return (
    <div className={classes.game}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">{game.name}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />

      <Grid container spacing={3} className={classes.content}>
        <Grid item xs={12} sm={4} md={3}>
          <Players />
        </Grid>
      </Grid>
    </div>
  );
}
