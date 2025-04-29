# HalalTrace

## Overview

**HalalTrace** is a proof-of-concept application for a blockchain-based traceability platform designed to ensure transparency and trust in halal meat supply chains. By leveraging distributed ledger technology, HalalTrace provides immutable records of each step in the supply chain - from farm to fork—ensuring compliance with halal standards and offering consumers verifiable information about their food sources.

## Project Structure

The repository is organized into the following main directories:

- **`client/`**: Contains the frontend application built with React.js and Vite, providing interfaces for users to interact with the system.
- **`server/`**: Houses the backend API developed using Node.js and Express, handling API, IPFS and smart contract interactions.
- **`contract/`**: Includes Ethereum smart contracts written in Solidity, defining the blockchain logic for traceability.
- **`docs/`**: Documentation and resources related to the project.
- **`.github/workflows/`**: GitHub Actions workflows for continuous integration and deployment.

## Getting Started

Follow these instructions to set up and run HalalTrace on your local machine.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**: [Install Git](https://git-scm.com/downloads)

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ukush/HalalTrace.git
   cd HalalTrace
   ```

2. **Set Up the Backend**

   Navigate to the `server` directory and install dependencies:

   ```bash
   cd server
   npm install
   ```
       
   - **Configure Environment Variables**
   
  - There are a number of environment variable which need to be configured before being able to run the application:

    *Create a `.env` file inside the `server/` directory and define the following variables:*

    - AMOY_API: Get this from alchemy or another provider
    - DEPLOYED_ADD: 0xaeEC1ED370c2a289729793ECb622C27A993Ce425
    - PRIVATE_KEY: Your wallet (metamask) private key

4. **Set Up the Frontend**

   Open a new terminal window, navigate to the `client` directory, and install dependencies:

   ```bash
   cd client
   npm install
   ```

5. **Set Up the Smart Contracts**

   Navigate to the `contract` directory:

   ```bash
   cd contract
   ```

   Install dependencies for smart contract interactions including Hardhat, ethers and slither:

   ```bash
   npm install --save-dev hardhat
   ```

   Install contract dependencies:

   ```bash
   npm install
   ```

   The application is already configured to use the NFTTracker.sol contract which has already been deployed to the following address:
   "0xaeEC1ED370c2a289729793ECb622C27A993Ce425"

  - **Configure Environment Variables**
  
  - There are a number of environment variable which need to be configured before being able to run the application:
  
  *Create a `.env` file inside the `contract/` directory and define the following variables:*

  - AMOY_API: Get this from alchemy or another provider
  - CONTRACT_SIZER=true
  - GAS_REPORTER=true
   

6. **Run the Application**

   - **Start the Backend Server**

     In the `server` directory:

     ```bash
     npm start
     ```

   - **Start the Frontend Application**

     In the `client` directory:
  
     Install dependencies
  
        ```bash
     npm install
     ```
  
     And run the application

     ```bash
     npm run dev
     ```

   The frontend should now be running at `http://localhost:5173`, and the backend API at `http://localhost:3000` by default.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to your forked repository:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request detailing your changes.


## Acknowledgments

- Inspired by the need for transparency in halal food supply chains.
- Utilises technologies like Ethereum, React.js, and Node.js to provide a proof-of-concept solution.

---

For more information, visit the [HalalTrace GitHub Repository](https://github.com/ukush/HalalTrace).

--- 
