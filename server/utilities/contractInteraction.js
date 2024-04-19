const { ethers } = require("ethers");
const contract = require("/home/ukush/HalalTrace/HalalTrace/contract/ignition/deployments/chain-80002/artifacts/NFTTracker#ProductTracker.json");
const API_KEY = process.env.AMOY_API
const ADDRESS = process.env.AMOY_CONTRACT_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY

  // provider - Alchemy
  const provider = new ethers.providers.JsonRpcProvider(API_KEY);

  // signer - me
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // contract instance
  const trackerContract = new ethers.Contract(ADDRESS, contract.abi, signer);

  // connect wallet to contract
  const contractWallet = trackerContract.connect(signer)


async function mint(tokenId, type, breed, herdNum) {
    const tx = await contractWallet.mintToken(tokenId, type, breed, herdNum)
    await tx.wait()
}

async function update(tokenId, ipfsUrl) {
  const tx = await contractWallet.updateTrace(tokenId, ipfsUrl)
    await tx.wait()
}

async function trace(tokenId) {
  return await contractWallet.getAnimalDetails(tokenId);
}

module.exports = { mint, update, trace };