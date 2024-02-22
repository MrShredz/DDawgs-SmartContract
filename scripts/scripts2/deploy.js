const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const message0 = 'Deploying nft with address: ' + deployerAddress;
    console.log(message0);
    //////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
  
    const TOKENFACTORY = await ethers.getContractFactory('A2Heroes');
    const tokenFactory = await TOKENFACTORY.deploy('A2HeroesTest', 'ATWOH', 'Monika', '0x2dC900A489DA7d5Eb5E1eAc7F6B9f9246f4dD16d');
    // const tokenFactory = await TOKENFACTORY.deploy('A2HeroesTest', 'A2HT', 'Monika', '0x42cCf0f32453547dACB0e36bf5dBcC03Fd234ea5');
    await tokenFactory.deployed();
    const tokenFactoryAddress = tokenFactory.address
    console.log('TokenFactory contract deployed at', tokenFactoryAddress);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  