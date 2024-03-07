const { expect } = require("chai");

/**
 * Unit tests:
 * - 1. Check that the constructor assigns the admin role to the deployer
 * - 2. Check the mint function mints the correct number of tokens
 * - 3. Create an attribute token and check that the mapping is correct
 * - 4. Test a getter and setter
 * - 5. Test the grant role function works
 * - 6. When an address is given a roler, check they can add the
 *  corresponding attribute token e.g. An account with farmer role can create a health
 * token.
 * 7. Check that addresses without the correct priveledge cannot mint attribute tokens
 * they do not have permission for e.g. an account with farmer role cannot mint a slaughter
 * token
 * - 
 */


describe("Token contract", function () {
  it("Deployment should assign the admin role to the owner", async function () {
  });

  
});