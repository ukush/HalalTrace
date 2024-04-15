var express = require('express');
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


router.get('/:id/farming', function(req, res) {
    const animalId = req.params.id;

    //res.sendStatus(200);
    
    import('../utilities/helia.mjs').then(({ getIPFSContent}) => {
      getIPFSContent("bagaaieraevjao3ade4uvjoxbhiil6fgjxfdinnuvgiipj4wpjy54uf2zxata");
    })
});

router.post('/:id/farming', function(req, res) {
    const animalId = req.params.id;
    let cid;
    data = req.body;

    console.log('Received form data for animal ID', animalId, ':', data);
    
    // store data on ipfs
    import('../utilities/helia.mjs').then(async ({ addToIPFS }) => {
      cid = await addToIPFS(data)
     })

    //  import('../utilities/ipfsUtils.mjs').then(async ({ default: storeData }) => {
    //   await storeData(animalId, data)
    //  })

    res.sendStatus(200);
  });

//   router.get('/slaughter', function(req, res, next) {
//     res.json({})
// });

// router.post('/:id/slaughter', function(req, res) {
//     const animalId = req.params.id;
//     data = req.body;
//     console.log('Received form data for animal ID', animalId, ':', data);
//     res.sendStatus(200); // Send a success status code back to the client
//   });

//   router.get('/:id/processing', function(req, res, next) {
//     res.json({})
// });

// router.post('/:batch/processing', function(req, res) {
//     const batchNo = req.params.batch;
//     data = req.body;
//     console.log('Received form data:', data);
//     res.sendStatus(200); // Send a success status code back to the client
//   });

//   router.get('/:batch/distribution', function(req, res, next) {
//     res.json({})
// });

// router.post('/:batch/distribution', function(req, res) {
//     const batchNo = req.params.batch;
//     data = req.body;
//     console.log('Received form data:', data);
//     res.sendStatus(200); // Send a success status code back to the client
//   });

//   router.get('/retail', function(req, res, next) {
//     res.json({})
// });

// router.post('/retail', function(req, res) {
//     data = req.body;
//     console.log('Received form data:', data);
//     res.sendStatus(200); // Send a success status code back to the client
//   });

module.exports = router;
