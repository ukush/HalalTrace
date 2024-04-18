const { ethers } = require("ethers");
const contract = require('../../contract/ignition/deployments/chain-80002/artifacts/NFTTracker#ProductTracker.json');
const API_KEY = process.env.AMOY_API
const ADDRESS = process.env.AMOY_CONTRACT_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY

  // provider - Alchemy
  const provider = new ethers.providers.JsonRpcProvider(API_KEY);

  // signer - me
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // contract instance
  const trackerContract = new ethers.Contract(ADDRESS, contract.abi, signer);


async function mint(tokenId, type, breed, herdNum) {
    const owner = await trackerContract.owner()
    console.log(`The owner is ${owner}`)
    // call mint function
    const contractWallet = trackerContract.connect(signer)
    const tx = await contractWallet.mintToken(tokenId, type, breed, herdNum)
    await tx.wait()
    console.log(tx)
}


//const { Web3 } = require('web3')

// async function mint() {
//   const provider = new Web3.providers.HttpProvider('https://polygon-amoy.g.alchemy.com/v2/gtILQ7A26pMUgtf-l9QqNMU_PSdUXZ-3')
//   const web3 = new Web3(provider)

//   const tokenId = 2; // Example value for tokenId
//     const animalType = "testing"; // Example value for animalType
//     const breed = "testing"; // Example value for breed
//     const herdNum = 1001; // Example value for herdNum

//   const trackerContract = new web3.eth.Contract(contract.abi, ADDRESS);
//   console.log(trackerContract)
//   //console.log(await trackerContract.methods.mintToken(tokenId, animalType, breed, herdNum).call())
//   //const minted = await trackerContract.methods.mintToken(121313, "lamb", "some breed", 12323423).call()
//   //const data = await trackerContract.methods.getAnimalDetails(777).call()
//   //console.log(data)


// }

//mint()