import { useState, useCallback } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, keccak256, toHex } from 'viem';

// Clanker Factory on Base
const CLANKER_FACTORY = "0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb";

const CLANKER_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "initialSupply", "type": "uint256" },
      { "internalType": "bytes32", "name": "salt", "type": "bytes32" }
    ],
    "name": "deployToken",
    "outputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "bytes32", "name": "salt", "type": "bytes32" }
    ],
    "name": "predictToken",
    "outputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const useClanker = (name: string, symbol: string) => {
  const [salt, setSalt] = useState<`0x${string}`>(keccak256(toHex(Date.now())));
  
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Function to generate a new salt (for "mining" addresses conceptually)
  const rotateSalt = useCallback(() => {
    setSalt(keccak256(toHex(Date.now() + Math.random())));
  }, []);

  const deploy = async (name: string, symbol: string, supply: string) => {
    try {
      writeContract({
        address: CLANKER_FACTORY,
        abi: CLANKER_ABI,
        functionName: 'deployToken',
        args: [name, symbol, parseEther(supply), salt],
        value: parseEther("0.01"), 
      });
    } catch (e) {
      console.error("Deploy failed", e);
    }
  };

  // Predict Address
  const { data: predictedAddress } = useReadContract({
    address: CLANKER_FACTORY,
    abi: CLANKER_ABI,
    functionName: 'predictToken',
    args: [name, symbol, salt],
    query: {
      enabled: !!name && !!symbol,
    }
  });

  return {
    deploy,
    rotateSalt,
    salt,
    predictedAddress,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError
  };
};