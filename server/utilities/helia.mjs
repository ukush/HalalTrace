import { createHelia } from 'helia'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { json } from '@helia/json';
import { createLibp2p } from 'libp2p';
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { bootstrap } from '@libp2p/bootstrap'

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

const addToIPFS = async (data) => {
    try {
        const heliaNode = await createNode()
        const jsonHelia = json(heliaNode)
        const cid = await jsonHelia.add(data)
        console.log('Added file:', cid.toString());
        return cid.toString();

    } catch (error) {
    console.error('Error adding file to IPFS:', error);
    throw error;
  }
}

const getIPFSContent = async (cid) => {
    const data = await jsonHelia.get(cid)
    console.log(`Data at ${cid}: ${data}`);
    return data
}

export { addToIPFS, getIPFSContent }