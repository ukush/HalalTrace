// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ProductTracker is ERC721("HalalTrace", "HTrace") {

    address public owner;
    

    event Mint(address minter, uint256 tokenId);
    event Updated(address minter, string newURI);

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

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev function to mint animal nft
     * @param tokenId the unique id of the animal on the farm
     * @param _type the type of animal
     * @param _breed the breed of the animal
     * @param _herdNum the herd number of the animal
     */
    function mintToken(uint256 tokenId, string memory _type, string memory _breed, uint256 _herdNum) 
    public returns(uint256) {

        NFT storage nft = id2NFT[tokenId];
        nft.id = tokenId;
        nft.animalType = _type;
        nft.breed = _breed;
        nft.herdNumber = _herdNum;
        nft.intervals.push(block.timestamp);

        _safeMint(msg.sender, tokenId);

        emit Mint(msg.sender, tokenId);

        return nft.id;
    }

    /**
     * @dev function to update the event metadata
     * @param tokenId the unique id of the animal
     * @param dataURI the new uri pointing to IPFS file
     */
    function updateTrace(uint256 tokenId, string memory dataURI) public {
        // ensure only the owner of the NFT can update it
        require(ownerOf(tokenId) == msg.sender);

        NFT storage nft = id2NFT[tokenId];
        nft.trace.push(Event(msg.sender, dataURI, block.timestamp));

        emit Updated(msg.sender, dataURI);
    }

    /**
    * @dev function to return the details for a given animal product
    */
    function getAnimalDetails(uint256 tokenId) public view returns (NFT memory) {
        return id2NFT[tokenId];
    }
}