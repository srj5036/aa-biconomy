async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contract with the account:", deployer.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(deployer.address, deployer.address); // Pass deployer's address as both default admin and minter
  
  console.log("MyToken deployed to:", myToken.target);

  await myToken.waitForDeployment();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
