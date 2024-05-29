const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('AnimalPart', (m) => {

    const tokenContract = m.contract("AnimalPartTracker");

    return { tokenContract };
});
