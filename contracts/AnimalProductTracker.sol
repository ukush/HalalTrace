// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AnimalProductTracker is ERC1155, AccessControl {

    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant SLAUGHTERHOUSE_ROLE = keccak256("SLAUGHTERHOUSE_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    uint256 private _nextTokenId;

    enum CurrentLifecycleStage {Created, Farm, Slaughter, Processing, Distribution, Retail, Purchased}

    mapping (uint256 => uint256[5]) public animalToLifecycleTokens;
    mapping(uint256 => uint256) public animalToCurrentStage

    /**
     * When this contract is created, admin access is given to the deployer.
     * Mint access can only be granted by the admin and is only given to farmers once they've been verified off-chain
     * @param defaultAdmin the address of the owner of the contract
     */
    constructor(address defaultAdmin) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }


    /**
     * Mint any number of unique NFTs, each representing a real animal belonging to the farmer.
     * Should be called when a farmer wants to create an NFT for an animal within a herd, usually these are of the same type and breed.
     * Each NFT minted has a unique ID, but has the same base attribute vales, which can be added later.
     * Only a farmer with the MINTER_ROLE can call this function.
     * @param to the address of the farmer or caller of the function
     * @param animalType the type of animal
     * @param breed the breed of the animal
     * @param herdNumber the herd number associated with the animal
     * @param amount the number of animals in the herd (how many NFTs to mint)
     */
    function mintAnimalNFTs(address to, string memory animalType, string memory breed, uint256 herdNumber, uint256 amount) public onlyRole(FARMER_ROLE) {

        uint256[amount] memory ids;
        uint256[amount] memory amounts;

        for (uint256 i = 0; i < amount; i++) {
            ids[i] = _nextTokenId++;
            amounts[i] = 1;
        }

        // update all the stages to Created
        for (uint256 i = 0; i < ids.length; i++) {
            animalToCurrentStage[ids[i]] = uint256(LifecycleStage.Created);
        }

        bytes memory data = abi.encode(animalType, breed, herdNumber);

        _mintBatch(to, ids, amounts, data);
    }

    function mintHealthToken(uint256 animalTokenID, uint256 weight, bool vetApproved) public onlyRole(FARMER_ROLE) {
        _nextTokenId++;
        bytes memory data = abi.encode(weight, vetApproved);
        uint256 healthTokenID = _mint(msg.sender, _nextTokenId, 1, data);
        addHealthToken(animalTokenID, healthTokenID);
    }

    function mintSlaughterToken(uint256 animalTokenID, uint256 slaughterDate, bool preStunned, string memory slaughterMethod, string memory     slaughterApparatus, bool invocation, string slaughtermanID) public onlyRole(SLAUGHTERHOUSE_ROLE) {
        _nextTokenId++;
         bytes memory data = abi.encode(slaughterDate, preStunned, slaughterMethod, slaughterApparatus, invocation, slaughtermanID);
         uint256 slaughterTokenID = _mint(msg.sender, _nextTokenId, 1, data);
         addSlaughterToken(animalTokenID, slaughterTokenID)
    }

    function mintProcesingToken(uint256 animalTokenID, uint256 productionDate, uint256 bestBeforeDate, string memory batchNo) public onlyRole(PROCESSOR_ROLE) {
            _nextTokenId++;
            bytes memory data = abi.encode(productionDate, bestBeforeDate, batchNo);
            uint256 processingTokenId = _mint(msg.sender, _nextTokenId, 1, data);
            addProcessingToken(animalTokenID, processingTokenId);
    }

    function mintDistributionToken(uint256 animalTokenID, uint256 arrivalDate, bool batchNo) public onlyRole(DISTRIBUTOR_ROLE) {
        _nextTokenId++;
        bytes memory data = abi.encode(arrivalDate, batchNo);
        uint256 distributionTokenID = _mint(msg.sender, _nextTokenId, 1, data);
        addDistributorToken(animalTokenID, distributionTokenID);
    }

          
    function mintRetailToken(uint256 animalTokenID, uint256 arrivalDate, bool batchNo, uint256 bestBeforeDate) public onlyRole(DISTRIBUTOR_ROLE) {
        _nextTokenId++;
         bytes memory data = abi.encode(arrivalDate, batchNo, bestBeforeDate);
         uint256 retailTokenID = _mint(msg.sender, _nextTokenId, 1, data);
         addRetailToken(animalTokenID, retailTokenID);
    }


    function addHealthToken(uint256 animalTokenId, uint256 healthTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(LifecycleStage.Created), "Health token already added or invalid stage");
      
        // Add the health token
        animalToLifecycleTokens[animalTokenId][0] = healthTokenId;
        animalToCurrentStage[animalTokenId] = uint256(LifecycleStage.Health);
    }

    function addSlaughterToken(uint256 animalTokenId, uint256 slaughterTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(LifecycleStage.Health), "Invalid stage to add slaughter token");
        // Add the slaughter token
        animalToLifecycleTokens[animalTokenId][1] = slaughterTokenId;
        animalToCurrentStage[animalTokenId] = uint256(LifecycleStage.Slaughter);
    }

    function addProcessingToken(uint256 animalTokenId, uint256 processingTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(LifecycleStage.Slaughter), "Invalid stage to add slaughter token");
        // Add the processing token
        animalToLifecycleTokens[animalTokenId][2] = processingTokenId;
        animalToCurrentStage[animalTokenId] = uint256(LifecycleStage.Processing);
    }

    function addDistributorToken(uint256 animalTokenId, uint256 disributorTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(LifecycleStage.Processing), "Invalid stage to add slaughter token");
        // Add the distibution token
        animalToLifecycleTokens[animalTokenId][3] = disributorTokenId;
        animalToCurrentStage[animalTokenId] = uint256(LifecycleStage.Distribution);
    }

    function addRetailToken(uint256 animalTokenId, uint256 retailTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(LifecycleStage.Distribution), "Invalid stage to add slaughter token");
        // Add the retail token
        animalToLifecycleTokens[animalTokenId][4] = retailTokenId;
        animalToCurrentStage[animalTokenId] = uint256(LifecycleStage.Retail);
    }
    

    /**
     * Allow the admin (owner of the contract) to grant mint access to a specific address
     * @param farmer the address of the farmer to which minter role is to be granted
     */
    function grantMintAccess(address farmer)
    public 
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(FARMER_ROLE, farmer);
    }

    /**
     * Allow the admin (owner of the contract) to grant mint access to a specific address
     * @param slaughterhouse the address of the slaughterhouse to which minter role is to be granted
     */
    function grantSlaughterhouseRole(address slaughterhouse)
    public 
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(SLAUGHTERHOUSE_ROLE, slaughterhouse);
    }

    /**
     * Allow the admin (owner of the contract) to grant mint access to a specific address
     * @param processor the address of the processor to which minter role is to be granted
     */
    function grantProcessorRole(address processor)
    public 
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(PROCESSOR_ROLE, processor);
    }

    /**
     * Allow the admin (owner of the contract) to grant mint access to a specific address
     * @param distributor the address of the processor to which minter role is to be granted
     */
    function grantDistributorRole(address distributor)
    public 
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(DISTRIBUTOR_ROLE, distributor);
    }

        /**
     * Allow the admin (owner of the contract) to grant mint access to a specific address
     * @param retailer the address of the processor to which minter role is to be granted
     */
    function grantRetailerRole(address retailer)
    public 
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(RETAILER_ROLE, retailer);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}