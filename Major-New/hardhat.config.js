require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    holesky: {
      url: "https://ethereum-holesky.publicnode.com",
      accounts: ["59c7f26f2a119497fc0de4ee2db14d87a5f500d9021385a2abac4d7ca5e677fb"], // Replace with your private key
    },
  },
};