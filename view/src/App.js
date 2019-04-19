import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  
  async getData(){
    let pitches = await fetch('http://localhost:3002/data/all', {mode: 'no-cors'})
    pitches = await pitches.json()
    console.log(pitches)
    return pitches
  }

  render() {
    const data = this.getData()
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
        </header>
      </div>
    );
  }
}

export default App;
