// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.5.0 <0.9.0;

/**
 * This contract is reponsible for recording and and keeping track of the product shipment
 * details such as timestamps, location (can be simulated for now) as well as proof of
 * receipt. It also faciliates owners of products to send shipments to recipients and for 
 * recipients to pay their suppliers via an escrow service.
 * 
 * 
 * How to improve...
 * Integrate with oracles --> to get 'real-time data' such as location,
 * if integrated with smart sensors.
 * 
 * 
 * Modify the shipment struct..

 * Both senders AND Recipients are storing information?
 * OR are the recipients just checking that the information is the same?
 * When they send it to the next person, they then do the same?
 * So when they record it, the shipping info get's overwritten? -> Is this what you want to happen?
 * Or do you want the the entire shipment history to be stored?
 * 
 * 
 * 
 */

interface Provenance {
    function changeOwner(uint256 _productId, address newOwner) external;
}

contract Tracking {
    
    address owner;


    constructor() {
        owner = msg.sender;
    }

    struct Shipment {
        uint256 quantity;
        uint256 timeSent;
        uint256 leadTime;
        uint256 agreedPayAmount;
        address sender;
        address recipient;
    }

    // how is the shipment details stored?
    // If you have a mapping, what is the key? The batchNo?
    mapping(uint256 => Shipment) shipmentDetails;

    event ShipmentSent(address sender, address recipient, uint256 timeSent, uint256 batchNo);
    event IncorrectQuantity(uint256 expectedQuantity, uint256 receivedQuantity, uint256 batchNo, address sender);
    event LateShipment(uint256 expectedTimeOfArrival, uint256 timeOfArrival, uint256 batchNo, address sender);

    /**
     * SetContractParameters
     * AgreeToContractParams
     * RejectContractParams 
     * Send Shipment --> BatchNumber, quantity of items in the batch, lead time, agreed pay
     * Receive Shipment / Confirm Shipment
     * Change ownership
     * 
     * Need to make this a token contract? --> SO that you can send the tokens
     * Tokenomics --> How much supply? Who initially holds them? etc.
     * 
     */

    /**
     * Function to allow owner of products to send a shipment to a recipient.
     * Details about the shipment are recorded on-chain
     * @param _batchNo The batch number of the product shipment
     * @param _quantity The quanity of products within that batch
     * @param _leadTime The agreed upon lead time for the shipment to be delivered
     * @param _agreedPay The agreed upon price of the product shipment
     * @param _recipient The public address of the recipient
     */
    function sendShipment(uint256 _batchNo, uint256 _quantity, uint256 _leadTime, uint256 _agreedPay, address _recipient) public {
        // Store in a mapping?
        require(shipmentDetails[_batchNo].timeSent == 0, "Shipment has already been sent");
        
        // todo - only the owner of the batch should be able to send the shipment

        // store shipment details
        shipmentDetails[_batchNo] = Shipment(block.timestamp, _quantity, _leadTime, _agreedPay, msg.sender, _recipient);

        // emit event
        emit ShipmentSent(msg.sender, _recipient, block.timestamp, _batchNo);

    }

    /**
     * Function to allow the recipient of a shipment to record details about it on chain.
     * The function checks that the shipment was delivered in time, as well as the quantity 
     * of the product shipment matches what was recorded by the supplier.
     * @param _batchNo The batch number of the product shipment
     * @param _quantity The quantity recorded by the recipient
     */

    function receiveShipment(uint256 _batchNo, uint256 _quantity) public {
        // compare the shipping details that was recorded by the supplier to what recipient finds
        uint256 timeOfArrival = block.timestamp;
        // Retrieve the shipment details from mapping and store in memory for cheaper reads
        Shipment memory shipment = shipmentDetails[_batchNo];

        if (shipment.quantity == _quantity 
            && (shipment.leadTime <= (timeOfArrival - shipment.timeSent))) {
            
            // Quantity match and arrived on time
            // release the payment?
        } else {
            if (shipment.quantity != _quantity) {
                // emit an error message
                emit IncorrectQuantity(shipment.quantity, _quantity, _batchNo, shipment.sender);
            }
            if (shipment.leadTime > (timeOfArrival - shipment.timeSent)) {
                // emit an error message
                uint256 estimatedTimeOfArrival = shipment.leadTime + shipment.timeSent;
                emit LateShipment(estimatedTimeOfArrival, timeOfArrival, _batchNo, shipment.sender);
            }
        }
    }

    /**
     * Function to retrieve shipment details for a given product batch/shipment
     * @param _batchNo The batch number given to the product shipments
     * @return _quantity The quantity of the product shipment
     * @return _timeSent The date/time when the product shipment was sent
     * @return _sender The public address of the sender of the shipment
     */
    function checkShipment(uint256 _batchNo) public view returns(uint256, uint256, address) {
        Shipment storage shipment = shipmentDetails[_batchNo];
        require(shipment.quantity != 0, "Shipment information cannot be found");

        return (
            shipment.quantity,
            shipment.timeSent,
            shipment.sender
        );
    }

    /**
     * Function to change the owner of the product/batch.
     * This is called when the shipment is successful?
     * @param _batchNo the batch number of the product shipment
     * @param _newOwner the new owner of the shipment (i.e. the recipient)
     */
    function changeOwnership(uint256 _batchNo, address _newOwner) public {
        // call the changeOwner function from the Provenance.sol contract --> need to deploy first
    }

    
 
}