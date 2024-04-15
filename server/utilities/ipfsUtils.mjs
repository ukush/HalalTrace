
import { NFTStorage, File } from "nft.storage"
const API_KEY = process.env.NFT_STORAGE_API_KEY


async function storeData(animalId, data) {
 const client = new NFTStorage({token: "a31c4861.da23e57b3fce465cacc9474b62a7b75e"})
 const metadata = await client.store({
    name: animalId,
    description: "Add health record",
    attributes: data,
 })
 console.log(metadata)
}


export default storeData;
