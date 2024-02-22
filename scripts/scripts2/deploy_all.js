// to deploy locally
// run: npx hardhat node on a terminal
// then run: npx hardhat run --network localhost scripts/12_deploy_all.js
async function main(network) {

    console.log('network: ', network.name);

    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log(`Deployer's address: `, deployerAddress);
  
    const { TREASURY_ADDRESS, PLATFORM_FEE, WRAPPED_ETH_MAINNET, WRAPPED_ETH_ROPSTEN } = require('../constants');
  
    ////////////
    const CentralWorld = await ethers.getContractFactory('Centralworld');
    const centralworld = await CentralWorld.deploy(TREASURY_ADDRESS, '7200000000000000');
  
    await centralworld.deployed();  
    console.log('Centralworld deployed at', centralworld.address);
    ///////////

    //////////
    const ProxyAdmin = await ethers.getContractFactory('ProxyAdmin');
    const proxyAdmin = await ProxyAdmin.deploy();
    await proxyAdmin.deployed();

    const PROXY_ADDRESS = proxyAdmin.address;

    console.log('ProxyAdmin deployed to:', proxyAdmin.address);

    const AdminUpgradeabilityProxyFactory = await ethers.getContractFactory('AdminUpgradeabilityProxy');
    //////////

    /////////
    const Marketplace = await ethers.getContractFactory('CentralworldMarketplace');
    const marketplaceImpl = await Marketplace.deploy();
    await marketplaceImpl.deployed();

    console.log('CentralworldMarketplace deployed to:', marketplaceImpl.address);
    
    const marketplaceProxy = await AdminUpgradeabilityProxyFactory.deploy(
        marketplaceImpl.address,
        PROXY_ADDRESS,
        []
    );
    await marketplaceProxy.deployed();
    console.log('Marketplace Proxy deployed at ', marketplaceProxy.address);
    const MARKETPLACE_PROXY_ADDRESS = marketplaceProxy.address;
    const marketplace = await ethers.getContractAt('CentralworldMarketplace', marketplaceProxy.address);
    
    await marketplace.initialize(TREASURY_ADDRESS, PLATFORM_FEE);
    console.log('Marketplace Proxy initialized');
    
    /////////

    /////////
    const BundleMarketplace = await ethers.getContractFactory(
        'CentralworldBundleMarketplace'
      );
    const bundleMarketplaceImpl = await BundleMarketplace.deploy();
    await bundleMarketplaceImpl.deployed();
    console.log('CentralworldBundleMarketplace deployed to:', bundleMarketplaceImpl.address);
    
    const bundleMarketplaceProxy = await AdminUpgradeabilityProxyFactory.deploy(
        bundleMarketplaceImpl.address,
        PROXY_ADDRESS,
        []
      );
    await bundleMarketplaceProxy.deployed();
    console.log('Bundle Marketplace Proxy deployed at ', bundleMarketplaceProxy.address);  
    const BUNDLE_MARKETPLACE_PROXY_ADDRESS = bundleMarketplaceProxy.address;
    const bundleMarketplace = await ethers.getContractAt('CentralworldBundleMarketplace', bundleMarketplaceProxy.address);
    
    await bundleMarketplace.initialize(TREASURY_ADDRESS, PLATFORM_FEE);
    console.log('Bundle Marketplace Proxy initialized');
    
    ////////

    ////////
    const Auction = await ethers.getContractFactory('CentralworldAuction');
    const auctionImpl = await Auction.deploy();
    await auctionImpl.deployed();
    console.log('CentralworldAuction deployed to:', auctionImpl.address);

    const auctionProxy = await AdminUpgradeabilityProxyFactory.deploy(
        auctionImpl.address,
        PROXY_ADDRESS,
        []
      );

    await auctionProxy.deployed();
    console.log('Auction Proxy deployed at ', auctionProxy.address);
    const AUCTION_PROXY_ADDRESS = auctionProxy.address;
    const auction = await ethers.getContractAt('CentralworldAuction', auctionProxy.address);
    
    await auction.initialize(TREASURY_ADDRESS);
    console.log('Auction Proxy initialized');
   
    ////////

    ////////
    const Factory = await ethers.getContractFactory('CentralworldNFTFactory');
    const factory = await Factory.deploy(
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '1500000000000000',
        TREASURY_ADDRESS,
        '5000000000000000'
    );
    await factory.deployed();
    console.log('CentralworldNFTFactory deployed to:', factory.address);

    const PrivateFactory = await ethers.getContractFactory(
        'CentralworldNFTFactoryPrivate'
    );
    const privateFactory = await PrivateFactory.deploy(
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '1500000000000000',
        TREASURY_ADDRESS,
        '5000000000000000'
    );
    await privateFactory.deployed();
    console.log('CentralworldNFTFactoryPrivate deployed to:', privateFactory.address);
    ////////    

    ////////
    const NFTTradable = await ethers.getContractFactory('CentralworldNFTTradable');
    const nft = await NFTTradable.deploy(
        'Central',
        'CTWD',
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '3610000000000000',
        TREASURY_ADDRESS
    );
    await nft.deployed();
    console.log('CentralworldNFTTradable deployed to:', nft.address);

    const NFTTradablePrivate = await ethers.getContractFactory(
        'CentralworldNFTTradablePrivate'
    );
    const nftPrivate = await NFTTradablePrivate.deploy(
        'ICentral',
        'ICTWD',
        AUCTION_PROXY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '3610000000000000',
        TREASURY_ADDRESS
    );
    await nftPrivate.deployed();
    console.log('CentralworldNFTTradablePrivate deployed to:', nftPrivate.address);
    ////////

    ////////
    const TokenRegistry = await ethers.getContractFactory('CentralworldTokenRegistry');
    const tokenRegistry = await TokenRegistry.deploy();

    await tokenRegistry.deployed();

    console.log('CentralworldTokenRegistry deployed to', tokenRegistry.address);
    ////////

    ////////
    const AddressRegistry = await ethers.getContractFactory('CentralworldAddressRegistry');
    const addressRegistry = await AddressRegistry.deploy();

    await addressRegistry.deployed();

    console.log('CentralworldAddressRegistry deployed to', addressRegistry.address);
    const Centralworld_ADDRESS_REGISTRY = addressRegistry.address;
    ////////

    ////////
    const PriceFeed = await ethers.getContractFactory('CentralworldPriceFeed');
    const WRAPPED_ETH = network.name === 'mainnet' ? WRAPPED_ETH_MAINNET : WRAPPED_ETH_ROPSTEN;
    const priceFeed = await PriceFeed.deploy(
      Centralworld_ADDRESS_REGISTRY,
      WRAPPED_ETH
    );
  
    await priceFeed.deployed();
  
    console.log('CentralworldPriceFeed deployed to', priceFeed.address);
    ////////

    ////////
    const ArtTradable = await ethers.getContractFactory('CentralworldArtTradable');
    const artTradable = await ArtTradable.deploy(
        'CentralworldArt',
        'FART',
        '7200000000000000',
        TREASURY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS
    );
    await artTradable.deployed();
    console.log('CentralworldArtTradable deployed to:', artTradable.address);

    const ArtTradablePrivate = await ethers.getContractFactory(
        'CentralworldArtTradablePrivate'
    );
    const artTradablePrivate = await ArtTradablePrivate.deploy(
        'CentralworldArt',
        'CWART',
        '7200000000000000',
        TREASURY_ADDRESS,
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS
    );
    await artTradablePrivate.deployed();
    console.log('CentralworldArtTradablePrivate deployed to:', artTradablePrivate.address);
    ////////

    ////////
    const ArtFactory = await ethers.getContractFactory('CentralworldArtFactory');
    const artFactory = await ArtFactory.deploy(
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '7200000000000000',
        TREASURY_ADDRESS,
        '3610000000000000'
     );
    await artFactory.deployed();
    console.log('CentralworldArtFactory deployed to:', artFactory.address);

    const ArtFactoryPrivate = await ethers.getContractFactory(
        'CentralworldArtFactoryPrivate'
    );
    const artFactoryPrivate = await ArtFactoryPrivate.deploy(
        MARKETPLACE_PROXY_ADDRESS,
        BUNDLE_MARKETPLACE_PROXY_ADDRESS,
        '72000000000000000',
        TREASURY_ADDRESS,
        '36100000000000000'
    );
    await artFactoryPrivate.deployed();
    console.log('CentralworldArtFactoryPrivate deployed to:', artFactoryPrivate.address);
    ////////
    
    await marketplace.updateAddressRegistry(Centralworld_ADDRESS_REGISTRY);   
    await bundleMarketplace.updateAddressRegistry(Centralworld_ADDRESS_REGISTRY);
    
    await auction.updateAddressRegistry(Centralworld_ADDRESS_REGISTRY);
    
    await addressRegistry.updateArtion(centralworld.address);
    await addressRegistry.updateAuction(auction.address);
    await addressRegistry.updateMarketplace(marketplace.address);
    await addressRegistry.updateBundleMarketplace(bundleMarketplace.address);
    await addressRegistry.updateNFTFactory(factory.address);
    await addressRegistry.updateTokenRegistry(tokenRegistry.address);
    await addressRegistry.updatePriceFeed(priceFeed.address);
    await addressRegistry.updateArtFactory(artFactory.address);   

    await tokenRegistry.add(WRAPPED_ETH);

  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main(network)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  

