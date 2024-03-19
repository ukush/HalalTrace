// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AnimalProductTracker is ERC721("HalalTrace", "HTrace") { 

    /**
     * @dev defines an event which occurs at the major control points of the supply chain
     */
    struct Event {
        address participant;
        string dataURI;
        uint256 timestamp;
    }

    /**
    * @dev defines the basic metadata of each animal NFT.
    */
    struct NFT {
        uint256 id;
        string animalType;
        string breed;
        uint256 herdNumber;
        Event[] trace;
        uint256[] intervals;
    }

    /**
    * @dev maps ids to products
    */
    mapping (uint256 => NFT) private id2NFT;

    /**
     * @dev function to mint animal nft
     * @param animalId the unique id of the animal on the farm
     * @param _type the type of animal
     * @param _breed the breed of the animal
     * @param _herdNum the herd number of the animal
     */
    function createAnimalNFT(uint256 animalId, string memory _type, string memory _breed, uint256 _herdNum) public returns(uint256) {

        NFT storage nft = id2NFT[animalId];
        nft.id = animalId;
        nft.animalType = _type;
        nft.breed = _breed;
        nft.herdNumber = _herdNum;
        nft.intervals.push(block.timestamp);

        _safeMint(msg.sender, animalId);
        return animalId;
    }

    /**
     * @dev function to update the event metadata
     * @param animalId the unique id of the animal
     * @param dataURI the new uri pointing to IPFS file
     */
    function update(uint256 animalId, string memory dataURI) public {
        NFT storage nft = id2NFT[animalId];
        nft.trace.push(Event(msg.sender, dataURI, block.timestamp));
    }

    /**
    * @dev function to return the details for a given animal product
    */
    function getAnimalDetails(uint256 animalId) public view returns (NFT memory) {
        return id2NFT[animalId];
    }
}

