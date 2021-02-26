import React, { Component } from 'react';
import logo from './logo.png';
import Web3 from "web3";
import './Console.css';
import Report from "../abis/Report.json"

const ipfsClient = require("ipfs-http-client")
const ipfs = ipfsClient({host: "ipfs.infura.io", port: "5001", protocol: "https"});

class Console extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.getReports()
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
      const contract = web3.eth.Contract(abi, address)
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

  async getReports(){
    const reportCount = await this.state.contract.methods.getReportCount().call()
    var gett = await this.state.contract.methods.getTrip().call()
    console.log(gett)
    const x = document.querySelector(".container")
    for (var i = 0; i < reportCount; i++){
      const newdiv = document.createElement("div");
      newdiv.classList.add("row")
      newdiv.classList.add("small")
      newdiv.classList.add("files-row")
      const newnewdiv = document.createElement("div")
      newnewdiv.classList.add("col")
      newnewdiv.classList.add("rounded")
      newnewdiv.classList.add("p-3")
      newnewdiv.classList.add("mb-5")
      newnewdiv.classList.add("shadow")
      newnewdiv.classList.add("bg-white")
      newdiv.appendChild(newnewdiv)
      const rowdiv = document.createElement("div")
      rowdiv.classList.add("row")
      newnewdiv.appendChild(rowdiv)
      const typediv = document.createElement("div")
      typediv.classList.add("col")
      const namediv = document.createElement("div")
      namediv.classList.add("col")
      const hashdiv = document.createElement("div")
      hashdiv.classList.add("col-7")
      const linkdiv = document.createElement("div")
      linkdiv.classList.add("col")
      const linkadiv = document.createElement("a")
      const hashdata = gett[i][1]
      const name = gett[i][2]
      const type = gett[i][3]
      linkadiv.href = "https://ipfs.infura.io/ipfs/"+ hashdata
      linkadiv.innerText ="Click!"
      hashdiv.innerText = hashdata
      typediv.innerText = type
      namediv.innerText = name
      rowdiv.appendChild(typediv)
      rowdiv.appendChild(namediv)
      rowdiv.appendChild(hashdiv)
      rowdiv.appendChild(linkdiv)
      linkdiv.appendChild(linkadiv)
      x.appendChild(newdiv)
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
        this.setState({reportHash})
        window.location.reload()
      })
    })
  }

  render() {
    const { data } = this.props.location
    return (

      <div className = "bg-light main">

            <nav className="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
            <div className="auto">
              <a
                className="navbar-brand col-sm-3 col-md-2 text-white"
                href="http://localhost:3000/console"
                rel="noopener noreferrer"
              >
              <img src= {logo} className="logo" />
                P A R S
              </a>
              </div>
            </nav>

            <div className="auto">
              <div className= "container">
                <div className ="row">
                  <div className="col rounded shadow p-3 mb-5 bg-white col-first">
                    <div className="row">
                      <div className="col">Mugla-001</div>
                      <div className="col small"><span className="float-right">IPFS Version: <span className="font-italic">0.7.0</span></span></div>
                    </div>
                    <div className="row">
                      <div className="col"><span className="small">Account: <span>{this.state.account}</span></span></div>
                    </div>
                    <div className="row">
                      <div className="col"><span className="small">Status: <span class="text-success">Online</span></span></div>
                    </div>
                  </div>
                  <div className="col rounded shadow p-3 mb-5 bg-white small">
                    <form onSubmit={this.onSubmit}>
                      <select class="float-right input-reportType" name="filetypetext">
                        <option value="0">Select type:</option>
                        <option value="Soil">Soil</option>
                        <option value="Honey">Honey</option>
                      </select>
                      <label class="form-label filetypetext float-right"for="filetypetext">File Type:</label>
                      <label class="form-label"for="fname">File Name:</label>
                      <input type="text" class="float-right input-fileName" name="fname"/><br/>
                      <label for="lname">Choose File:</label>
                      <input type="file" class="float-right" onChange={this.captureFile}/><br/>
                      <input type="submit" class="d-inline-block"/>
                    </form>
                  </div>
                </div>
                <div className ="row files">
                  <div className="col rounded p-3 mb-5 shadow bg-white">
                    <div className="h3 float-left">Files</div>
                    <div className="float-right">
                      <input type="text" class="float-right" name="fname"/></div>
                    </div>
                </div>
                <div className ="row files-title">
                  <div className="col rounded p-3 mb-5 shadow bg-white">
                    <div class="row ">
                      <div class="col">
                        <div className="border-bottom">Type</div>
                      </div>
                      <div class="col">
                        <div className="border-bottom">Name</div>
                      </div>
                      <div class="col-7">
                        <div className="border-bottom">Hash</div>
                      </div>
                      <div class="col">
                        <div className="border-bottom">Link</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
      </div>
    );
  }
}

export default Console;
