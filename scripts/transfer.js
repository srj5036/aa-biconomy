async function main() {
    // Get the contract address
    const contractAddress = "0x8D4fA8869a0C198a73ca54Af5e10d73a32e92c65";
  
    // Get the signer
    const [deployer] = await ethers.getSigners();
  
    console.log("Calling transfer function...");
  
    // Get the contract instance
    const MyToken = await ethers.getContractFactory("MyToken");
    const contract = MyToken.attach(contractAddress);
  
    // Define recipient and amount for transfer
    const recipient = "0x329Fb58Fe6706FB6945715287fbc39cFeC36654A"; // Replace with recipient's address
    const amount = ethers.parseEther("10"); // Transfer 10 tokens
  
    // Call the transfer function
    const tx = await contract.transfer(recipient, amount);
  
    console.log("Transfer transaction hash:", tx.hash);
  
    // Wait for the transaction to be mined
    await tx.wait();
  
    console.log("Transfer transaction confirmed.");
  }
  
  // Run the script
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  