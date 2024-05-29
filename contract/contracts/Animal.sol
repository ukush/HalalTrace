// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IHalalTrace.sol";

contract AnimalTracker is ERC721, IHalalTrace {
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
        uint256 created;
        Event[] trace;
    }

    /**
     * @dev maps ids to products
     */
    mapping(uint256 => NFT) private id2NFT;

    constructor() ERC721("AnimalToken", "ANML") {
        owner = msg.sender;
    }

    function mintNft(
        uint256 animalId,
        string calldata _type,
        string calldata _breed,
        uint256 _herdNum
    ) public returns (uint256 id) {
        // Check if the provided tokenId is already in use
        require(id2NFT[animalId].id == 0, "Token ID already exists");
        NFT storage nft = id2NFT[animalId];
        nft.id = animalId;
        nft.animalType = _type;
        nft.breed = _breed;
        nft.herdNumber = _herdNum;
        nft.created = block.timestamp;

        _safeMint(msg.sender, animalId);

        emit Mint(msg.sender, animalId);

        return nft.id;
    }

    function mintBatchNft(
        uint256[] memory animalIds,
        string memory _type,
        string memory _breed,
        uint256 _herdNum
    ) public payable {
        for (uint i = 0; i < animalIds.length; i++) {
            // Check if the provided tokenId is already in use
            require(id2NFT[animalIds[i]].id == 0, "Token ID already exists");
            NFT storage nft = id2NFT[animalIds[i]];
            nft.id = animalIds[i];
            nft.animalType = _type;
            nft.breed = _breed;
            nft.herdNumber = _herdNum;
            nft.created = block.timestamp;

            _safeMint(msg.sender, animalIds[i]);
        }
    }

    function updateTrace(
        uint256 tokenId,
        string calldata ipfsDataCid
    ) public payable {
        // ensure that the animal/product exists
        require(
            id2NFT[tokenId].id != 0,
            "Token ID not accociated with a product/animal"
        );
        // ensure only the owner of the NFT can update it
        require(ownerOf(tokenId) == msg.sender);

        NFT storage nft = id2NFT[tokenId];
        nft.trace.push(Event(msg.sender, ipfsDataCid, block.timestamp));

        emit Updated(msg.sender, ipfsDataCid);
    }

    function getTrace(
        uint256 tokenId
    ) public view override returns (bytes memory) {
        // ensure that the animal/product exists
        require(
            id2NFT[tokenId].id != 0,
            "Token ID not accociated with a product/animal"
        );

        return (
            abi.encode(
                id2NFT[tokenId].animalType,
                id2NFT[tokenId].breed,
                id2NFT[tokenId].herdNumber,
                id2NFT[tokenId].trace
            )
        );
    }

    // function transferNft(
    //     uint256 tokenId,
    //     address _to
    // ) public payable override {
    //     // make publicsure the caller is the owner of the nft
    //     require(msg.sender == ownerOf(tokenId), "You must be the owner of this NFT in order to transfer it");
    //     safeTransferFrom(msg.sender, _to, tokenId);
    // }

    // function transferCollection(
    //     uint256[] memory ids,
    //     address _to
    // ) public payable override {
    //     for (uint256 i = 0; i < ids.length; i++) {
    //         // make sure the caller is the owner of the nft
    //         require(msg.sender == ownerOf(ids[i]), "You must be the owner of this NFT in order to transfer it");
    //         safeTransferFrom(msg.sender, _to, ids[i]);
    //     }
    // }

    // function acceptTransfer(
    //     bytes calldata data
    // ) external override returns (bool) {}

    // function rejectTransfer(
    //     bytes calldata data
    // ) external override returns (bool) {}

    // function requestTransfer(bytes calldata data) public override {}

    // function checkNftExists(uint256 tokenId) public view returns(bool) {
    //     if (id2NFT[tokenId].id == tokenId) {
    //         return true;
    //     } else return false;
    // }
}