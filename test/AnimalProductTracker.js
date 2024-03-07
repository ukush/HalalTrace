const { expect } = require("chai");

/**
 * Meaningful Unit tests:
 * - Check the mint function is assigning the correct amount of tokens
 * - 
 */


describe("Token contract", function () {
  it("Deployment should assign the admin role to the owner", async function () {
    // deploy a AnimalProductTracker contract
    const trackerContract = await ethers.deployContract("AnimalTrackerContract", [adminAddress], {
      value: 0x00
    });

    //query admin priveledged accounts
    const adminCount = await trackerContract.getRoleMemberCount(DEFAULT_ADMIN_ROLE);

    const members = [];
    for (let i = 0; i < adminCount; ++i) {
        members.push(await trackerContract.getRoleMember(DEFAULT_ADMIN_ROLE, i));
      }

  });

  
});