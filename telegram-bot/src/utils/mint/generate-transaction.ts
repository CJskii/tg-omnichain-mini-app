interface mintTransaction {
  chainId: number;
  address: string;
}

export function generateMintTransaction({ chainId, address }: mintTransaction) {
  return {
    chainId,
    address,
    abi: [
      {
        inputs: [],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "mint",
    args: [],
  };
}
