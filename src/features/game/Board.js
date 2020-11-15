import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectGifts } from "../gifts/giftsSlice";
import { Gift } from "../gifts/Gift";

const useStyles = makeStyles((theme) => ({
  board: {
    height: "100%",
    width: "100%",
  },
  offset: theme.mixins.toolbar,
  content: {
    marginTop: theme.spacing(1),
  },
}));

export function Board() {
  const classes = useStyles();
  const gifts = useSelector(selectGifts);
  return (
    <div className={classes.board}>
      <Grid container spacing={1} className={classes.content}>
        {gifts.map((gift) => (
          <Grid key={gift.id} item xs={12} sm={6} md={4}>
            <Gift id={gift.id} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
