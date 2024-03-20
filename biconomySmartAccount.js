import { ethers } from "ethers";
import { createSmartAccountClient, PaymasterMode, createPaymaster } from "@biconomy/account";
import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // Load environment variables from .env file

// Your configuration with private key and Biconomy API key
const config = {
  privateKey: process.env.PRIVATE_KEY,
  biconomyPaymasterUrl: process.env.PAYMASTER_URL,
  bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44", 
  rpcUrl: "https://rpc.ankr.com/polygon_mumbai",
};

export async function sendSponsoredTransaction(transaction) {
  console.log("sendSponsoredTransaction, tx:", transaction)

  // Generate EOA from private key using ethers.js
  let provider = new ethers.JsonRpcProvider(config.rpcUrl);
  let signer = new ethers.Wallet(config.privateKey, provider);

  // Needs to use strict mode for some reason... so create a paymaster and pass it into createSmartAccountClient
  const paymaster = await createPaymaster({
    paymasterUrl: config.biconomyPaymasterUrl,
    strictMode: true
  });

  // Create Biconomy Smart Account instance
  const smartWallet = await createSmartAccountClient({
    signer,
    paymaster: paymaster,
    bundlerUrl: config.bundlerUrl,
  });

  const saAddress = await smartWallet.getAccountAddress();
  console.log("SA Address", saAddress);

  // Send the transaction and get the transaction hash
  const userOpResponse = await smartWallet.sendTransaction(transaction, {
    paymasterServiceData: {mode: PaymasterMode.SPONSORED},
  });
  const { transactionHash } = await userOpResponse.waitForTxHash();
  console.log("Transaction Hash", transactionHash);
  const userOpReceipt  = await userOpResponse.wait();
  if(userOpReceipt.success == 'true') {
    console.log("UserOp receipt", userOpReceipt)
    console.log("Transaction receipt", userOpReceipt.receipt)
  }
}
