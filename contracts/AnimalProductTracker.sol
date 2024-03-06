// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AnimalProductTracker is ERC1155, AccessControl {
    // Define roles for access
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant SLAUGHTERHOUSE_ROLE = keccak256("SLAUGHTERHOUSE_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    // For token IDs
    uint256 private _nextTokenId;

    // To store all metadata on chain, define structs for each token

    struct AnimalMetadata {
        string animalType;
        string breed;
        uint256 herdNumber;
        uint256 supplyChainStage;
    }

    struct HealthMetadata {
        uint256 weight;
        bool vetApproved;
    }

    struct SlaughterMetadata {
        uint256 slaughterDate;
        bool preStunned;
        string slaughterMethod;
        string slaughterApparatus;
        bool invocation;
        string slaughtermanID;
    }

    struct ProcessingMetadata {
        uint256 productionDate;
        uint256 bestBeforeDate;
        string batchNo;
    }

    struct DistributionMetadata {
        uint256 arrivalDate;
        bool batchNo;
    }

    struct RetailMetadata {
        uint256 arrivalDate;
        bool batchNo;
        uint256 bestBeforeDate;
    }

    // Stages of the supply chain
    enum CurrentLifecycleStage {Created, Farm, Slaughter, Processing, Distribution, Retail, Purchased}

    // Maps animalTokenID to a attribute token ID
    // Each Animal NFT should only have 5 attribute tokens
    mapping (uint256 => uint256[5]) public animalToAttributeTokens;

    // Maps animalTokenID to the current stage in the supply chain
    mapping(uint256 => uint256) public animalToCurrentStage;

    mapping(uint256 => AnimalMetadata) public animalToMetadata;
    mapping(uint256 => HealthMetadata) public healthTokenToMetadata;
    mapping(uint256 => SlaughterMetadata) public slaughterTokenToMetadata;
    mapping(uint256 => ProcessingMetadata) public processingTokenToMetadata;
    mapping(uint256 => DistributionMetadata) public distributionTokenToMetadata;
    mapping(uint256 => RetailMetadata) public retailTokenToMetadata;

    
    /**
     * When this contract is created, admin access is given to the deployer.
     * Mint access can only be granted by the admin and is only given to farmers once they've been verified off-chain
     * @param defaultAdmin the address of the owner of the contract
     */
    constructor(address defaultAdmin) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    //--------------------- Mint Tokens ----------------------------//

    /**
     * Mint any number of unique NFTs, each representing a real animal belonging to the farmer.
     * Should be called when a farmer wants to create an NFT for an animal within a herd, usually these are of the same type and breed.
     * Each NFT minted has a unique ID, but has the same base attribute vales, which can be added later.
     * Only a farmer with the MINTER_ROLE can call this function.
     * @param to the address of the farmer or caller of the function
     * @param _animalType the type of animal
     * @param _breed the breed of the animal
     * @param _herdNumber the herd number associated with the animal
     */
    function mintAnimalNFT(address to,
    string memory _animalType,
    string memory _breed,
    uint256 _herdNumber
    ) public onlyRole(FARMER_ROLE)
    {
        _nextTokenId++;
        setAnimalMetadata(_nextTokenId, _animalType, _breed, _herdNumber);
        _mint(to, _nextTokenId, 1, "");
    }

    /**
     * Creates a health token and adds to the animal's attribute token mapping
     * @param _animalTokenId the id of the animal NFT
     * @param _weight the weight of the animal
     * @param _vetApproved flag for whether vet has approved the animal for slaughter
     */
    function mintHealthToken(uint256 _animalTokenId,
    uint256 _weight,
    bool _vetApproved
    ) public onlyRole(FARMER_ROLE)
    {
        _nextTokenId++;
        setHealthMetadata(_nextTokenId, _weight, _vetApproved);
        _mint(msg.sender, _nextTokenId, 1, "");
        addHealthToken(_animalTokenId, _nextTokenId);
    }

    /**
     * Creates a health token and adds to the animal's attribute token mapping
     * @param _animalTokenId the id of the animal NFT
     * @param _slaughterDate the timestamp of the slaughter
     * @param _preStunned flag for whether animal has been stunned before slaughter
     * @param _slaughterMethod the method of slaughter e.g. Mechanical or Hand
     * @param _slaughterApparatus the apparatus used ofor the slaughter
     * @param _invocation flag for whether the invocation of prayer has been recited prior to slaughtering
     * @param _slaughtermanID the id of the person carrying out the slaughter
     */
    function mintSlaughterToken( 
    uint256 _animalTokenId,
    uint256 _slaughterDate,
    bool _preStunned,
    string memory _slaughterMethod,
    string memory _slaughterApparatus,
    bool _invocation,
    string memory _slaughtermanID
    ) public onlyRole(SLAUGHTERHOUSE_ROLE) 
    {
        _nextTokenId++;

        setSlaughterMetadata(_nextTokenId, _slaughterDate, _preStunned, _slaughterMethod, _slaughterApparatus, _invocation, _slaughtermanID);
        _mint(msg.sender, _nextTokenId, 1, "");
        addSlaughterToken(_animalTokenId, _nextTokenId);
    }

    /**
     * Creates a processing attribute token and adds it to the animal's attribute token mapping
     * @param animalTokenId the id of the animal NFT
     * @param _productionDate the timestamp of production
     * @param _bestBeforeDate the timestamp representing best before of the product
     * @param _batchNo the batchNo of the product
     */
    function mintProcesingToken(
    uint256 animalTokenId,
    uint256 _productionDate,
    uint256 _bestBeforeDate,
    string memory _batchNo
    ) public onlyRole(PROCESSOR_ROLE)
    {
        _nextTokenId++;
        setProcessingMetadata(_nextTokenId, _productionDate, _bestBeforeDate, _batchNo);
        _mint(msg.sender, _nextTokenId, 1, "");
        addProcessingToken(animalTokenId, _nextTokenId);
    }

    /**
     * Creates a distribution attribute token and adds it to the animal's attribute token mapping
     * @param _animalTokenId the id of the animal NFT
     * @param _arrivalDate timestamp for time/date of arrival of product into the warehouse
     * @param _batchNo the batch number of the product
     */
    function mintDistributionToken(
        uint256 _animalTokenId,
        uint256 _arrivalDate,
        bool _batchNo
        ) public onlyRole(DISTRIBUTOR_ROLE)
    {
        _nextTokenId++;
        setDistributionMetadata(_nextTokenId, _arrivalDate, _batchNo);
        _mint(msg.sender, _nextTokenId, 1, "");
        addDistributorToken(_animalTokenId, _nextTokenId);
    }

    /**
     *  Creates a retail attribute token and adds it to the animal's attribute token mapping
     * @param _animalTokenId the id of the animal NFT
     * @param _arrivalDate timestamp for time/date of arrival of product into the warehouse
     * @param _batchNo the batch number of the product
     * @param _bestBeforeDate the best before date given by the retailer
     */
    function mintRetailToken(
        uint256 _animalTokenId,
        uint256 _arrivalDate,
        bool _batchNo,
        uint256 _bestBeforeDate
        ) public onlyRole(DISTRIBUTOR_ROLE) 
    {
        _nextTokenId++;
        setRetailMetadata(_nextTokenId, _arrivalDate, _batchNo, _bestBeforeDate);
        _mint(msg.sender, _nextTokenId, 1, "");
        addRetailToken(_animalTokenId, _nextTokenId);
    }

    // ----------------------- Getters and Setters metadata -------------------------------------------//
    /**
     * Returns the simple animal metadata given a animal token id
     * @param _tokenId the animal token id
     */
    function getAnimalMetadata(uint256 _tokenId) public view returns (AnimalMetadata memory) {
        return animalToMetadata[_tokenId];
    }

    /**
     * Function to set the metadata for the animal token
     * @param _animalTokenId the id of the animal NFT
     * @param _animalType the type of animal
     * @param _breed the breed of the animal
     * @param _herdNumber the herd number associated with the animal
     */
    function setAnimalMetadata(uint256 _animalTokenId, string memory _animalType, string memory _breed, uint256 _herdNumber) private {
        AnimalMetadata storage animalMetadata = animalToMetadata[_animalTokenId];
        animalMetadata.animalType = _animalType;
        animalMetadata.breed = _breed;
        animalMetadata.herdNumber = _herdNumber;
        animalMetadata.supplyChainStage = uint256(CurrentLifecycleStage.Created);
    }

     /**
     * Returns the health metadata given a animal token id
     * @param _tokenId the animal token id
     */
    function getHealthMetadata(uint256 _tokenId) public view returns (HealthMetadata memory) {
        return healthTokenToMetadata[_tokenId];
    }

    /**
     * Function to set the metadata for the health token
     * @param _healthTokenId the id of the health attribute token
     * @param _weight the weight of the animal
     * @param _vetApproved flag for whether vet has approved the animal for slaughter
     */
    function setHealthMetadata(uint256 _healthTokenId, uint256 _weight, bool _vetApproved) private {
        HealthMetadata storage healthMetadata = healthTokenToMetadata[_healthTokenId];
        healthMetadata.weight = _weight;
        healthMetadata.vetApproved = _vetApproved;
    }

    /**
     * Returns the slaughter metadata given a animal token id
     * @param _tokenId the animal token id
     */
    function getSlaughterMetadata(uint256 _tokenId) public view returns (SlaughterMetadata memory) {
        return slaughterTokenToMetadata[_tokenId];
    }
    
 /**
     * Set slaughter metadata for a given token ID
     * @param _tokenId The ID of the token to set metadata for
     * @param _slaughterDate The timestamp of the slaughter
     * @param _preStunned Flag for whether animal has been stunned before slaughter
     * @param _slaughterMethod The method of slaughter e.g. Mechanical or Hand
     * @param _slaughterApparatus The apparatus used for the slaughter
     * @param _invocation Flag for whether the invocation of prayer has been recited prior to slaughtering
     * @param _slaughtermanID The ID of the person carrying out the slaughter
     */
    function setSlaughterMetadata(
        uint256 _tokenId,
        uint256 _slaughterDate,
        bool _preStunned,
        string memory _slaughterMethod,
        string memory _slaughterApparatus,
        bool _invocation,
        string memory _slaughtermanID
    ) private {
        SlaughterMetadata storage metadata = slaughterTokenToMetadata[_tokenId];
        metadata.slaughterDate = _slaughterDate;
        metadata.preStunned = _preStunned;
        metadata.slaughterMethod = _slaughterMethod;
        metadata.slaughterApparatus = _slaughterApparatus;
        metadata.invocation = _invocation;
        metadata.slaughtermanID = _slaughtermanID;
    }

     /**
     * Returns the processing metadata given a animal token id
     * @param _tokenId the animal token id
     */
    function getProcessingMetadata(uint256 _tokenId) public view returns (ProcessingMetadata memory) {
        return processingTokenToMetadata[_tokenId];
    }

    /**
     * Set processing metadata for a given token ID
     * @param _tokenId The ID of the token to set metadata for
     * @param _productionDate The timestamp of production
     * @param _bestBeforeDate The timestamp representing the best before date of the product
     * @param _batchNo The batch number of the product
     */
    function setProcessingMetadata(
        uint256 _tokenId,
        uint256 _productionDate,
        uint256 _bestBeforeDate,
        string memory _batchNo
    ) private {
        ProcessingMetadata storage metadata = processingTokenToMetadata[_tokenId];
        metadata.productionDate = _productionDate;
        metadata.bestBeforeDate = _bestBeforeDate;
        metadata.batchNo = _batchNo;
    }

    /**
     * Returns the distribution metadata given a animal token id
     * @param _tokenId the animal token id
     */
    function getDistributionMetadata(uint256 _tokenId) public view returns (DistributionMetadata memory) {
        return distributionTokenToMetadata[_tokenId];
    }

    /**
     * Set distribution metadata for a given token ID
     * @param _tokenId The ID of the token to set metadata for
     * @param _arrivalDate Timestamp for the time/date of arrival of the product into the warehouse
     * @param _batchNo The batch number of the product
     */
    function setDistributionMetadata(
        uint256 _tokenId,
        uint256 _arrivalDate,
        bool _batchNo
    ) private {
        DistributionMetadata storage metadata = distributionTokenToMetadata[_tokenId];
        metadata.arrivalDate = _arrivalDate;
        metadata.batchNo = _batchNo;
    }

    /**
     * Returns the retail metadata given a animal token id
     * @param _tokenId the animal token id
     */
    function getRetailMetadata(uint256 _tokenId) public view returns (RetailMetadata memory) {
        return retailTokenToMetadata[_tokenId];
    }

    /**
     * Set retail metadata for a given token ID
     * @param _tokenId The ID of the token to set metadata for
     * @param _arrivalDate Timestamp for the time/date of arrival of the product into the warehouse
     * @param _batchNo The batch number of the product
     * @param _bestBeforeDate The best before date given by the retailer
     */
    function setRetailMetadata(
        uint256 _tokenId,
        uint256 _arrivalDate,
        bool _batchNo,
        uint256 _bestBeforeDate
    ) private {
        RetailMetadata storage metadata = retailTokenToMetadata[_tokenId];
        metadata.arrivalDate = _arrivalDate;
        metadata.batchNo = _batchNo;
        metadata.bestBeforeDate = _bestBeforeDate;
    }

    // ---------------------- Add attribute tokens to Animal Tokens ----------------------//

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param healthTokenId the id of the health attribute token id
     */
    function addHealthToken(uint256 animalTokenId, uint256 healthTokenId) 
    private 
    {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Created), "Health token already added or invalid stage");
      
        // Add the health token
        animalToAttributeTokens[animalTokenId][0] = healthTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Farm);
    }

    /**
     * Updates the mapping for animal NFT to it's associated slaughter token
     * @param animalTokenId the id of the animal NFR
     * @param slaughterTokenId the id of the health attribute token id
     */
    function addSlaughterToken(uint256 animalTokenId, uint256 slaughterTokenId) 
    private 
    {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Farm), "Invalid stage to add slaughter token");
        // Add the slaughter token
        animalToAttributeTokens[animalTokenId][1] = slaughterTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Slaughter);
    }

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param processingTokenId the id of the health attribute token id
     */
    function addProcessingToken(uint256 animalTokenId, uint256 processingTokenId) 
    private 
    {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Slaughter), "Invalid stage to add slaughter token");
        // Add the processing token
        animalToAttributeTokens[animalTokenId][2] = processingTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Processing);
    }

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param distributionTokenId the id of the health attribute token id
     */
    function addDistributorToken(uint256 animalTokenId, uint256 distributionTokenId) 
    private 
    {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Processing), "Invalid stage to add slaughter token");
        // Add the distibution token
        animalToAttributeTokens[animalTokenId][3] = distributionTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Distribution);
    }

    /**
     * Updates the mapping for animal NFT to it's associated health token
     * @param animalTokenId the id of the animal NFR
     * @param retailTokenId the id of the health attribute token id
     */
    function addRetailToken(uint256 animalTokenId, uint256 retailTokenId) 
    private 
    {
        require(animalToCurrentStage[animalTokenId] == uint256(CurrentLifecycleStage.Distribution), "Invalid stage to add slaughter token");
        // Add the retail token
        animalToAttributeTokens[animalTokenId][4] = retailTokenId;
        animalToCurrentStage[animalTokenId] = uint256(CurrentLifecycleStage.Retail);
    }

    /**
     * Allow the admin (owner of the contract) to grant a specific role to a user address
     * @param role the role to be granted (FARMER_ROLE, SLAUGHTERHOUSE_ROLE, etc.)
     * @param user the address of the user to which the role is to be granted
     */
    function grantUserRole(bytes31 role, address user)
    public onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _grantRole(role, user);
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

    // Getters
    
}