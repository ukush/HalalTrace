const { ethers } = require("ethers");
const contract = require("/home/ukush/HalalTrace/HalalTrace/contract/ignition/deployments/chain-80002/artifacts/Animal#AnimalTracker.json");
const API_KEY = process.env.AMOY_API
const ANIMAL_CONTRACT_ADDRESS = "0xcdb4bb8Bc5fbBa692E8cc989180A917d9E0225c0"
const PART_CONTRACT_ADDRESS = "0x0c40301F9ccaEb50C83a8A2FE875C0c635A0744C"
const PRODUCT_CONTRACT_ADDRESS = "0x0E6AE8481C2e14e15e15705D4f2C9b5a0EF6fA41"
const PRIVATE_KEY = process.env.PRIVATE_KEY
const { TraceError, MintTokenError } = require('../exceptions/exceptions.js')

async function initContract(nftType) {
    // provider - Alchemy
  const provider = new ethers.providers.JsonRpcProvider(API_KEY);

  // signer - me
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  let contract_address;

  if (nftType == "animal") {
    contract_address = ANIMAL_CONTRACT_ADDRESS
  }

  if (nftType == "part") {
    contract_address = PART_CONTRACT_ADDRESS
  }

  if (nftType == "product") {
    contract_address = PRODUCT_CONTRACT_ADDRESS
  }

    // contract instance
    const trackerContract = new ethers.Contract(contract_address, contract.abi, signer);

    // connect wallet to contract
    return contractWallet = trackerContract.connect(signer)
}

async function update(nftType, tokenId, ipfsUrl) {
  try {
    const contractWallet = await initContract(nftType);
    const tx = await contractWallet.updateTrace(tokenId, ipfsUrl)
    await tx.wait()
  } catch (error) {
    // throws an error if there is no product or animal registered with the tokenId provided
    throw new TraceError(error.error.reason, error);
  }
}


module.exports = { update };