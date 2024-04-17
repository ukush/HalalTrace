const { ethers } = require("ethers");
const contract = require('../../contract/artifacts/contracts/NFTTracker.sol/ProductTracker.json')
const API_KEY = process.env.MUMBAI_API
const CONTRACT_ADDRESS = '0x2D7fFF0FA2196E8849690cb18c28ef28f614Cc14'
const PRIVATE_KEY = process.env.PRIVATE_KEY

  // provider - Alchemy
  const alchemyProvider = new ethers.providers.JsonRpcProvider(network='mumbai', API_KEY);


  // signer - me
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);


  // contract instance
  const trackerContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);



async function main() {
    const owner = await trackerContract.owner()
    console.log(`The message is ${owner}`)
  
}

main()

