import React from "react";
import { Connections } from "./features/connections/Connections";
import { Images } from "./features/images/Images";
import { Game } from "./features/game/Game";
import "./App.css";
import { fetchId } from "./app/identity";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game />
        <Connections />
        <Images />
        <p>Client ID: {fetchId()}</p>
      </header>
    </div>
  );
}

export default App;
