require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
  },
  gasReporter: {
    enabled: false
  },
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.MUMBAI_API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};


