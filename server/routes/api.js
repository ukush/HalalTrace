var express = require('express');
var router = express.Router();
const { mint, update, trace } = require('../utilities/contractInteraction.js');

router.post('/nft/mint/:id', async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  const data = req.body
  console.log(`request object: ${JSON.stringify(data)}`)

  // Pass the body to the function that calls the smart contract mint function
  await mint(data.animalId, data.animalType, data.animalBreed, data.herdNumber);

  res.sendStatus(200);

})


router.get('/:id/farming', async function(req, res) {
    const animalId = req.params.id;

    // call the smart contract to get the cids from the event trace
    const data = await trace(animalId);
    const events = data[3]

    let cidArray = [];
    events.forEach(event => {
      const cid = event[1]
      cidArray.push(cid)
  });
  
  import('../utilities/helia.mjs').then(async ({ getIPFSContent}) => {
      const testCID = cidArray[0]
      await getIPFSContent(testCID)
      res.sendStatus(200);
  });
});

router.post('/:id/farming', async function(req, res) {
    const animalId = req.params.id;
    data = req.body;

    // store data on ipfs
    import('../utilities/helia.mjs').then(async ({ addToIPFS}) => {
    const cid = await addToIPFS(data)
    await update(animalId, cid)
    res.sendStatus(200);
    })
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
