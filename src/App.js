import React from "react";
import { Game } from "./features/game/Game";
import { Connections } from "./features/connections/Connections";
import { Images } from "./features/images/Images";
import "./App.css";
import { fetchId } from "./app/identity";
import { Username } from "./features/username/Username";
import { Players } from "./features/players/Players";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Username />
        <Game />
        <Connections />
        <Players />
        <Images />
        <p>Client ID: {fetchId()}</p>
      </header>
    </div>
  );
}

export default App;
