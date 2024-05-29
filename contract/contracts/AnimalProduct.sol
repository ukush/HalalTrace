// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IHalalTrace.sol";

contract AnimalProductTracker is ERC721, IHalalTrace {
    address public owner;
    uint256 nextTokenId;

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
        uint256 productId;
        uint256[] parts;
        string productName;
        uint256 created;
        Event[] trace;
    }

    /**
     * @dev maps ids to products
     */
    mapping(uint256 => NFT) private id2NFT;

    constructor() ERC721("HTProduct", "HTP") {
        owner = msg.sender;
    }

    function mintNft(
        uint256[] memory partIds, string memory _productName
    ) public payable returns (uint256 id) {
        nextTokenId++;

        // Check if the provided tokenId is already in use
        require(id2NFT[nextTokenId].productId == 0, "Token ID already exists");
        NFT storage nft = id2NFT[nextTokenId];
        nft.productId = nextTokenId;
        nft.parts = partIds;
        nft.productName = _productName;
        nft.created = block.timestamp;

        _safeMint(msg.sender, nextTokenId);

        emit Mint(msg.sender, nextTokenId);

        return nft.productId;
    }


    function updateTrace(uint256 tokenId, string calldata ipfsDataCid) public payable override {
        // ensure that the animal/product exists
        require(
            id2NFT[tokenId].productId != 0,
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
            id2NFT[tokenId].productId != 0,
            "Token ID not accociated with a product/animal"
        );
        return (
            abi.encode(
                id2NFT[tokenId].productId,
                id2NFT[tokenId].parts,
                id2NFT[tokenId].productName,
                id2NFT[tokenId].created,
                id2NFT[tokenId].trace
            )
        );
    }

    // function transferNft(
    //     uint256 tokenId,
    //     address _to
    // ) public payable override {
    //     // make sure the caller is the owner of the nft
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
    // ) public override returns (bool) {}

    // function rejectTransfer(
    //     bytes calldata data
    // ) public override returns (bool) {}

    // function requestTransfer(bytes calldata data) public override {}

    // function checkAnimalExists(address contractAddress, uint256 animalId) public returns (bool) {
    //     IHalalTrace halalTrace = IHalalTrace(contractAddress);
    //     return halalTrace.checkNftExists(animalId);
    // }

}