const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');


module.exports = buildModule('Animal', (m) => {

    const tokenContract = m.contract("AnimalTracker");

    return { tokenContract };
});