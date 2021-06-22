import React, { Component } from 'react';
import Web3 from "web3";
import Report from "./contracts/pars.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Nav from './Nav'
import Reports from './Reports'
import PrivateReports from './PrivateReports'
import UploadReport from './UploadReport'
import Validate from './Validate'
import msku from './msku.png'
import bcrg from './bcrg.jpeg'
import bc from './bc.png'

const ipfsClient = require("ipfs-http-client")
const ipfs = ipfsClient({host: "ipfs.infura.io", port: "5001", protocol: "https"});


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Report.networks[networkId]
    if(networkData){
      const abi = Report.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract})
    } else{
      window.alert("Smart contract not deployed to detect network!")
      }
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

  captureFile = (event) => {
    event.preventDefault()
    console.log("file captured.")
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer.from(reader.result)})
    }
  }
  
   onSubmit = (event) => {
    event.preventDefault()
    const reportName = document.querySelector(".input-fileName").value
    const reportType = document.querySelector(".input-reportType").value
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      const reportHash = result[0].hash
      this.setState({reportHash})
      if(error) {
        console.error(error)
        return
      }
      this.state.contract.methods.createReport(reportHash,reportName,reportType).send({from: this.state.account}).on("confirmation",(r) =>{
        window.location.reload()
      })
    })
  }

  render() {

    return (
      <Router>
        <div class="">
        <Nav/>
        <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/reports" component={Reports} />
        <Route path="/privatereports" component={PrivateReports} />
        <Route path="/uploadreport" component={UploadReport} />
        <Route path="/validate" component={Validate} />
        </Switch>
        </div>
      </Router>
    );
  }
}
const Home = () => (
  <div class="container">
<div class="mx-auto" style={{width: "1080px"}}>
  <div class="slider clearfix" style={{marginTop: "100px"}}>
  <h1 class="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7"><span class="" style={{fontFamily: '"Cinzel", cursive'}}>PARS </span><br /></h1>
      <h2 class="font-weight-light mt-5">Blockchain-based decentralized <br />and distributed lab report system.</h2>
      <div type="button" class="btn btn-outline-primary mt-5">
        <h5 class="font-weight-light">Explore Reports</h5>
      </div>
      <div class="photo" style={{float: "right", marginTop: "-280px"}}>
        <img src={bc} alt="" height="500"/>
      </div>
  </div>
  <div class="supporters">
    <h1 class="font-weight-light mt-5 text-center mb-4">Trusted By</h1>
    <div class="row">
      <div class="col-sm m-2 text-center" style={{height: "220px", background: "#dadada"}}>
        <img src={msku} height="150" width="150" style={{marginTop:"35px"}}></img>
      </div>
      <div class="col-sm m-2 text-center" style={{ background: "#dadada"}}>
      <img src={bcrg} height="150" width="150" style={{marginTop:"35px"}}></img>
      </div>
    </div>
  </div>
  <footer>
    <div class="text-center p-4">
      © 2021
      <a class="text-reset fw-bold" href="https:///">
      </a>
    </div>
  </footer>
</div>
</div>

);
export default App;
