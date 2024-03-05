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

    // Stages of the supply chain
    enum CurrentLifecycleStage {Created, Farm, Slaughter, Processing, Distribution, Retail, Purchased}

    // Maps animalTokenID to a attribute token ID
    // Each Animal NFT should only have 5 attribute tokens
    mapping (uint256 => uint256[5]) public animalToLifecycleTokens;

    // Maps animalTokenID to the current stage in the supply chain
    mapping(uint256 => uint256) public animalToCurrentStage;
    
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

        uint256[] memory ids;
        uint256[] memory amounts;

        // create ids for Animal NFTs
        for (uint256 i = 0; i < amount; i++) {
            ids[i] = _nextTokenId++;
            amounts[i] = 1;
        }

        // update all the stages to Created
        for (uint256 i = 0; i < ids.length; i++) {
            animalToCurrentStage[ids[i]] = uint256(CurrentLifecycleStage.Created);
        }

        bytes memory data = abi.encode(animalType, breed, herdNumber);

        _mintBatch(to, ids, amounts, data);
    }

    //--------------------- Mint Tokens ----------------------------//

    /**
     * Creates a health token and adds to the animal's attribute token mapping
     * @param animalTokenId the id of the animal NFT
     * @param weight the weight of the animal
     * @param vetApproved flag for whether vet has approved the animal for slaughter
     */
    function mintHealthToken(uint256 animalTokenID, uint256 weight, bool vetApproved) public onlyRole(FARMER_ROLE) {
        _nextTokenId++;
        bytes memory data = abi.encode(weight, vetApproved);
        uint256 healthTokenID = _mint(msg.sender, _nextTokenId, 1, data);
        addHealthToken(animalTokenID, healthTokenID);
    }

    /**
     * Creates a health token and adds to the animal's attribute token mapping
     * @param animalTokenId the id of the animal NFT
     * @param slaughterDate the timestamp of the slaughter
     * @param preStunned flag for whether animal has been stunned before slaughter
     * @param slaughterMethod the method of slaughter e.g. Mechanical or Hand
     * @param slaughterApparatus the apparatus used ofor the slaughter
     * @param invocation flag for whether the invocation of prayer has been recited prior to slaughtering
     * @param slaughtermanID the id of the person carrying out the slaughter
     */
    function mintSlaughterToken(uint256 animalTokenID, uint256 slaughterDate, bool preStunned, string memory slaughterMethod, string memory slaughterApparatus, bool invocation, string memory slaughtermanID) public onlyRole(SLAUGHTERHOUSE_ROLE) {
        _nextTokenId++;
         bytes memory data = abi.encode(slaughterDate, preStunned, slaughterMethod, slaughterApparatus, invocation, slaughtermanID);
         uint256 slaughterTokenID = _mint(msg.sender, _nextTokenId, 1, data);
         addSlaughterToken(animalTokenID, slaughterTokenID);
    }

    /**
     * Creates a processing attribute token and adds it to the animal's attribute token mapping
     * @param animalTokenId the id of the animal NFT
     * @param productionDate the timestamp of production
     * @param bestBeforeDate the timestamp representing best before of the product
     * @param batchNo the batchNo of the product
     */
    function mintProcesingToken(uint256 animalTokenID, uint256 productionDate, uint256 bestBeforeDate, string memory batchNo) public onlyRole(PROCESSOR_ROLE) {
            _nextTokenId++;
            bytes memory data = abi.encode(productionDate, bestBeforeDate, batchNo);
            uint256 processingTokenId = _mint(msg.sender, _nextTokenId, 1, data);
            addProcessingToken(animalTokenID, processingTokenId);
    }

    /**
     * Creates a distribution attribute token and adds it to the animal's attribute token mapping
     * @param animalTokenId the id of the animal NFT
     * @param arrivalDate timestamp for time/date of arrival of product into the warehouse
     * @param batchNo the batch number of the product
     */
    function mintDistributionToken(uint256 animalTokenID, uint256 arrivalDate, bool batchNo) public onlyRole(DISTRIBUTOR_ROLE) {
        _nextTokenId++;
        bytes memory data = abi.encode(arrivalDate, batchNo);
        uint256 distributionTokenID = _mint(msg.sender, _nextTokenId, 1, data);
        addDistributorToken(animalTokenID, distributionTokenID)
    }

    /**
     *  Creates a retail attribute token and adds it to the animal's attribute token mapping
     * @param animalTokenId the id of the animal NFT
     * @param arrivalDate timestamp for time/date of arrival of product into the warehouse
     * @param batchNo the batch number of the product
     */
    function mintRetailToken(uint256 animalTokenID, uint256 arrivalDate, bool batchNo, uint256 bestBeforeDate) public onlyRole(DISTRIBUTOR_ROLE) {
        _nextTokenId++;
        bytes memory data = abi.encode(arrivalDate, batchNo, bestBeforeDate);
        uint256 retailTokenID = _mint(msg.sender, _nextTokenId, 1, data);
        addRetailToken(animalTokenID, retailTokenID);
    }

    // ---------------------- Add attribute tokens to Animal Tokens ----------------------//

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param healthTokenId the id of the health attribute token id
     */
    function addHealthToken(uint256 animalTokenId, uint256 healthTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Created), "Health token already added or invalid stage");
      
        // Add the health token
        animalToLifecycleTokens[animalTokenId][0] = healthTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Farm);
    }

    /**
     * Updates the mapping for animal NFT to it's associated slaughter token
     * @param animalTokenId the id of the animal NFR
     * @param healthTokenId the id of the health attribute token id
     */
    function addSlaughterToken(uint256 animalTokenId, uint256 slaughterTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Farm), "Invalid stage to add slaughter token");
        // Add the slaughter token
        animalToLifecycleTokens[animalTokenId][1] = slaughterTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Slaughter);
    }

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param healthTokenId the id of the health attribute token id
     */
    function addProcessingToken(uint256 animalTokenId, uint256 processingTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Slaughter), "Invalid stage to add slaughter token");
        // Add the processing token
        animalToLifecycleTokens[animalTokenId][2] = processingTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Processing);
    }

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param healthTokenId the id of the health attribute token id
     */
    function addDistributorToken(uint256 animalTokenId, uint256 disributorTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Processing), "Invalid stage to add slaughter token");
        // Add the distibution token
        animalToLifecycleTokens[animalTokenId][3] = disributorTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Distribution);
    }

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param healthTokenId the id of the health attribute token id
     */
    function addRetailToken(uint256 animalTokenId, uint256 retailTokenId) private {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Distribution), "Invalid stage to add slaughter token");
        // Add the retail token
        animalToLifecycleTokens[animalTokenId][4] = retailTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Retail);
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