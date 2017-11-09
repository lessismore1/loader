import React from "react";
import EthereumState from "./EthereumState";
import ParcelsMapContainer from "./ParcelsMapContainer";
import DisplayParcel from "./DisplayParcel";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <EthereumState />
        </header>
        <DisplayParcel />
        <ParcelsMapContainer />
      </div>
    );
  }
}

export default App;
