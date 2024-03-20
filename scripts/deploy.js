async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contract with the account:", deployer.address);
  
  // Use the provided address for both constructor parameters
  const defaultAdmin = "0xEC12D8BE763a910C05FaE3b39E7575064d3EbcD0";
  const minter = "0xEC12D8BE763a910C05FaE3b39E7575064d3EbcD0";
  
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(defaultAdmin, minter); // Pass the provided address as both default admin and minter
  
//   const MyToken = await ethers.getContractFactory("MyToken");
//   const myToken = await MyToken.deploy(deployer.address, deployer.address); // Pass deployer's address as both default admin and minter
  
  console.log("MyToken deployed to:", myToken.target);

  await myToken.waitForDeployment();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
