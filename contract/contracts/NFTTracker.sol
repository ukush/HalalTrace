// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AnimalProductTracker is ERC721, ERC721URIStorage, AccessControl {

    /**
    * @dev defines the basic metadata of each animal NFT.
    * Additional attributes will be stored off-chain on IPFS
    */

    struct AnimalNFT {
        uint256 AnimalID;
        string animalType;
        string breed;
        uint256 herdNumber;
        uint256 supplyChainStage;
    }

    // Container to hold our NFTs
    AnimalNFT[] public animalNFTCollection;

    // mappings will go here
    mapping(address => animalNFTCollection) public ownerToNFTCollection;
    mapping(uint256 => uint256) public tokenIDToAnimalNFT;


    bytes32 public constant FARMER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    constructor()
        ERC721("AnimalProductTracker", "HalalTrace")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintNFT(
    address to,
    string memory animalType,
    string memory breed,
    uint256 herdNumber,
    string memory uri
    ) public onlyRole(FARMER_ROLE) {
        
        uint256 tokenId = _nextTokenId++;
        
        animalNFTCollection.push(
            AnimalNFT {
                animalID : tokenId,
                animalType : animalType,
                breed : breed,
                herdNumber : herdNumber,
                supplyChainStage : uint256("Created")
            }
        );
        tokenIDToAnimalNFT[tokenId] = tokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

