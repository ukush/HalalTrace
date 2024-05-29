const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');


module.exports = buildModule('IHalalTrace', (m) => {

    const tokenContract = m.contract("IHalalTrace");

    return { tokenContract };
});