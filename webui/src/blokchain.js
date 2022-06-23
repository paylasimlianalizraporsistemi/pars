const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
web3.eth.net
  .isListening()

  .then(() => console.log('is connected'))
  .catch((e) => console.log('Wow. Something went wrong: ' + e))

var pars = require('./contracts/pars.json')

var parsContract = new web3.eth.Contract(
  pars.abi,
  '0x71e3D589Cf0dD4CB130051B53e8933f0e44b9F56'
)

async function setUserRole(account) {
  let deneme = await parsContract.methods
    .setUserRole(account, 'LABORANT')
    .send({ from: '0x9d4D412D490906951fCf66e0D320be0E5Fdd957C' })
  return deneme
}

async function validateReport(reportID) {
  let deneme = await parsContract.methods
    .validateReport(reportID)
    .send({ from: '0x9d4D412D490906951fCf66e0D320be0E5Fdd957C', gas: 3000000 })
  return deneme
}

module.exports.parsContract = parsContract
module.exports.web3 = web3
module.exports.setUserRole = setUserRole
module.exports.validateReport = validateReport
