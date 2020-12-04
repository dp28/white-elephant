import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { Game } from "./features/game/Game";
import { Connections } from "./features/connections/Connections";
import { ConnectionProgress } from "./features/connections/ConnectionProgress";
import { fetchId } from "./app/identity";
import { ErrorAlert } from "./features/errorAlerts/ErrorAlert";

const useStyles = makeStyles((theme) => ({
  app: {
    minHeight: "100%",
    background: theme.palette.grey[100],
  },
  container: {
    minHeight: "100vh",
  },
}));

function Debug() {
  return (
    <div>
      Client id: {fetchId()}
      <Connections />
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
      <ConnectionProgress />
      <ErrorAlert />
    </div>
  );
}

export default App;
