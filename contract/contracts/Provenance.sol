// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;


/**
 * This contract allows users to determine the provenance (origin) of products.
 * Producers are added and their details stored permenantly on the blockchain
 * Certified producers can add products the the blockchain. Only key data points are needed.
 * The product is simply represented through it's id, which can be gathered via it's physical
 * barcode
 * 
 * 
 */
contract Provenance {

    
    address public owner;

    /**
     * @dev A struct which can link the CID of an IPFS file containing additional 
     * event data to each product & actor that perform. 
     */
    struct ScEvent {
        string dataURI;
        uint256 timestamp;
    }

    /**
     * @dev Struct to store essential product info on-chain.
     */
    struct Product {
        uint256 productId;
        string name;
        address producer;
        uint256 created;
        ScEvent[] ScEvents;
    }

    /**
     * @dev Stores info about the producer on-chain
     */
    // do we need this on chain? or could we do with off-chain storage for this?
    struct Producer {
        string name;
        string country;
        string zip;
        bool certified;
        // could have something here like a hash of their certificate for ESG credentials
        // e.g. certificate of carbon emissions
    }

    // maps product id to product details
    mapping(uint256 => Product) products;
    // maps public address to the producer details
    mapping(uint256 => Producer) producers;

    constructor() {
        owner = msg.sender;
    }

    /**
     * Function to register a producer's details
     * @param name the company name of the producer
     * @param country the primary country that the producer operates in 
     * @param zip the zip/postcode of the producer's operation location
     */
    function addProducer(string memory name, string memory country, string memory zip) public {

    }

    /**
     * Function for admin to certify a producer
     * @param producer the public address of the producer
     */
    function certifyProducer(address producer) public {

    }

    /**
     * Function allowing a certified producer to add a new product to the chain
     * @param productId the product identifier (gathered from the physical barcode)
     * @param name the name of the product
     */
    function addProduct(uint256 productId, string memory name) public returns(uint256) {

    }

    /**
     * Function to link supply chain activity data to a product
     * @param productId the product identifier (gathered from the physical barcode)
     * @param eventURI the CID (content hash) of the IPFS file containing event data
     */
    function addProductEvent(uint256 productId, string calldata eventURI) public {
        
    }

    /**
     * Function that returns the product details given a product Id
     * @param productId the product identifier (gathered from the physical barcode)
     * @return name the product name
     * @return address the public address of the producer of this product
     * @return created the timestamp of the creation of the product on chain
     * @return ScEvent[] array of the events associated with the product
     */
    function findProduct(uint256 productId) public view returns(string memory, address, uint, ScEvent[] memory) {
        
    }





}