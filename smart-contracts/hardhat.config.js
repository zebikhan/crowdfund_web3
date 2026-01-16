require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, AMOY_RPC_URL } = process.env;

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // ✅ optional for compiler optimization
    },
  },
  networks: {
    // ✅ Local development network
    localhost: {
      url: "http://127.0.0.1:8545", 
    },

    // ✅ Polygon Amoy Testnet (official)
    // polygon_amoy: {
    //   url: AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/",
    //   accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    //   chainId: 80002,
    // },
  },
};
