var express = require('express');
var router = express.Router();
const { mint, update, trace } = require('../utilities/contractInteraction.js');

//----------------------- Mint NFT Endpoint --------------------------//


router.post('/nft/mint/:id', async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  const data = req.body
  // Pass the body to the function that calls the smart contract mint function
  try {
    await mint(data.animalId, data.animalType, data.animalBreed, data.herdNumber);
    res.sendStatus(200);
  }catch (error) {
    res.status(502).send(error.error.reason);
  }
})

//----------------------- Update Trace Endpoint --------------------------//

router.post('/nft/events/:id', async function(req, res) {
    const animalId = req.params.id;
    data = req.body;
    import('../utilities/helia.mjs').then(async ({ addToIPFS}) => {
      try {
      // store data on ipfs
      const cid = await addToIPFS(data)
      // interact with smart contract to update the trace
      await update(animalId, cid)
      res.sendStatus(200);
    } catch(error) {
      if (error.error.reason) {
        // means there was an error with the smart contract - send the error to front end
        res.status(502).send(error.error.reason)
      } else (res.status(500).send(error)) // some error with IPFS
    }
    })
  });

//----------------------- Get Trace Endpoint --------------------------//

router.get('/nft/events/:id', async function(req, res) {
  import('../utilities/helia.mjs').then(async ({ getIPFSContent}) => {
    const animalId = req.params.id;
    // call the smart contract to get the cids from the event trace
    try {
      let data = await trace(animalId);
    } catch(error) {
      res.status(504).send(error.error.reason)
    }
    const events = data[3]

    let cidArray = [];
    events.forEach(event => {
      const cid = event[1]
      cidArray.push(cid)
  });
  
      let eventArr = [];
      for (cid of cidArray) {
        try {
          const content = await getIPFSContent(cid)
        } catch(error) {
          res.status(504).send(error.error.reason)
        }
        eventArr.push(content)
      }
      // now, construct a new object containing all the data
      let obj = {
        type: data[0],
        breed: data[1],
        herdNumber: Number(data[2]._hex),
        trace: []
      };

      for (let i = 0; i < events.length; i++) {
        let traceObj = {
          address: data[3][i][0],
          timeStamp: Number(data[3][i].timestamp._hex),
          event: eventArr[i],
        };
        obj.trace.push(traceObj);
      }
      res.status(200).send(obj);
  });
});

module.exports = router;
