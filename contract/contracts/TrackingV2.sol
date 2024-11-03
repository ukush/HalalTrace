// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;


interface IProvenance {
    function checkProductOwner(address _actor, uint256 _productId) external view returns(bool);
}


/// @title Tracking.sol
/// @author Uwais Kushi-Mohammed
/// @notice This contract is responsible for keeping track of the flow of products as they
/// move down stream in the supply chain.
/// Where is the product (within the supply), Who has it, where is it going?

contract Tracking {
    
    /// @notice Stores the address of the contract owner
    address owner;

    address provenanceContractAddress;


    /// @dev Sets the owner to be the deployer of the contract
    constructor() {
        owner = msg.sender;
    }

    struct ContractParams {
        address promisor;
        uint256 productId;
        address recipient;
        uint256 arrival;
    }


    function setProvenanceContractAddress(address _contractAddress) public {
        provenanceContractAddress = _contractAddress;
    }


    // Farm --> Slaughterhouse --> Processing plant --> distrubution center --> retailer


    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @param _productId The unique product id
    /// @param _recipient A list of addresses that the product will 
    function setContractParams(uint256 _productId, address _recipient, uint256 _dateofArrival) public {
        // Has to be set my the owner of the product
        // todo - use better way to do this
        require(IProvenance(provenanceContractAddress).checkProductOwner(msg.sender, _productId), "You must be the owner to set the contract parameters");


        ContractParams memory contractParams = ContractParams(msg.sender, _productId, _recipient, _dateofArrival);

            contractParams.promisor = msg.sender;
            contractParams.productId = _productId;
            contractParams.recipient = _recipient;
            contractParams.arrival = _dateofArrival;
    }

 

    
 
}