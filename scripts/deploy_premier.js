const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const message0 = 'Deploying Token staking with address: ' + deployerAddress;
    console.log(message0);
    //////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
  
    const TOKENFACTORY = await ethers.getContractFactory('TusdcToken');
    const tokenFactory = await TOKENFACTORY.deploy();
    await tokenFactory.deployed();
    const tokenFactoryAddress = tokenFactory.address
    console.log('Token contract deployed at', tokenFactoryAddress);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  