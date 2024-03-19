/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
  networks: {
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [PRIVATE_KEY]
    }
  }
};
