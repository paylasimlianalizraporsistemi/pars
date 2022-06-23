import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import Report from '../src/contracts/pars.json'
import blockchain from './blokchain'

class SetRole extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      buffer: null,
      contract: null,
      reportHash: 'QmSYkPPhR5ESaxR4xLfZZefUS2Hogu24uV3WAgpv5xZAdG',
    }
  }
  /*
  async setRole() {
    console.log('huahauah')
    var account = document.getElementById('account').value
    var emre = await this.state.contract.methods
      .setUserRole(account, 'LABORANT')
      .send()
    console.log(emre)
  }*/

  async setRole() {
    console.log('huahauah')
    var account = document.getElementById('account').value
    var role = await blockchain.setUserRole(account)

    console.log(role)
  }

  render() {
    return (
      <div class="container">
        <div class="mx-auto" style={{ width: '1080px' }}>
          <div class="content">
            <h1 class="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7">
              Set User Roles
            </h1>

            {/* -------------------------------------*/}
            <div className="" style={{ width: '500px' }}>
              <form
                className="d-flex flex-column w-100"
                onSubmit={this.setRole}
              >
                <label for="account">Account</label>
                <input type="text" id="account" name="account"></input>

                <button type="submit" className="btn btn-primary w-25 mt-3">
                  Set Role
                </button>
              </form>
            </div>

            {/* --------------------------------------*/}
          </div>
        </div>
      </div>
    )
  }
}

export default SetRole
