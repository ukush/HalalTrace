import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmZDExNDBhZS00MWMzLTQ5YjQtODIzOC1lYzU1OTkyMDFjNmMiLCJlbWFpbCI6ImNpamN6Mm1lM3JAcmZjZHJpdmUuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZhNmZhOGVjNWNmOWFmNmE3ZDQyIiwic2NvcGVkS2V5U2VjcmV0IjoiOWIzOWE3ZDRiZjE3ZjgwNjc3YWNlN2I3OGFlZDA1NGQxMzMzMTQ1NWE4N2I4M2IxYWRhMjg3ZDY4NzEzNzllMiIsImlhdCI6MTcxMzI3NTIxNn0.oo3ZotgXYPNDucVYlbO1qNRdzAdqOLZi8v3nT2aGvTA"

async function uploadAndPin(data) {
  try {
   const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    console.log(await res.data);
  } catch (error) {
    console.log(error);
  }
}

export default uploadAndPin;