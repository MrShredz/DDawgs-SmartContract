const { ethers } = require("hardhat");
const { txHash } = require("./deploy/test");

async function main() {

    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const message0 = 'Deploying SimpleNFTGame with address: ' + deployerAddress;
    console.log(message0);
    //////////////////////////////////////////////////////////////////////

    const TOKENFACTORY = await ethers.getContractFactory('SimpleNFTGame');
    // const tokenFactory = await TOKENFACTORY.deploy("0x664796F37dE87b3CB9E31a2074e92E79bAB27Cc8");
    // const tokenFactory = await TOKENFACTORY.deploy("QmRvQ8Vta9wQD1sq2cKLocJr7xookW7uh6MxH4K5SbzeH5");
    const tokenFactory = await TOKENFACTORY.deploy();
    await tokenFactory.deployed();
    const tokenFactoryAddress = tokenFactory.address;
    console.log(txHash);
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
  