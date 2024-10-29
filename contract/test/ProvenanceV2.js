const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Provenance contract", function () {
  async function deployContractAndSetVariables() {
    // get owner
    const [owner, account1] = await ethers.getSigners();
    // deploy the contract
    const provV2 = await ethers.deployContract("ProvenanceV2");
    await provV2.waitForDeployment();

    return { provV2, owner, account1};
  }

  async function deployContractAndSetupActors() {

    const { provV2, owner, account1 } = await loadFixture(deployContractAndSetVariables) 

    // use the address of the contract owner
    const actorAddress = owner.address;
    const actorId = 12345;
    const location = ethers.hashMessage("LN1 1FN");
    const certificate = ethers.hashMessage("certified");

     // call the function
    await provV2.addScActor(actorAddress, actorId, location, certificate);

    // Return all necessary values for tests
    return { provV2, owner, account1, actorId };

  }

  async function deployContractAndPopulateWithProducts() {

    const { provV2, owner, account1 } = await loadFixture(deployContractAndSetupActors)

    const productId = 998334;

    // Call createProduct as a certified ScActor
    await provV2.createProduct(productId);

     // Return values needed for tests
     return { provV2, owner, account1, productId };

  }

  async function deployContractAndPopulateWithProductsWithEvents() {

    const { provV2, owner, account1, productId } = await loadFixture(deployContractAndPopulateWithProducts)

     // generate a mock cid hash
     const cid = ethers.hashMessage("random product data");
     const actor = owner.address;

    // Add events to this product as a certified ScActor
    await provV2.recordScEvent(productId, cid);

    // add another event
    const newEventCid = ethers.hashMessage("Second product event data");
    await provV2.recordScEvent(productId, newEventCid);

     // Return values needed for tests
     return { provV2, owner, account1, productId, cid, newEventCid };

  }


  describe("Deployment", function () {
    it("Should set the right owner", async function () {
        // load fixture
        const { provV2, owner, account1} = await loadFixture(deployContractAndSetVariables);
        
        // when the contact's contructor is called, it sets the owner address to whoever deployed it.
        // check if the owner is set correctly
        expect(await provV2.owner()).to.equals(owner.address)
    });
  });

  describe("Add a new ScActor", function () {
    it("Should emit an event with the correct args", async function () {
        const { provV2, owner, account1 } = await loadFixture(deployContractAndSetVariables);

        const actorAddress = owner.address;
        const actorId = 12345;
        const location = ethers.hashMessage("LN1 1FN");
        const certificate = ethers.hashMessage("certified");

        // call the function
        const tx = await provV2.addScActor(actorAddress, actorId, location, certificate);
      
        // Expect the function to emit the ScActorCreated event with the correct parameters
        await expect(tx)
            .to.emit(provV2, "ScActorCreated")
            .withArgs(actorAddress, actorId, location, certificate);
    });
    it("Should fail when you try to add an actor that already exists", async function () {
        const { provV2, owner, account1 } = await loadFixture(deployContractAndSetVariables);
  
        const actorAddress = owner.address;
        const actorId = 12345;
        const location = ethers.hashMessage("LN1 1FN");
        const certificate = ethers.hashMessage("certified");
  
        // call the function
        const tx = await provV2.addScActor(actorAddress, actorId, location, certificate);
        
          // Expect the function to emit the ScActorCreated event with the correct parameters
          await expect(tx)
              .to.emit(provV2, "ScActorCreated")
              .withArgs(actorAddress, actorId, location, certificate);

        // Call createProduct as non-certified ScActor
        await expect(provV2.addScActor(actorAddress, actorId, location, certificate)).to.be.revertedWith("This wallet address has already been registered")

      });
  });

  describe("Add a new product", function() {
    it("Should fail if caller is not a certified ScActor", async function () {
        const { provV2, owner, account1 } = await loadFixture(deployContractAndSetupActors);
  
        const actorAddress = account1.address;
        const productId = 998334;

        // Call createProduct as non-certified ScActor
        await expect(provV2.connect(account1).createProduct(productId)).to.be.revertedWith("Only certified actors can create new products")

    });
    it("Should fail if the product id is already in use", async function () {
        const { provV2, owner, account1 } = await loadFixture(deployContractAndSetupActors);
  
        const productId = 998334;

        // Call createProduct as a certified ScActor
        await provV2.connect(owner).createProduct(productId);
        // Call again with same productId
        await expect(provV2.createProduct(productId)).to.be.revertedWith("That product already exists");

    });
    it("Should emit an event with the correct args", async function() {
        const { provV2, owner, account1 } = await loadFixture(deployContractAndSetupActors);
  
        const productId = 998334;

        // Call createProduct as a certified ScActor
        const tx = await provV2.connect(owner).createProduct(productId);

        // Expect ProductCreated event with correct parameters
        const blockTimestamp = (await ethers.provider.getBlock(tx.blockNumber)).timestamp;
        await expect(tx)
            .to.emit(provV2, "ProductCreated")
            .withArgs(productId, blockTimestamp);
    });
  })

  describe("Add ScEvent to a product", function() {
    it("Should fail if product does not exist", async function() {
        const { provV2, owner, account1, productId } = await loadFixture(deployContractAndPopulateWithProducts)

        // generate a mock cid hash
        const cid = ethers.hashMessage("random product data");

        // use a different product id that hasn't been used before
        newProdId = 1234;

        await expect(provV2.recordScEvent(newProdId, cid)).to.be.revertedWith("That product does not exist");

    });
    it("Should fail if caller is not owner of the product", async function() {
       
        const { provV2, owner, account1, productId } = await loadFixture(deployContractAndPopulateWithProducts)

        // generate a mock cid hash
        const cid = ethers.hashMessage("random product data");

        // Call from a different wallet address
        await expect(provV2.connect(account1).recordScEvent(productId, cid)).to.be.revertedWith("You must be the owner to update product trace");
        
    });
    it("Should emit event with correct args if successful", async function() {
        const { provV2, owner, account1, productId } = await loadFixture(deployContractAndPopulateWithProducts)

         // generate a mock cid hash
         const cid = ethers.hashMessage("random product data");
         const actor = owner.address;

         const tx = await provV2.recordScEvent(productId, cid);

         // Expect ProductCreated event with correct parameters
         const blockTimestamp = (await ethers.provider.getBlock(tx.blockNumber)).timestamp;
         await expect(tx)
            .to.emit(provV2, "ScEventAdded")
            .withArgs(actor, productId, blockTimestamp, cid);
        
    });
  })
  describe("Find a product", function() {
    it("Should fail if product does not exist", async function() {
        const { provV2, owner, account1, productId } = await loadFixture(deployContractAndPopulateWithProductsWithEvents)

        // use a different product id that hasn't been used before
        newProdId = 1234;

        await expect(provV2.findProduct(newProdId)).to.be.revertedWith("That product does not exist");

    });
    it("Should return correct return values", async function() {
       
        const { provV2, owner, account1, productId, cid, newEventCid } = await loadFixture(deployContractAndPopulateWithProductsWithEvents)

        const product = await provV2.findProduct(productId);

        generatedCid1 = ethers.hashMessage("random product data");
        generatedCid2 = ethers.hashMessage("Second product event data");


        // the second value is the address of the product owner
        expect(product[1]).to.equals(owner.address)

        // check the value of the cid hashes match
        expect(product[2][0][1]).to.equals(generatedCid1)
        expect(product[2][1][1]).to.equals(generatedCid2)
        
    });
  })
});
