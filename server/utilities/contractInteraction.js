const { ethers } = require("ethers");
const contract = require("/home/ukush/HalalTrace/HalalTrace/contract/ignition/deployments/chain-80002/artifacts/NFTTracker#ProductTracker.json");
const API_KEY = process.env.AMOY_API
const ADDRESS = process.env.DEPLOYED_ADD
const PRIVATE_KEY = process.env.PRIVATE_KEY
const { TraceError, MintTokenError } = require('./exceptions/exceptions.js')


// provider - Alchemy
const provider = new ethers.providers.JsonRpcProvider(API_KEY);

// signer - me
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// contract instance
const trackerContract = new ethers.Contract(ADDRESS, contract.abi, signer);


const gasPrice = signer.getGasPrice();

  // connect wallet to contract
  const contractWallet = trackerContract.connect(signer)


async function mint(tokenId, type, breed, herdNum) {
  try {

    const gasLimit = trackerContract.estimateGas.mintToken(tokenId, type, breed, herdNum)

      const tx = await contractWallet.mintToken(tokenId, type, breed, herdNum, {gasLimit : gasLimit, gasPrice: gasPrice})
      await tx.wait()
    } catch (error) {
      console.log(error)
      // throws an error if the tokenId has already been used to to mint a token previously
      throw new MintTokenError(error.error.reason, error);
    }
}

async function update(tokenId, ipfsUrl) {
  try {

    const gasLimit = trackerContract.estimateGas.updateTrace(tokenId, ipfsUrl)

    const tx = await contractWallet.updateTrace(tokenId, ipfsUrl, {gasLimit : gasLimit, gasPrice : gasPrice})

    await tx.wait()
  } catch (error) {
    console.log(error)
    // throws an error if there is no product or animal registered with the tokenId provided
    throw new TraceError(error.error.reason, error);
  }
}

async function trace(tokenId) {
  try {
    return await contractWallet.getAnimalDetails(tokenId);
  } catch (error) {
    // throws an error if there is no product or animal registered with the tokenId provided
    throw new TraceError(error.reason);
  }
}

module.exports = { mint, update, trace };