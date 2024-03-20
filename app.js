import express from 'express';
import { ethers } from 'ethers';
import fs from 'fs';
import { sendSponsoredTransaction } from './biconomySmartAccount.js';

// Read the JSON ABI file
const jsonFile = fs.readFileSync('./artifacts/contracts/MyToken.sol/MyToken.json');
const contractData = JSON.parse(jsonFile);
const abi = contractData.abi;
const bytecode = contractData.bytecode;

// Use the ABI as needed
console.log("ABI:", abi);
const app = express();
const PORT = process.env.PORT || 3000;

// Function to check if private key is provided
function checkPrivateKey() {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Private key not provided.');
    }
    return privateKey;
}

// Common function to interact with contract using ethers
async function getContract(contractAddress) {
    const contract = new ethers.Contract(contractAddress, abi);
    return contract;
}

// Common function to interact with contract using ethers
async function getContractForWallet(contractAddress) {
    const privateKey = checkPrivateKey();
    console.log("Private key:", privateKey);

    const rpcUrl = "https://rpc.ankr.com/polygon_mumbai";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    console.log("Provider object:", provider);

    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Wallet object:", wallet);

    const contract = new ethers.Contract(contractAddress, abi, wallet);
    console.log("Contract object:", contract);

    return contract;
}

// Middleware to parse JSON bodies
app.use(express.json());

// Send endpoint
app.post('/biconomy/send', (req, res) => {
  const { to, value } = req.body;
  const transaction = {
    to: to,
    value: value,
  };
  sendSponsoredTransaction(transaction)
    .then(() => {
      res.status(200).json({ message: 'Transaction sent successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Biconomy deploy endpoint
app.post('/biconomy/deploy', async (req, res) => {
    try {
        console.log("Received request to deploy contract, req body:", req.body);

        const { defaultAdmin, minter } = req.body;

        // Encode constructor parameters
        const abiCoder = new ethers.AbiCoder();
        const constructorArgs = abiCoder.encode(['address', 'address'], [defaultAdmin, minter]);

        console.log("constructorArgs:", constructorArgs.slice(2))
        
        // Combine bytecode and constructor arguments
        const bytecodeWithArgs = bytecode + constructorArgs.slice(2); // Remove '0x' prefix

        // Build the transaction object for deployment
        const tx = {
            to: "0x0000000000000000000000000000000000000000", // Use zero address for deployment
            data: bytecodeWithArgs, // Use the combined bytecode with constructor arguments
        };
        console.log("tx:", tx);

        // Send transaction using Biconomy
        //await sendSponsoredTransaction(tx);

        res.status(200).json({ message: 'Contract deployed successfully.' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});
  
// Biconomy mint endpoint
app.post('/biconomy/mint', async (req, res) => {
    try {
        console.log("Received request to mint tokens, req body:", req.body);

        const { contractAddress, to, amount } = req.body;
        const contract = await getContract(contractAddress);

        // Create the transaction data
        const iface = new ethers.Interface(abi);
        const transactionData = iface.encodeFunctionData('mint', [to, amount]);

        if (!transactionData) {
            throw new Error('Failed to encode transaction data.');
        }

        console.log("Transaction data:", transactionData);

        // Build the transaction object
        const tx = {
            to: contractAddress,
            data: transactionData,
        };

        console.log("Transaction object:", tx);

        // Send transaction using Biconomy
        await sendSponsoredTransaction(tx);

        res.status(200).json({ message: 'Tokens minted successfully.' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});
// Biconomy burn endpoint
app.post('/biconomy/burn', async (req, res) => {
    try {
        console.log("Received request to burn tokens, req body:", req.body);

        const { contractAddress, amount } = req.body;
        const contract = await getContract(contractAddress);

        // Encode the data for the burn function
        const iface = new ethers.Interface(abi);
        const transactionData = iface.encodeFunctionData('burn', [amount]);

        if (!transactionData) {
            throw new Error('Failed to encode transaction data.');
        }

        console.log("Transaction data:", transactionData);

        // Build the transaction object
        const tx = {
            to: contract.address,
            data: transactionData,
        };

        console.log("Transaction object:", tx);

        // Send transaction using Biconomy
        await sendSponsoredTransaction(tx);

        res.status(200).json({ message: 'Tokens burned successfully.' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Biconomy transfer endpoint
app.post('/biconomy/transfer', async (req, res) => {
    try {
        console.log("Received request to transfer tokens, req body:", req.body);

        const { contractAddress, recipient, amount } = req.body;
        const contract = await getContract(contractAddress);

        // Encode the data for the transfer function
        const iface = new ethers.Interface(abi);
        const transactionData = iface.encodeFunctionData('transfer', [recipient, amount]);

        if (!transactionData) {
            throw new Error('Failed to encode transaction data.');
        }

        console.log("Transaction data:", transactionData);

        // Build the transaction object
        const tx = {
            to: contract.address,
            data: transactionData,
        };

        console.log("Transaction object:", tx);

        // Send transaction using Biconomy
        await sendSponsoredTransaction(tx);

        res.status(200).json({ message: 'Tokens transferred successfully.' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

  

// Deploy endpoint
app.post('/eoa/deploy', (req, res) => {
  // Add logic for deploying a contract
});

// Mint endpoint
app.post('/eoa/mint', (req, res) => {
  // Add logic for minting tokens
});

// Burn endpoint
app.post('/eoa/burn', (req, res) => {
  // Add logic for burning tokens
});

// Transfer endpoint
app.post('/eoa/transfer', (req, res) => {
  // Add logic for transferring tokens
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
