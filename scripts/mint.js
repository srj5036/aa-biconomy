async function main() {
  // Get the contract address
  const contractAddress = "0x8D4fA8869a0C198a73ca54Af5e10d73a32e92c65";

  // Get the signer
  const [deployer] = await ethers.getSigners();

  console.log("Calling mint function...");

  // Get the contract instance
  const MyToken = await ethers.getContractFactory("MyToken");
  const contract = MyToken.attach(contractAddress);

  // Call the mint function
  const recipient = "0x513001e9a21b1b9f5a36779195c4cb5175b7f2Fa";
  const amount = ethers.parseEther("100"); // Minting 100 tokens
  const tx = await contract.mint(recipient, amount);

  console.log("Mint transaction hash:", tx.hash);

  // Wait for the transaction to be mined
  await tx.wait();

  console.log("Mint transaction confirmed.");
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
