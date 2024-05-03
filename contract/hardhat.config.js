require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require('dotenv').config({ path: '/home/ukush/HalalTrace/HalalTrace/contract/.env' })
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-ignition-ethers");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
    url: process.env.AMOY_API,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    enabled: process.env.GAS_REPORTER,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_KEY
    }
};


