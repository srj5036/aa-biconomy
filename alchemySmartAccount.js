import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, polygonMumbai,} from "@alchemy/aa-core";

import { config as dotenvConfig } from 'dotenv';
import MyToken from "./artifacts/contracts/MyToken.sol/MyToken.json" assert {type :"json"}
import { ethers, TransactionReceipt } from "ethers";

dotenvConfig(); // Load environment variables from .env file

const chain = polygonMumbai
const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${process.env.PRIVATE_KEY}`);

// Create a smart account client to send user operations from your smart account
const client = await createModularAccountAlchemyClient({
  // get your Alchemy API key at https://dashboard.alchemy.com
  apiKey: process.env.ALCHMEY_KEY,
  chain,
  signer,
  gasManagerConfig:{
    policyId:process.env.ALCHEMY_GAS_POLICY
  }
});

console.log(client.getAddress())

export async function sendTransaction(contractAddress, uoCallData) {
    try {

        // Build UserOperation Object
        const uop = await client.buildUserOperation({
            uo:{
                target:contractAddress,
                data:uoCallData,
            }
        })

        // Sign UserOperation Object
        const signedUop = await client.signUserOperation({uoStruct:uop})

        // Send UserOperation Object    
        const {hash} = await client.sendUserOperation({uo:signedUop.callData})  

        console.log({hash})
        //const a = await client.waitForUserOperationTransaction()
        //Deploy contract
        const txHash = await client.waitForUserOperationTransaction({hash:hash});
        console.log({txHash});
        await client.getUserOperationReceipt(hash)
        const receipt = await client.waitForTransactionReceipt({hash:txHash, confirmations:2});
        console.log({receipt});
        //const receipt  = await client.getTransactionReceipt({hash:txHash})       
         return txHash;
        
    } catch (error) {
        throw error
    }
}
