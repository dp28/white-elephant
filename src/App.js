import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Game } from "./features/game/Game";
import { Connections } from "./features/connections/Connections";
import { Images } from "./features/images/Images";
import { fetchId } from "./app/identity";

const useStyles = makeStyles((theme) => ({
  app: {
    height: "100%",
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
      <Container className={classes.container}>
        <Game />
      </Container>
    </div>
  );
}

export default App;
