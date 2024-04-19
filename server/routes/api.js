var express = require('express');
var router = express.Router();
const { mint, update, trace } = require('../utilities/contractInteraction.js');
const { BigNumber } = require("ethers");

router.post('/nft/mint/:id', async function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  const data = req.body
  console.log(`request object: ${JSON.stringify(data)}`)

  // Pass the body to the function that calls the smart contract mint function
  await mint(data.animalId, data.animalType, data.animalBreed, data.herdNumber);

  res.sendStatus(200);

})


router.get('/nft/events/:id', async function(req, res) {
  import('../utilities/helia.mjs').then(async ({ getIPFSContent}) => {
    const animalId = req.params.id;
    // call the smart contract to get the cids from the event trace
    let data = await trace(animalId);
    const events = data[3]

    let cidArray = [];
    events.forEach(event => {
      const cid = event[1]
      cidArray.push(cid)
  });
  
      let eventArr = [];
      for (cid of cidArray) {
        const content = await getIPFSContent(cid)
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
          // Assuming the last element is always the last element of the array
          address: data[3][i][0],
          timeStamp: Number(data[3][i].timestamp._hex),
          event: eventArr[i],
        };
        obj.trace.push(traceObj);
      }

  //     console.log(obj)

      // const tempObj = {
      //   type: 'cattle',
      //   breed: 'angus',
      //   herdNumber: 1234,
      //   trace: [
      //     {
      //       address: '0x892D8dF4897f7126706946ec58aA2B7BE1F36573',
      //       timeStamp: 1713536709,
      //       event: '{"animalId":"20","weight":"2","age":"2","lastHealthCheckDate":"","lastHealthCheckResult":"medicine vaccine","feedType":"organic"}'
      //     },
      //     {
      //       address: '0x892D8dF4897f7126706946ec58aA2B7BE1F36573',
      //       timeStamp: 1713536709,
      //       event: '{"animalId":"20","weight":"2","age":"2","lastHealthCheckDate":"","lastHealthCheckResult":"medicine vaccine","feedType":"organic"}'
      //     }
      //   ]
      // }
      res.status(200).send(obj);
  });
});

router.post('/nft/events/:id', async function(req, res) {
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
//   const animalId = req.params.id;
//   data = req.body;
//   // store data on ipfs
//   import('../utilities/helia.mjs').then(async ({ addToIPFS}) => {
//   const cid = await addToIPFS(data)
//   await update(animalId, cid)
//   res.sendStatus(200);
//   })
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
