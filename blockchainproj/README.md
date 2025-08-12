# FoodChain Blockchain Project

A full-stack blockchain-based food supply chain tracking system.  
Built with React, Hardhat, Solidity, Express, and MySQL.

## Features

- User authentication (manufacturer, supplier, customer)
- Food item creation and state tracking on blockchain
- Role-based actions (advance/reject state)
- Item history and metadata
- Search and dashboard UI

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) server running locally
- [MetaMask](https://metamask.io/) browser extension
- [Wampserver](https://sourceforge.net/projects/wampserver/) local server host

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd blockchainproj
```

### 2. Install Dependencies

```sh
npm install vite
npm install -save-dev hardhat
```

### 3. Setup MySQL Database

- Create a database named `blockchain`.
- Create a table `users`:

```sql
CREATE DATABASE blockchain;
USE blockchain;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Customer', 'Manufacturer', 'Supplier') NOT NULL
);
```

- Update MySQL credentials in [`server.js`](server.js) if needed.

### 4. Compile and Deploy Smart Contracts

```sh
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

- Copy the deployed contract address and set it in a `.env` file:

```
VITE_ADDRESS_KEY=<deployed_contract_address>
```

### 5. Start the Backend Server

```sh
node server.js
```

- Runs on [http://localhost:8080](http://localhost:8080)

### 6. Start the Frontend

```sh
npm run dev
```

- Runs on [http://localhost:5173](http://localhost:5173)

### 7. Access the App

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Register and log in with a role.
- Use MetaMask for blockchain interactions.

## Project Structure

- `contracts/` — Solidity smart contracts
- `src/` — React frontend
- `server.js` — Express backend (auth)
- `scripts/` — Hardhat deployment scripts
- `artifacts/` — Compiled contract ABIs
- `test/` — Hardhat tests

## Troubleshooting

- Ensure Wampserver is turned on.
- Ensure MySQL is running and credentials are correct.
- Make sure MetaMask is connected to the correct local network.
- If you redeploy contracts, update the address in `.env`.

