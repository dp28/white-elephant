import React from "react";
import { Connections } from "./features/connections/Connections";
import "./App.css";
import { fetchId } from "./app/identity";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Connections />
        <p>Client ID: {fetchId()}</p>
      </header>
    </div>
  );
}

export default App;
