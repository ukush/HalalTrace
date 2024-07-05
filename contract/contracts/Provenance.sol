// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

/**
 * This contract allows users to determine the provenance (origin) of products.
 * Producers are added and their details stored permenantly on the blockchain
 * Certified producers can add products the the blockchain. Only key data points are needed.
 * The product is simply represented through it's id, which can be gathered via it's physical
 * barcode
 */

/**
 * To reduce gas... what needs to be in persistent storage??
 * Both mappings, products and producers
 * Supply chain events associated with those products
 */
contract Provenance { 

    address public owner;

    /**
     * @dev A struct which can link the CID of an IPFS file containing additional 
     * event data to each product & actor that performs that action. 
     */
    struct ScEvent {
        bytes32 dataURI; // The IPFS content id is always 256 bits (32 bytes) long
        uint256 timestamp;
    }

    /**
     * @dev Struct to store essential product info on-chain.
     */
    struct Product {
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
    mapping(address => Producer) producers;

    constructor() {
        owner = msg.sender;
    }

    /**
     * Function to register a producer's details
     * @param _name the company name of the producer
     * @param _country the primary country that the producer operates in 
     * @param _zip the zip/postcode of the producer's operation location
     * 
     */
    function addProducer(string memory _name, string memory _country, string memory _zip) public {
        // check that the company is not aready registered
        bytes memory nameStr = bytes(producers[msg.sender].name);
        require(nameStr.length == 0 , "Company wallet already registered");

        // add producer
        producers[msg.sender] = Producer(_name, _country, _zip, false);
    }

    /**
     * Function for admin to certify a producer
     * @param producer the public address of the producer
     */
    function certifyProducer(address producer) public {
        // The producer should be automatically certified once their docs have been checked
        // For now let's give the authority to the owner of the contract
        require(msg.sender == owner, "Only the contract owner can certify producers");

        if (producers[producer].certified == false) {
            // certify
            producers[producer].certified = true;
        }
    }

    /**
     * Function allowing a certified producer to add a new product to the chain
     * @param productId the product identifier (gathered from the physical barcode)
     * @param name the name of the product
     */
    function addProduct(uint256 productId, string memory name) public returns(uint256) {
        // check that the producer is certifed
        require(producers[msg.sender].certified == true, "Only certified producers can add new products");
        // check that the product doesn't already exist
        bytes memory nameStr = bytes(products[productId].name);
        require(nameStr.length == 0 , "That product already exists");

        // add product to mapping
        ScEvent[] memory events;
        Product memory product = Product(name, msg.sender, block.timestamp, events);
        products[productId] = product;

        // return the timestamp of creation
        return product.created;
    }

    /**
     * Function to link supply chain activity data to a product
     * @param productId the product identifier (gathered from the physical barcode)
     * @param eventURI the CID (content hash) of the IPFS file containing event data
     */
    function addProductEvent(uint256 productId, bytes32 eventURI) public {
        // check that the producer is certifed
        require(producers[msg.sender].certified == true, "Only certified producers can add new products");
        // check that the product doesn't already exist
        bytes memory nameStr = bytes(products[productId].name);
        require(nameStr.length == 0 , "That product already exists");

        Product storage product = products[productId];
        product.ScEvents.push(ScEvent(eventURI, block.timestamp));
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
        bytes memory nameStr = bytes(products[productId].name);
        require(nameStr.length != 0 , "That product already exists");

        return (
            products[productId].name,
            products[productId].producer,
            products[productId].created,
            products[productId].ScEvents
        );
    }
}