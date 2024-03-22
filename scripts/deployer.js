async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contract with the account:", deployer.address);
  
  // Use the provided address for both constructor parameters
  const defaultAdmin = "0xEC12D8BE763a910C05FaE3b39E7575064d3EbcD0";
  const minter = "0xEC12D8BE763a910C05FaE3b39E7575064d3EbcD0";
  
  const Deployer = await ethers.getContractFactory("Deployer");
  const contract = await Deployer.deploy(); 
  
  console.log("Deployer deployed to:", contract.target);

  await contract.waitForDeployment();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
