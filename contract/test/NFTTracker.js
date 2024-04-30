const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {
  async function deployContractAndSetVariables() {
    // get owner
    const [owner, addr1] = await hre.ethers.getSigners();
    // deploy the contract
    const nft = await hre.ethers.deployContract("ProductTracker");
    await nft.waitForDeployment();

    return { nft, owner, addr1 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // load fixture
      const { nft, owner } = await loadFixture(deployContractAndSetVariables);

      expect(await nft.owner()).to.equals(owner.address);
    });
  });

  describe("Minting", function () {
    it("Set the correct owner when a new token is minted", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployContractAndSetVariables);

      const tokenID = 1;
      const type = "Cattle";
      const breed = "Black Angus";
      const herdNum = 1234;
      
      // call the mint function
      await nft.mintToken(tokenID, type, breed, herdNum);
      
      const nftOwner = await nft.ownerOf(tokenID);
      expect(nftOwner).to.equal(owner.address);
    });
    it("A token can be minted by accounts other than the contract owner", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployContractAndSetVariables);

      const tokenID = 1;
      const type = "Cattle";
      const breed = "Black Angus";
      const herdNum = 1234;
      
      // call the mint function using a different address to the owner's
      await nft.connect(addr1).mintToken(tokenID, type, breed, herdNum);
      
      const nftOwner = await nft.ownerOf(tokenID);

      expect(nftOwner).to.equal(addr1.address);
    });
  });

  describe("Updating", function() {
    it("Owner of the nft can update the trace", async function() {
      const { nft, owner, addr1 } = await loadFixture(deployContractAndSetVariables);

      const tokenID = 1;
      const type = "Cattle";
      const breed = "Black Angus";
      const herdNum = 1234;
      const dataURI = "https://www.exampleURI.com"
      
      // call the mint function
      await nft.mintToken(tokenID, type, breed, herdNum);

      // call the update function
      await nft.updateTrace(tokenID, dataURI);

      // get the details using the getAnimalDetails function
      const nftDetails = await nft.getAnimalDetails(tokenID);


      expect(nftDetails[3].length).to.equals(1);
      expect(nftDetails[3][0].dataURI).to.equal(dataURI);

    });
  })
});
