const { ethers } = require("ethers");
const contract = require("/home/ukush/HalalTrace/HalalTrace/contract/ignition/deployments/chain-80002/artifacts/AnimalProduct#AnimalProductTracker.json");
const API_KEY = process.env.AMOY_API
const CONTRACT_ADDRESS = "0x0E6AE8481C2e14e15e15705D4f2C9b5a0EF6fA41"//process.env.ANIMAL_PRODUCT_CONTRACT_ADD
const PRIVATE_KEY = process.env.PRIVATE_KEY
const { TraceError, MintTokenError } = require('../exceptions/exceptions.js')

  // provider - Alchemy
  const provider = new ethers.providers.JsonRpcProvider(API_KEY);

  // signer - me
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // contract instance
  const trackerContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

  // connect wallet to contract
  const contractWallet = trackerContract.connect(signer)


async function mintProduct(partIds, productName) {
  try {
      const tx = await contractWallet.mintNft(partIds, partName)
      await tx.wait()
    } catch (error) {
      // throws an error if the tokenId has already been used to to mint a token previously
      console.log(error)
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
    const bytes = await contractWallet.getTrace(tokenId);
    // Decode the encoded data
    const decodedData = ethers.utils.defaultAbiCoder.decode(
    ["uint256", "string", "string", "uint256"],
    bytes
  );


    return decodedData;
  } catch (error) {
    // throws an error if there is no product or animal registered with the tokenId provided
    console.log(error)
    throw new TraceError(error.reason);
  }
}

module.exports = { mintProduct, update, trace };