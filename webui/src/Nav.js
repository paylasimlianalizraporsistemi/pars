import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Link } from 'react-router-dom'
import Report from '../src/contracts/pars.json'
class Nav extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.getRole()
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
      role: '',
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

  async getRole() {
    const role = await this.state.contract.methods
      .getUserRole(this.state.account)
      .call()
    if (role == 'SUPERVISOR') {
      this.setState({ role })
      console.log('asdasd')
    } else if (role == 'LABORANT') {
      this.setState({ role })
    } else {
      const role = 'USER'
      this.setState({ role })
    }
  }

  render() {
    return (
      <div class="w-100">
        {(() => {
          if (this.state.role == 'SUPERVISOR') {
            return (
              <div
                class=""
                style={{ background: '#32ff7e', height: '12px', width: '%100' }}
              ></div>
            )
          } else if (this.state.role == 'LABORANT') {
            return (
              <div
                class=""
                style={{ background: '#ffaf40', height: '12px', width: '%100' }}
              ></div>
            )
          } else {
            return (
              <div
                class=""
                style={{ background: '#40E0D0', height: '12px', width: '%100' }}
              ></div>
            )
          }
        })()}
        <div class="navigation-bar w-100" style={{ fontSize: '20px' }}>
          <div
            class="user-info mx-auto nav-item"
            style={{ fontSize: '14px', width: '1040px' }}
          >
            You are logged as: {this.state.account}
            <span style={{ float: 'right' }}> Role: {this.state.role}</span>
          </div>
          <div class="mx-auto " style={{ width: '1080px' }}>
            <nav class="navbar navbar-expand-lg navbar-light ">
              <Link
                style={{ textDecoration: 'none' }}
                to="/"
                onClick={() => {
                  window.location.href = '/'
                }}
              >
                <a
                  class="navbar-brand"
                  href="#"
                  style={{
                    fontFamily: '"Cinzel", cursive',
                    fontSize: 'xx-large',
                  }}
                >
                  PARS
                </a>
                <span class="badge badge-primary">beta</span>
              </Link>
              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="nav navbar-nav ml-auto">
                  <li class="nav-item active">
                    <a class="nav-link" href="/">
                      Home
                    </a>
                  </li>
                  <li class="nav-item">
                    <Link style={{ textDecoration: 'none' }} to="/reports">
                      <a class="nav-link" href="#">
                        Reports
                      </a>
                    </Link>
                  </li>
                  {(() => {
                    if (this.state.role == 'SUPERVISOR') {
                      return (
                        <ul class="nav navbar-nav ml-auto">
                          <li class="nav-item">
                            <Link
                              style={{ textDecoration: 'none' }}
                              to="/privatereports"
                            >
                              <a class="nav-link" href="#">
                                Private Reports
                              </a>
                            </Link>
                          </li>
                          <li class="nav-item">
                            <Link
                              style={{ textDecoration: 'none' }}
                              to="/validate"
                            >
                              <a class="nav-link" href="#">
                                Validate
                              </a>
                            </Link>
                          </li>
                          <li class="nav-item">
                            <Link
                              style={{ textDecoration: 'none' }}
                              to="/roles"
                            >
                              <a class="nav-link" href="#">
                                Set Roles
                              </a>
                            </Link>
                          </li>
                        </ul>
                      )
                    } else if (this.state.role == 'LABORANT') {
                      return (
                        <ul class="nav navbar-nav ml-auto">
                          <li class="nav-item">
                            <Link
                              style={{ textDecoration: 'none' }}
                              to="/privatereports"
                            >
                              <a class="nav-link" href="#">
                                Private Reports
                              </a>
                            </Link>
                          </li>
                          <li class="nav-item">
                            <Link
                              style={{ textDecoration: 'none' }}
                              to="/uploadreport"
                            >
                              <a class="nav-link" href="#">
                                Upload Report
                              </a>
                            </Link>
                          </li>
                        </ul>
                      )
                    } else {
                    }
                  })()}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    )
  }
}

export default Nav
