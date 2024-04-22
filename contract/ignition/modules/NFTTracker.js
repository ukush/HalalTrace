const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');


module.exports = buildModule('NFTTracker', (m) => {

    const tokenContract = m.contract("ProductTracker");

    return { tokenContract };
});