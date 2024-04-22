import { createHelia } from 'helia'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { json } from '@helia/json';
import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { bootstrap } from '@libp2p/bootstrap'
import { CID } from 'multiformats/cid'
import { IPFSError } from './exceptions/exceptions.js';

const blockstore = new MemoryBlockstore()
const datastore = new MemoryDatastore()

async function createNode() {

const libp2p = await createLibp2p({
    transports: [
        webSockets()
      ],
      connectionEncryption: [
        noise()
      ],
      streamMuxers: [
        yamux()
      ],
      peerDiscovery: [
        bootstrap({
          list: [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
          ]
        })
      ],
})

return await createHelia({
    datastore,
    blockstore,
    libp2p
  })
}

const heliaNode = await createNode()
const jsonHelia = json(heliaNode)

const addToIPFS = async (data) => {
    try {
        const cid = await jsonHelia.add(data)
        return cid.toString();
    } catch (error) {
      throw IPFSError('Error adding file to IPFS:', error);
  }
}

const getIPFSContent = async (uriString, timeout) => {
  // when attempting to get content using a cid not pinned by helia, it never resolves
  // therefore set a timeout of 3 seconds, after which throw an error
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => {
      reject(new IPFSError('Request timed out')); // Reject the promise with the IPFSError object
    }, timeout);

    const j = json(heliaNode)
    const cid = CID.parse(uriString)
    
    j.get(cid)
      .then((obj) => {
        clearTimeout(timerId);
        resolve(JSON.stringify(obj));
      })
      .catch((error) => {
        clearTimeout(timerId);
        reject(error);
      });
  });
};

export { addToIPFS, getIPFSContent }