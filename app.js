import express from 'express';
import { sendSponsoredTransaction } from './biconomySmartAccount.js';
import {mint} from "./alchemySmartAccount.js"
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Send endpoint
app.post('/send', (req, res) => {
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

// Deploy endpoint
app.post('/deploy', (req, res) => {
  // Add logic for deploying a contract
});

// Mint endpoint
app.post('/mint', (req, res) => {
  // Add logic for minting tokens
});

// Burn endpoint
app.post('/burn', (req, res) => {
  // Add logic for burning tokens
});

// Transfer endpoint
app.post('/transfer', (req, res) => {
  // Add logic for transferring tokens
});

app.post('/mintAlchemy', (req,res)=>{
  const transaction = {
    to: req.body.to,
    value: req.body.value,
  };
  mint(transaction)
    .then(() => {
      res.status(200).json({ message: 'Transaction sent successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
})
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
