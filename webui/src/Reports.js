import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import Report from '../src/contracts/pars.json'

class Reports extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.getReports()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Report.networks[networkId]
    if (networkData) {
      const abi = Report.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
    } else {
      window.alert('Smart contract not deployed to detect network!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      buffer: null,
      contract: null,
      reportHash: 'QmSYkPPhR5ESaxR4xLfZZefUS2Hogu24uV3WAgpv5xZAdG',
      length: '',
    }
  }

  async getReports() {
    const reportCount = await this.state.contract.methods
      .getReportCount()
      .call()
    var gett = await this.state.contract.methods.getValidReports().call()
    console.log(gett.length)
    console.log(reportCount)
    const x = document.querySelector('.content')
    for (var i = 0; i < gett.length; i++) {
      const newdiv = document.createElement('div')
      newdiv.classList.add('row')
      newdiv.classList.add('small')
      newdiv.classList.add('files-row')
      const newnewdiv = document.createElement('div')
      newnewdiv.classList.add('col')
      newnewdiv.classList.add('rounded')
      newnewdiv.classList.add('p-3')
      newnewdiv.classList.add('mb-5')
      newnewdiv.classList.add('shadow')
      newnewdiv.classList.add('bg-white')
      newdiv.appendChild(newnewdiv)
      const rowdiv = document.createElement('div')
      rowdiv.classList.add('row')
      newnewdiv.appendChild(rowdiv)
      const typediv = document.createElement('div')
      typediv.classList.add('col')
      const namediv = document.createElement('div')
      namediv.classList.add('col')
      const hashdiv = document.createElement('div')
      hashdiv.classList.add('col-7')
      const linkdiv = document.createElement('div')
      linkdiv.classList.add('col')
      const linkadiv = document.createElement('a')
      const hashdata = gett[i][1]
      const name = gett[i][2]
      const type = gett[i][3]
      linkadiv.href = 'https://ipfs.infura.io/ipfs/' + hashdata
      linkadiv.innerText = 'Click!'
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

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  render() {
    return (
      <div class="container">
        <div class="mx-auto" style={{ width: '1080px' }}>
          <div class="content">
            <h1 class="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7">
              Reports
            </h1>
            <div className="row files-title">
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
    )
  }
}

export default Reports
