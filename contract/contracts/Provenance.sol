// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

contract Provenance {


    address public owner;

    struct ScEvent {
        string dataURI;
        uint256 timestamp;
    }

    struct Product {
        uint256 productId;
        string name;
        address producer;
        uint256 created;
        ScEvent[] ScEvents;
    }


    // do we need this on chain? or could we do with off-chain storage for this?
    struct Producer {
        string name;
        uint256 phoneNo;
        string country;
        string city;
        string zip;
        bool certified;
    }

    mapping(uint256 => Product) products;
    mapping(uint256 => Producer) producers;

    constructor() {
        owner = msg.sender;
    }


    function addProduct(uint256 productId, string memory name) public returns(uint256) {

    }

    function addProductEvent(uint256 productId, string calldata eventURI) public {
        
    }

    function findProduct(uint256 productId) public view returns(string memory, uint256, address, uint256) {
        
    }





}