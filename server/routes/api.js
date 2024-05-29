var express = require('express');
var router = express.Router();
const { mintAnimal } = require('../utilities/contractInteractions/AnimalContract.js');
const { mintPart } = require('../utilities/contractInteractions/AnimalPartContract.js');
const { mintProduct } = require('../utilities/contractInteractions/AnimalProductContract.js');
const { update } = require('../utilities/contractInteractions/update.js')
const {TraceError, IPFSError, MintTokenError} = require('../utilities/exceptions/exceptions.js')

//----------------------- Mint NFT Endpoint --------------------------//

router.post('/nft/animal/mint/:id', async function(req, res) {
  const data = req.body
  // Pass the body to the function that calls the smart contract mint function
  try {
    await mintAnimal(data.animalId, data.animalType, data.animalBreed, data.herdNumber);
    res.sendStatus(200);
  }catch (error) {
    if (error instanceof MintTokenError) {
      res.status(502).send(error.message);
    } else res.status(500).send(error)
  }
})

router.post('/nft/part/mint/:id', async function(req, res) {
  const data = req.body
  // Pass the body to the function that calls the smart contract mint function
  try {
    await mintPart(data.animalId, data.partName);
    res.sendStatus(200);
  }catch (error) {
    if (error instanceof MintTokenError) {
      res.status(502).send(error.message);
    } else res.status(500).send(error)
  }
})

router.post('/nft/product/mint/:id', async function(req, res) {
  const data = req.body
  // Pass the body to the function that calls the smart contract mint function
  try {
    await mintProduct(data.partIds, data.productName);
    res.sendStatus(200);
  }catch (error) {
    if (error instanceof MintTokenError) {
      res.status(502).send(error.message);
    } else res.status(500).send(error)
  }
})

// //----------------------- Update Trace Endpoint --------------------------//

router.post('/nft/event/:type/:id', async function(req, res) {
    console.log("endpoint getting hit")
    const nftType = req.params.type;
    const animalId = req.params.id;
    data = req.body;
    import('../utilities/helia.mjs').then(async ({ addToIPFS}) => {
      try {
      // store data on ipfs
      const cid = await addToIPFS(data)
      // interact with smart contract to update the trace

      // todo - pass in the nft type so that it can call the correct contract function
      await update(nftType, animalId, cid)
      
      res.sendStatus(200);
    } catch(error) {
      if (error instanceof TraceError) {
        // means there was an error with the smart contract - send the error to front end
        res.status(502).send(error.message)
      } else (res.status(500).send(error)) // some error with IPFS
    }
    })
  });


// router.get('/nft/events/:type/:id', async function(req, res) {
//   import('../utilities/helia.mjs').then(async ({ getIPFSContent}) => {
//     const nftType = req.params.type;
//     const animalId = req.params.id;
//     // call the smart contract to get the cids from the event trace
    
//     // todo
//     // pass in the nft type so that it can call the correct contract
//     try {
//       let data = await traceAnimal(animalId);
//       const events = data[3]
//       let cidArray = [];
//       events.forEach(event => {
//         const cid = event[1]
//         cidArray.push(cid)
//       });
  
//       let eventArr = [];
//       for (cid of cidArray) {
//         try {
//           const content = await getIPFSContent(cid, 5000);
//           eventArr.push(content);
//         } catch(error) {
//           if (error instanceof IPFSError) {
//             throw error
//           }
//         }
//       }
//       // now, construct a new object containing all the data
//       let obj = {
//         type: data[0],
//         breed: data[1],
//         herdNumber: Number(data[2]._hex),
//         trace: []
//       };

//       for (let i = 0; i < events.length; i++) {
//         let traceObj = {
//           address: data[3][i][0],
//           timeStamp: Number(data[3][i].timestamp._hex),
//           event: eventArr[i],
//         };
//         obj.trace.push(traceObj);
//       }
      
//       res.status(200).send(obj);

//     } catch(error) {
//       if (error instanceof TraceError) {
//         res.status(502).send(error.message)
//       } else if (error instanceof IPFSError) {
//         res.status(504).send(error.message)
//       }
//     }
//   });
// });

module.exports = router;