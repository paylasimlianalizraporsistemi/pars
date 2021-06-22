import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Report from "../src/contracts/pars.json"

const ipfsClient = require("ipfs-http-client")
const ipfs = ipfsClient({host: "ipfs.infura.io", port: "5001", protocol: "https"});

class UploadReport extends Component {

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
      reportHash: "QmSYkPPhR5ESaxR4xLfZZefUS2Hogu24uV3WAgpv5xZAdG",
      length: ""
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

  async onSubmit() {
    const reportName = document.querySelector(".input-fileName").value
    const reportType = document.querySelector(".input-reportType").value
    console.log("Submitting file to ipfs...")
    await ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      const reportHash = result[0].hash
      this.setState({reportHash})
      if(error) {
        console.error(error)
        return
      }
      this.state.contract.methods.createReport(reportHash,reportName,reportType).send({from: this.state.account}).on("confirmation",(r) =>{
        this.setState({reportHash})
        window.location.reload()
      })
    })
  }

  render() {

    return (
        <div class="container">
    <div class="mx-auto" style={{width: "1080px"}}>
      <div class="content">
        <h1 class="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7">Upload Report</h1>
        <form onSubmit={e => {
      e.preventDefault();
      this.onSubmit();
    }}>
          <div class="form-group" style={{width: "420px"}}>
            <label for="exampleInputEmail1">Address</label>
            <input class="form-control" aria-describedby="addressHelp" value={this.state.account} readOnly/>
            <small id="addressHelp" class="form-text text-muted">If you need, change your address from metamask</small>
          </div>
          <div class="form-group" style={{width: "420px"}}>
            <label for="exampleInputName">Report Name</label>
            <input class="form-control input-fileName" id="exampleInputName" aria-describedby="projectName" />
            <small id="projectName" class="form-text text-muted">General Name for your project</small>
          </div>
          <div class="form-group" style={{width: "420px"}}>
            <label for="exampleInputName">Report Type</label>
            <input class="form-control input-reportType" id="exampleInputName" aria-describedby="projectName" />
            <small id="projectName" class="form-text text-muted">General Name for your project</small>
          </div>
          <div class="form-group" style={{width: "420px"}}>
            <label for="">Report File</label>
            <input type="file" class="form-control" onChange={this.captureFile} aria-describedby="projectName" />
            <small id="projectName" class="form-text text-muted">General Name for your project</small>
          </div>
          <input type="submit" class="d-inline-block btn btn-primary" value="Upload"/>
        </form>
      </div>
    </div>
  </div>
      );
  }
}

export default UploadReport;