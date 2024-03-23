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
      url: "https://polygon-mumbai.g.alchemy.com/v2/FSlEM6s2TxPfCzGvPO6DAjTx5SOiSKS0",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};


