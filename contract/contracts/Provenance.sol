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
        bytes32 name;
        address producer;
        uint256 created;
        ScEvent[] ScEvents;
    }

    /**
     * @dev Stores info about the producer on-chain
     */
    // do we need this on chain? or could we do with off-chain storage for this?
    struct Producer {
        bytes32 name;
        bytes32 country;
        bytes32 zip; // max of 6 characters? Use fixed length bytes
        bool certified;
        // could have something here like a hash of their certificate for ESG credentials
        // e.g. certificate of carbon emissions
    }

    mapping(uint256 => uint256[]) batches;

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
    function addProducer(bytes32 _name, bytes32 _country, bytes32 _zip) public {
        // check that the company is not aready registered
        require(producers[msg.sender].name.length == 0 , "Company wallet already registered");
        // add producer
        producers[msg.sender] = Producer(_name, _country, _zip, false);
    }

    /**
     * Function for admin to certify a producer
     * @param _producer the public address of the producer
     */
    function certifyProducer(address _producer) public {
        // The producer should be automatically certified once their docs have been checked
        // For now let's give the authority to the owner of the contract
        require(msg.sender == owner, "Only the contract owner can certify producers");

        if (producers[_producer].certified == false) {
            // certify
            producers[_producer].certified = true;
        }
    }

    /**
     * Function allowing a certified producer to add a new product to the chain
     * @param _productId the product identifier (gathered from the physical barcode)
     * @param _name the name of the product
     */
    function addProduct(uint256 _productId, bytes32 _name) public returns(uint256) {
        // check that the producer is certifed
        require(producers[msg.sender].certified == true, "Only certified producers can add new products");
        // check that the product doesn't already exist
        require(products[_productId].name.length == 0 , "That product already exists");

        // add product to mapping
        Product storage product = products[_productId];
        product.name = _name;
        product.producer = msg.sender;
        product.created = block.timestamp;
    
        // return the timestamp of creation
        return product.created;
    }

    function addBatchProducts(uint256 _batchNo, uint256[] memory _productIds) public {
        // ensure the batch doesn't already exist on-chain
        require(batches[_batchNo].length == 0, "A batch of products already exists with that batch id");
        for (uint i = 0; i < _productIds.length; i++) {
            //addProduct(_productIds[i]);
        }
    }


    /**
     * Function to link supply chain activity data to a product
     * @param _productId the product identifier (gathered from the physical barcode)
     * @param _eventURI the CID (content hash) of the IPFS file containing event data
     */
    function addProductEvent(uint256 _productId, bytes32 _eventURI) public {
        // check that the producer is certifed
        require(producers[msg.sender].certified == true, "Only certified producers can add new products");
        // check that the product doesn't already exist
        require(products[_productId].name.length == 0 , "That product already exists");

        Product storage product = products[_productId];
        product.ScEvents.push(ScEvent(_eventURI, block.timestamp));
    }

    /**
     * Function that returns the product details given a product Id
     * @param _productId the product identifier (gathered from the physical barcode)
     * @return _name the product name
     * @return _address the public address of the producer of this product
     * @return _created the timestamp of the creation of the product on chain
     * @return _scEvent array of the events associated with the product
     */
    function findProduct(uint256 _productId) public view returns(bytes32, address, uint, ScEvent[] memory) {
        require(products[_productId].name.length != 0 , "That product already exists");

        return (
            products[_productId].name,
            products[_productId].producer,
            products[_productId].created,
            products[_productId].ScEvents
        );
    }
}