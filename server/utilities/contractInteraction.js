const { ethers } = require("ethers");
const contract = require("/home/ukush/HalalTrace/HalalTrace/contract/ignition/deployments/chain-80002/artifacts/NFTTracker#ProductTracker.json");
const API_KEY = "https://polygon-amoy.g.alchemy.com/v2/gtILQ7A26pMUgtf-l9QqNMU_PSdUXZ-3"//process.env.AMOY_API
const ADDRESS = "0x654367dF8581239e04Bf46A5195a0bF6AeBD22cc"//"0x8956108e36155fB8103043be2Eef6beBC2ab657E"//process.env.AMOY_CONTRACT_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY
const { TraceError, MintTokenError } = require('./exceptions/exceptions.js')


  // provider - Alchemy
  const provider = new ethers.providers.JsonRpcProvider(API_KEY);

  // signer - me
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // contract instance
  const trackerContract = new ethers.Contract(ADDRESS, contract.abi, signer);

  // connect wallet to contract
  const contractWallet = trackerContract.connect(signer)


async function mint(tokenId, type, breed, herdNum) {
  try {
      const tx = await contractWallet.mintToken(tokenId, type, breed, herdNum)
      await tx.wait()
    } catch (error) {
      // throws an error if the tokenId has already been used to to mint a token previously
      throw new MintTokenError(error.error.reason, error);
    }
}

async function update(tokenId, ipfsUrl) {
  try {
    const tx = await contractWallet.updateTrace(tokenId, ipfsUrl)
    await tx.wait()
  } catch (error) {
    // throws an error if there is no product or animal registered with the tokenId provided
    throw new TraceError(error.error.reason, error);
  }
}

async function trace(tokenId) {
  try {
    return await contractWallet.getAnimalDetails(tokenId);
  } catch (error) {
    // throws an error if there is no product or animal registered with the tokenId provided
    console.log(error.reason)
    throw new TraceError(error.reason);
  }
}

module.exports = { mint, update, trace };