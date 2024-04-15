const { ethers } = require("ethers");
const { abi } = require("../constants")

const INFURA_ID = ''
const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${INFURA_ID}`)

const account1 = '' // Your account address 1

const privateKey1 = process.env.PRIVATE_KEY // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)

const address = ''
const contract = new ethers.Contract(address, abi, provider)

const main = async () => {
    const balance = await contract.balanceOf(account1)

    console.log(`\nReading from ${address}\n`)
    console.log(`Balance of sender: ${balance}\n`)

    const contractWithWallet = contract.connect(wallet)

    const tx = await contractWithWallet.transfer(account2, balance)
    await tx.wait()

    console.log(tx)

    const balanceOfSender = await contract.balanceOf(account1)
    const balanceOfReciever = await contract.balanceOf(account2)

    console.log(`\nBalance of sender: ${balanceOfSender}`)
    console.log(`Balance of reciever: ${balanceOfReciever}\n`)
}

main()