import React, { Component } from 'react';
import logo from './logo.png';
import Web3 from "web3";
import './App.css';
import Report from "../abis/Report.json"
import Console from "./Console";
import Login from "./Login";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Nav from "./Nav";



const ipfsClient = require("ipfs-http-client")
const ipfs = ipfsClient({host: "ipfs.infura.io", port: "5001", protocol: "https"});

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
  }


  constructor(props) {
    super(props);
    this.state = {
      account: "",
      buffer: null,
      contract: null,
      reportHash: "QmSYkPPhR5ESaxR4xLfZZefUS2Hogu24uV3WAgpv5xZAdG"
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  render() {
    return (
      <div>
            <Router>
              <div className="App">
              <Switch>
              <Route path="/" exact component={Login}/>
              <Route path="/console" component={Console}/>
              < /Switch>
              </div>
            </Router>

      </div>
    );
  }
}

export default App;
