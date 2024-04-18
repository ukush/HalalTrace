async function payUser (amount){

    //connect to metamask
    const { ethereum } = window;
  
    //if ethereum is not found, it means that a user does not  
   //have metamask installed on their browser
    if (!ethereum) {
      return;
    }
  
    //Get wallet provider and signer
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
  
    //contract initialization: create an instance of the //contract
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
  
    //Interact with the contract using appropriate methods
    const transaction = await 
    contractInstance.pay(ethers.utils.parseEther(amount))
  
  }