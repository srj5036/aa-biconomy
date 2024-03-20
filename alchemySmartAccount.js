import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, polygonMumbai,} from "@alchemy/aa-core";

import { config as dotenvConfig } from 'dotenv';
import MyToken from "./artifacts/contracts/MyToken.sol/MyToken.json" assert {type :"json"}
import { encodeAbiParameters,encodeFunctionData } from "viem";
import { Contract } from "ethers";
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
    policyId:"6f0769c7-fcea-4b79-9de4-45e9991b94d9"
  }
});

export async function mint(transaction){
    try {
        console.log("in mint alchemy")
        const tokenAddress = "0xd9b9Dbe4b351488Cc25b307BF360770e1096F00E"

        const abi = MyToken.abi;
        
        const uoCallData = encodeFunctionData({
            abi,
            functionName:"mint",
            args:[transaction.to, 100**18]
        } )

        const uop = await client.buildUserOperation({
            uo:{
                target:tokenAddress,
                data:uoCallData,
            }
        })

        const signedUop = await client.signUserOperation({uoStruct:uop})
        
        const {hash} = await client.sendUserOperation({uo:signedUop.callData})  

        console.log({hash})

        //Deploy contract
        const txHash = await client.waitForUserOperationTransaction({hash:hash});
        console.log(txHash);
        
    } catch (error) {
        throw error
    }
}

// (async () => {
//   // Fund your account address with ETH to send for the user operations
//   console.log("Smart Account Address: ", client.getAddress()); // Log the smart account address
//   const param1 = client.getAddress(); // Example parameter
//   const param2 = client.getAddress(); // Example parameter
  
//   const encodedParams = encodeAbiParameters([{
//     name:"defaultAdmin",
//     type: "address"
//   },{
//      name:"minter",
//      type: "address"
//   }],[client.getAddress(),client.getAddress()])
//   console.log({encodedParams})
//   const bytecodeWithParams = MyToken.bytecode + encodedParams.substring(2);

//   const elligibility = await client.checkGasSponsorshipEligibility({
//   target: "0x0000000000000000000000000000000000000000",
//   data: bytecodeWithParams,
//   value: 0n, // value in bigint or leave undefined
// });

// console.log(
//   `User Operation is ${
//     elligibility ? "eligible" : "ineligible"
//   } for gas sponsorship`
// );

// const uop = await client.buildUserOperation({
//     uo:{
//         target:"0x0000000000000000000000000000000000000000",
//         data:bytecodeWithParams,
//         value:0n
//     }
// })

// const signedUop = await client.signUserOperation({uoStruct:uop})
//   const {hash} = await client.sendUserOperation({uo:signedUop.callData})  

//   console.log({hash})

//   //Deploy contract
//   const txHash = await client.waitForUserOperationTransaction({hash:hash});
//   console.log(txHash);
// })();