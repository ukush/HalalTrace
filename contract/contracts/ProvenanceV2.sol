// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

/// @title Allows supply chain actors to create and 
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract ProvenanceV2 {

    address public owner;

    // Constructor code is only run when the contract
    // is created
    constructor() {
        owner = msg.sender;
    }

    /// @notice Represents any actor part of the supply chain
    struct ScActor {
        // unique id given to certified supply chain actor
        uint256 id;
        // 32 bytes hash of the location of the actor's registered location
        bytes32 location;
        // hash of the certificate issued by independent body
        bytes32 certificate;
    }

    /// @notice A meat product
    /// @dev All types of products can be represented by this struct
    /// eg. A live animal, cuts of animals and processed products made from multiple animal parts
    struct Product {
        // the timestamp of when this was created/registered
        uint256 created;
        // the contract address of the owner of the product
        address owner;
        // a trace of events that occur for each product
        ScEvent[] ScEvents;
    }

    /// @notice Stores event data for each product
    /// @dev The details of each event are stored on IPFS. 
    /// Here we just need to record who interacted with the product and when
    struct ScEvent {
        // timestamp of the event
        uint256 timestamp;
        // the content id hash of the IPFS file containing the details of the event
        bytes32 ipfsCid;
    }

    /// @notice Mapping to store products
    /// @dev Each product struct can be accessed by it's unique id
    mapping(uint256 => Product) idToProducts;

    /// @notice Maps supply chain actors to the products they own
    mapping(address => uint256[]) ownedProducts;

    /// @notice Maps the wallet address to a supply chain actor
    mapping(address => ScActor) ScActors;

    /// @notice Notifies user that a new product has been created
    /// @param productId the id of the newly created product
    /// @param timestamp the timestamp of when the product was created
    event ProductCreated(uint256 productId, uint256 timestamp);

    /// @notice Notifies user that a new product has been created
    /// @param actorWallet the wallet address of the new actor
    /// @param actorId the unique id of the supply chain actor
    /// @param location the hash of the location of the actor's company hq
    /// @param certificate the hash of the certification
    event ScActorCreated(address actorWallet, uint256 actorId, bytes32 location, bytes32 certificate);

    /// @notice Notifies user that a supply chain event has been recorded for a product
    /// @param actor the address of the supply chain actor
    /// @param id the productId that the event was recorded about
    /// @param timestamp the timestamp of when the event was recorded
    /// @param cid the ipfs cid hash containing the details of the event
    event ScEventAdded(address actor, uint256 id, uint256 timestamp, bytes32 cid);


    /// @notice Adds a new supply chain actor
    /// @param _actorWallet the wallet address of the new actor
    /// @param _actorId the unique id of the supply chain actor
    /// @param _location the hash of the location of the actor's company hq
    /// @param _certificate the hash of the certification
    function addScActor(address _actorWallet, uint256 _actorId, bytes32 _location, bytes32 _certificate) public {
        // make sure the actor hasn't already been added
        require(ScActors[_actorWallet].id == 0, "This wallet address has already been registered");

        ScActor storage actor = ScActors[_actorWallet];
        actor.id = _actorId;
        actor.location = _location;
        actor.certificate = _certificate;

        emit ScActorCreated(_actorWallet, _actorId, _location, _certificate);
    }


    /// @notice Allows for new products to be created
    /// @param _productId the unique product id generated off-chain
    function createProduct(uint256 _productId) public {
        // check that the product doesn't already exist
        require(idToProducts[_productId].created == 0 , "That product already exists");

        // check that the caller is a certified ScActor
        require(ScActors[msg.sender].id != 0, "Only certified actors can create new products");

        // add product to mapping
        Product storage product = idToProducts[_productId];
        product.created = block.timestamp;
        product.owner = msg.sender;

        // update the list of owned products
        ownedProducts[product.owner].push(_productId);
        
        // emit event
        emit ProductCreated(_productId, product.created);
    }

    /// @notice Allows for supply chain events to be added for a product
    /// @param _productId the unique product id generated off-chain
    /// @param _cid the ipfs cid hash containing details of the event
    function recordScEvent(uint256 _productId, bytes32 _cid) public {
        // check that the product already exist
        require(idToProducts[_productId].created != 0 , "That product does not exist");
        // ensure that the product exists and that only the owner can update the trace
        require(idToProducts[_productId].owner == msg.sender, "You must be the owner to update product trace");
        
        // update mapping
        Product storage product = idToProducts[_productId];
        product.ScEvents.push(ScEvent(block.timestamp, _cid));

        // emit event
        emit ScEventAdded(msg.sender, _productId, product.ScEvents[product.ScEvents.length - 1].timestamp, _cid);
    }

    /// @notice Gets the full product details for a given product
    /// @param _productId the unique product id generated off-chain
    /// @return the product struct
    function findProduct(uint256 _productId) public view returns(uint256, address, ScEvent[] memory) {
        Product storage product = idToProducts[_productId];
        // check that the product already exist
        require(product.created != 0 , "That product does not exist");

         return (
            product.created,
            product.owner,
            product.ScEvents
        );
    }


}