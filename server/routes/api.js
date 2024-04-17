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

router.post('/nft/mint/:id', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  const data = req.body
  console.log(`request object: ${JSON.stringify(data)}`)

  // Pass the body to the function that calls the smart contract mint function


  res.sendStatus(200);

})


router.get('/:id/farming', function(req, res) {
    const animalId = req.params.id;

    // call the smart contract to get the cids from the event trace
    // pass them into the getIPFSContent()

    import('../utilities/helia.mjs').then(async ({ getIPFSContent}) => {
      const dataString = await getIPFSContent();
      console.log(`Data from IPFS Node: ${dataString}`)
      
    })

    res.sendStatus(200);
});

router.post('/:id/farming', function(req, res) {
    const animalId = req.params.id;
    data = req.body;

    // store data on ipfs
    import('../utilities/helia.mjs').then(async ({ addToIPFS }) => {
      const cid = await addToIPFS(data)

      // Store this cid on the blockchain
      // Call the smart contract code
      // Need the tokenID (animalId) and the dataURI (the cid)




     })
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
