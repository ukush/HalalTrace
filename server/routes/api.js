var express = require('express');
const { default: setUpIPFS } = require('../utilities/ipfs');
var router = express.Router();

/**
 * Get requests - Do I need them?
 * Yes. But only single tokens at a time for now
 * So GET farming/{animalID} will give the up to date event trace thus far
 * Likewise slaughter/{animalID} etc. 
 * 
 * 
 * then.. You need a separate api endpoint with just the /{animalID} to get the full history?
 * 
 * Post requests - These are for submitting the form data
 * Should be: farming/{animalID}
 * 
 * 
 * Inside the post request, we want to:
 * 1. Publish the form data to IPFS
 * 2. Call the smart contract to update the event trace
 * 
 * The metadata is in the form of JSON:
 * 
 * Name:
 * Description:
 * image:
 * attributes:
 * 
 */


router.get('/:id/farming', function(req, res, next) {
    const animalId = req.params.id;
    // Call the contract code to retreive the data
    res.json({})
});

router.post('/:id/farming', function(req, res) {
    const animalId = req.params.id;
    data = req.body;

    console.log('Received form data for animal ID', animalId, ':', data);

    // 1. Create a URL
    // 2. Publish to IPFS
    // 3. Call the updateTrace() function from my contract - this is assuming it already exists

    //setup IPFS
    try {
      setUpIPFS()
      console.log("IPFS setup successful");
    } catch (error) {
      console.error("Error setting up IPFS", error)
    }
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/slaughter', function(req, res, next) {
    res.json({})
});

router.post('/:id/slaughter', function(req, res) {
    const animalId = req.params.id;
    data = req.body;
    console.log('Received form data for animal ID', animalId, ':', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/:id/processing', function(req, res, next) {
    res.json({})
});

router.post('/:batch/processing', function(req, res) {
    const batchNo = req.params.batch;
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/:batch/distribution', function(req, res, next) {
    res.json({})
});

router.post('/:batch/distribution', function(req, res) {
    const batchNo = req.params.batch;
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/retail', function(req, res, next) {
    res.json({})
});

router.post('/retail', function(req, res) {
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

module.exports = router;
