// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

interface IHalalTrace {
   /**
     * @dev Mints an animal NFT and Returns the account approved for `tokenId` token.
     *
     * Requirements:
     * 
     * - `tokenId` must not already exist.
     */
    //function mintNft(uint256 tokenId, string calldata _type, string calldata _breed, uint256 _herdNum) external payable returns(uint256 id);

   /**
     * @dev Mints an animal part NFT and Returns the account approved for `tokenId` token.
     *
     * Requirements:
     * 
     * - `animalId` must already exist.
     * 
     */
    //function mintNft(uint256 animalId, string memory _name) external payable returns(uint256 id);

   /**
     * @dev Mints an animal product NFT and Returns the account approved for `tokenId` token.
     *
     * Requirements:
     * 
     * - Each `partId` must already exist.
     */
    //function mintNft(uint256[] memory partIds, string memory _productName) external payable returns(uint256 id);

   /**
     * @dev Mints an batch of animal NFTs.
     *
     * Requirements:
     * 
     * - `animalIds` must not already exist.
     */
    //function mintBatchNft(uint256[] memory animalIds, string memory _type, string memory _breed, uint256 _herdNum) external payable;
    
    /**
     * @dev Mints an batch of animal part NFTs.
     *
     * Requirements:
     * 
     * - `animalIds` must not already exist.
     */
    //function mintBatchNft(uint256[] memory animalIds, string memory _name) external payable;

    /**
     * @dev records supply chain activity data and the IPFS string
     *
     * Requirements:
     * 
     * - `tokenId` must already exist.
     */
    function updateTrace(uint256 tokenId, string calldata ipfsDataCid) external payable;
    
    /**
     * @dev Return the event trace of a given token
     *
     * Requirements:
     * 
     * - `tokenId` must already exist.
     */
    function getTrace(uint256 tokenId) external view returns(bytes memory);
    
    /**
     * @dev transfers nft tokenId to specified owner
     *
     * Requirements:
     * 
     * - `tokenId` must already exist.
     */
    //function transferNft(uint256 tokenId, address _to) external payable;
    
    /**
     * @dev transfers collection of nft tokenIds to specified owner
     *
     * Requirements:
     * 
     * - `tokenId` must already exist.
     */
    //function transferCollection(uint256[] memory ids, address _to) external payable;

    /**
     * @dev accept a transfer request
     *
     * Requirements:
     * 
     * - `tokenId` must already exist.
     */
    //function acceptTransfer(bytes calldata data) external returns(bool);
    
    /**
     * @dev reject a transfer request
     *
     * Requirements:
     * 
     * - `tokenId` must already exist.
     */
    //function rejectTransfer(bytes calldata data) external returns(bool);

    /**
     * @dev request another address to be able to transfer an nft or collection of nfts
     *
     * Requirements:
     * 
     * - `tokenId` must already exist.
     */
    //function requestTransfer(bytes calldata data) external;

}