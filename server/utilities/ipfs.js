const { create } = require('@web3-storage/w3up-client')
 
const client = create()

// first time setup!
async function setUpIPFS() {
    if (!Object.keys(client.accounts()).length) {
  // waits for you to click the link in your email to verify your identity
  const account = await client.login('ukushi01@gmail.com')
  // create a space for your uploads
  const space = await client.createSpace('HalalTrace')
  // save the space to the store, and set as "current"
  await space.save()
  // associate this space with your account
  await account.provision(space.did())
}
}

module.exports = setUpIPFS;