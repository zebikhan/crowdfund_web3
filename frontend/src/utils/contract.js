import ABI from '../../../smart-contracts/artifacts/contracts/CrowdFundDirectMetadata.sol/CrowdFundDirectMetadata.json'
import { ethers } from 'ethers'
import { getSigner } from '../composables/wallet'

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS 
   || '0x5FbDB2315678afecb367f032d93F642f64180aa3' 

 console.log("Using contract address:", CONTRACT_ADDRESS)
 
 //read-only contract (no MetaMask required)
export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_READ || 'http://127.0.0.1:8545')
  return new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, provider)
}

// write contract (requires MetaMask signer)
export async function getWriteContract() {
  const signer =  getSigner()
  if (!signer) throw new Error('Wallet not connected')
  return new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer)
}
