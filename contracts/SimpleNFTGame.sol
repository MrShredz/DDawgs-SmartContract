// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC721 interface for NFTs
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SimpleNFTGame {
    // Address of the NFT contract
    address public nftContractAddress;

    // Mapping of game IDs to game details
    mapping(uint256 => Game) public games;

    // Struct to represent a game
    struct Game {
        address creator;
        uint256 betAmount;
        bool isActive;
        address player1;
        address player2;
        uint256 winner; // 0 for draw, 1 for player 1, 2 for player 2
    }

    // Event emitted when a game is created
    event GameCreated(uint256 gameId, address creator, uint256 betAmount);

    // Event emitted when a player joins a game
    event PlayerJoined(uint256 gameId, address player);

    // Event emitted when a game is finished
    event GameFinished(uint256 gameId, uint256 winner);

    // Constructor to set the NFT contract address
    constructor(address _nftContractAddress) {
        nftContractAddress = _nftContractAddress;
    }

    // Function to create a new game
    function createGame(uint256 gameId, uint256 betAmount) external {
        require(!games[gameId].isActive, "Game already active");
        require(IERC721(nftContractAddress).balanceOf(msg.sender) > 0, "Must own NFT to create a game");
        require(betAmount > 0, "Bet amount must be greator than zero");

        IERC721(nftContractAddress).transferFrom(msg.sender, address(this), 1);

        games[gameId] = Game({
            creator: msg.sender,
            betAmount: betAmount,
            isActive: true,
            player1: msg.sender,
            player2: address(0), // No player 2 yet
            winner: 0 // No winner yet
        });

        emit GameCreated(gameId, msg.sender, betAmount);
    }

    // Function to join an existing game
    function joinGame(uint256 gameId) external {
        Game storage game = games[gameId];
        require(game.isActive, "Game not active");
        require(game.player2 == address(0), "Game already has 2 players");
        require(msg.sender != game.player1, "Cannot join  your own game");
        require(IERC721(nftContractAddress).balanceOf(msg.sender) > 0, "Must own NFT to join a game");

        IERC721(nftContractAddress).transferFrom(msg.sender, address(this), 1);

        game.player2 = msg.sender;

        emit PlayerJoined(gameId, msg.sender);
    }

    // Function to finish a game
    function finishGame(uint256 gameId, uint256 winner) external {
        Game storage game = games[gameId];
        require(game.isActive, "Game not active");
        require(msg.sender == game.creator, "Only the game creator can finish the game");
        require(winner >= 0 && winner <=2, "Invalid winner");

        game.isActive = false;
        game.winner = winner;

        // Distribute winnings
        if (winner == 1) {
            IERC721(nftContractAddress).transferFrom(address(this), game.player1, 1);
        } else if (winner == 2) {
            IERC721(nftContractAddress).transferFrom(address(this), game.player2, 1);
        } else {
            IERC721(nftContractAddress).transferFrom(address(this), game.player1, 1);
            IERC721(nftContractAddress).transferFrom(address(this), game.player2, 1);
        }

        emit GameFinished(gameId, winner);
    }
}