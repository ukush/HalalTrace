// Custom error class for IPFS related errors
class IPFSError extends Error {
    constructor(message) {
      super(message);
      this.name = 'IPFSError';
    }
  }
  
  // Custom error class for trace function related errors
class TraceError extends Error {
    constructor(message) {
      super(message);
      this.name = 'TraceError';
    }
  }

    // Custom error class for trace function related errors
class MintTokenError extends Error {
    constructor(message) {
      super(message);
      this.name = 'TraceError';
    }
  }
  
  

  module.exports = { TraceError, IPFSError, MintTokenError };
