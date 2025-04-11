const hre = require("hardhat");

async function main() {
  // Use Holesky provider (as configured in hardhat.config.js)
  const provider = new hre.ethers.JsonRpcProvider("https://ethereum-holesky.publicnode.com"); // Use a valid Holesky RPC URL

  // Use your Holesky account’s private key (Replace with the actual key)
  const wallet = new hre.ethers.Wallet("59c7f26f2a119497fc0de4ee2db14d87a5f500d9021385a2abac4d7ca5e677fb", provider);

  console.log("Deploying contract with account:", wallet.address);

  // Get the contract factory
  const MarksheetVerification = await hre.ethers.getContractFactory("MarksheetVerification", wallet);

  // Deploy the contract
  const contract = await MarksheetVerification.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed at:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });