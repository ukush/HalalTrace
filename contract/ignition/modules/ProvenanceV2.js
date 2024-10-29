const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');


module.exports = buildModule('ProvenanceV2', (m) => {

    const provV2 = m.contract("ProvenanceV2");

    return { provV2 };
});