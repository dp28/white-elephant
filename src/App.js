import React from "react";
import Container from "@material-ui/core/Container";
import { Game } from "./features/game/Game";
import { Connections } from "./features/connections/Connections";
import { Images } from "./features/images/Images";
import { fetchId } from "./app/identity";
import { Username } from "./features/username/Username";
import { useSelector } from "react-redux";
import { selectUsername } from "./features/username/usernameSlice";
import "./App.css";

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
  const username = useSelector(selectUsername);
  return (
    <div className="App">
      <Container>{username ? <Game /> : <Username />}</Container>
    </div>
  );
}

export default App;
