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

    // maps batch number to array of product ids
    mapping(uint256 => uint256[]) batches;
    // maps product id to product details
    mapping(uint256 => Product) products;
    // maps public address to the producer details
    mapping(address => Producer) producers;
    // maps batches/products to their owners
    // do we need to track each individual product's owner or just the batch?
    mapping(uint256 => address[]) owners;

    // Events
    event ProducerAdded(address producer, uint256 timestamp);
    event ProducerCertified(address producer, uint256 timestamp);
    event ProductAdded(uint256 productId, uint256 timestamp);
    event ScEventAdded(address actor, uint256 id, uint256 timestamp, bytes32 dataURI);
    event batchAdded(uint256 batchNumber, uint256 timestamp);
    event producerRemoved(address contractAdmin, address producerId, uint256 timestamp);
    event productRemoved(address contractAdmin, uint256 productId, uint256 timestamp);

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
        // emit event
        emit ProducerAdded(msg.sender, block.timestamp);
    }

    /**
     * Function to remove a producer
     * @param _producer the public address of the producer to be removed
     */
    function removeProducer(address _producer) public {
        // Only the contract owner is allowed to call this?
        require(msg.sender == owner, "Only the contract owner can remove producers");
        // Ensure that the producer is registered
        require(producers[_producer].name.length != 0, "Producer not found");
        // Delete by setting all values to zero
        delete(producers[_producer]);

        emit producerRemoved(owner, _producer, block.timestamp);
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
            // emit event
            emit ProducerCertified(msg.sender, block.timestamp);
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

        // update the owners (currently the same as the producer)
        owners[_productId].push(msg.sender);

        // emit event
        emit ProductAdded(_productId, product.created);
    
        // return the timestamp of creation
        return product.created;
    }

    function addBatchProducts(uint256 _batchNo, uint256[] memory _productIds, bytes32 _name) public {
        // ensure the batch doesn't already exist on-chain
        require(batches[_batchNo].length == 0, "A batch of products already exists with that batch id");
        
        for (uint i = 0; i < _productIds.length; i++) {
            addProduct(_productIds[i], _name);
        }

        // emit event
        emit batchAdded(_batchNo, block.timestamp);

    }

    function removeProduct(uint256 _productId) public {
        // only the contract owner can remove products
        require(msg.sender == owner, "Only the contract owner can remove products");
        // ensure the product exists
        require(products[_productId].name.length != 0, "Product not found");
        // delete by setting all values to zero
        delete(products[_productId]);
        delete(owners[_productId]);

        emit productRemoved(owner, _productId, block.timestamp);
    }

    /**
     * Function to link supply chain activity data to a product
     * This can be applied to both batches of products and individual products
     * @param _productId the product identifier (gathered from the physical barcode)
     * @param _eventURI the CID (content hash) of the IPFS file containing event data
     */
    function addProductEvent(uint256 _productId, bytes32 _eventURI) public {
        // check that the producer is certifed
        require(producers[msg.sender].certified == true, "Only certified producers can add new products");
        // check that the product doesn't already exist
        require(products[_productId].name.length == 0 , "That product already exists");

        // update mapping
        Product storage product = products[_productId];
        product.ScEvents.push(ScEvent(_eventURI, block.timestamp));

        // emit event
        emit ScEventAdded(msg.sender, _productId, product.ScEvents[product.ScEvents.length - 1].timestamp, _eventURI);
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
        require(products[_productId].name.length != 0 , "Product not found");

        return (
            products[_productId].name,
            products[_productId].producer,
            products[_productId].created,
            products[_productId].ScEvents
        );
    }
    /**
     * Function to return all the product ids in a batch given the batch number
     * @param _batchNo the unique identifier for the batch of products
     * @return An array of product ids
     */
    function findBatch(uint256 _batchNo) public view returns(uint256[] memory) {
        require(batches[_batchNo].length != 0, "Product Batch not found");

        return batches[_batchNo];
    }

    /**
     * Function to find the current owner of a product/batch
     * @param _productId the id of the product/batch
     * @return address the address of the current owner
     */
    function findCurrentOwner(uint256 _productId) public view returns(address) {
        require(owners[_productId][owners[_productId].length - 1] != address(0), "Product not found");
        return owners[_productId][owners[_productId].length - 1];
    }

     /**
     * Function to find the current owner of a product/batch
     * @param _productId the id of the product/batch
     * @return address[] an array of all the owners of the product/batch
     */
    function getOwnershipHistory(uint256 _productId) public view returns(address[] memory) {
        return owners[_productId];
    }
}   