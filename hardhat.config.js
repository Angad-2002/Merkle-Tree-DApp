require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: "0.8.27",  // Match this with the Solidity version in your contract
  networks: {
    ganache: {
      url: "http://localhost:7545",  // Ganache's default URL
      accounts: [`0x${process.env.PRIVATE_KEY}`]  // Your wallet private key
    }
  }
};
