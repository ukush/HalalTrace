const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');


module.exports = buildModule('AnimalProduct', (m) => {

    const tokenContract = m.contract("AnimalProductTracker");

    return { tokenContract };
});