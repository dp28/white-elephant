import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { Game } from "./features/game/Game";
import { Connections } from "./features/connections/Connections";
import { Images } from "./features/images/Images";
import { fetchId } from "./app/identity";

const useStyles = makeStyles((theme) => ({
  app: {
    height: "100%",
    background: theme.palette.grey[100],
  },
  container: {
    height: "100%",
  },
}));

function Debug() {
  return (
    <div>
      Client id: {fetchId()}
      <Connections />
      <Images />
    </div>
  );
}

function App() {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <CssBaseline />
      <Container className={classes.container}>
        <Game />
      </Container>
    </div>
  );
}

export default App;
