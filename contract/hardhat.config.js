require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("dotenv").config();
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
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: process.env.CONTRACT_SIZER,
    strict: true,
  },
  gasReporter: {
    enabled: process.env.GAS_REPORTER
  }
};


