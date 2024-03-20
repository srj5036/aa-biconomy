async function main() {
    // Get the contract address
    const contractAddress = "0x8D4fA8869a0C198a73ca54Af5e10d73a32e92c65";
  
    // Get the signer
    const [deployer] = await ethers.getSigners();
  
    console.log("Calling burn function...");
  
    // Get the contract instance
    const MyToken = await ethers.getContractFactory("MyToken");
    const contract = MyToken.attach(contractAddress);
  
    // Call the burn function
    const amount = ethers.parseEther("50"); // Burning 50 tokens
    const tx = await contract.burn(amount);
  
    console.log("Burn transaction hash:", tx.hash);
  
    // Wait for the transaction to be mined
    await tx.wait();
  
    console.log("Burn transaction confirmed.");
  }
  
  // Run the script
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  