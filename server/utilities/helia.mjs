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
    console.error('Error adding file to IPFS:', error);
    throw error;
  }
}

const getIPFSContent = async () => {
    //console.log("you triggered the get function!")
    const j = json(heliaNode)
    const cid = CID.parse('bagaaiera2g6zbgowenom4jzsrfffibsevo5shx6ow3phvggvho76k3j7zz2q')
    //console.log(cid)
    const obj = await j.get(cid)
    console.info(`Data at ${cid}: ${JSON.stringify(obj)}`)
    return JSON.stringify(obj)
}

export { addToIPFS, getIPFSContent }