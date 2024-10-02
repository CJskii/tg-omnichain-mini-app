import { serverConfig } from "../config/server";

export function generateTransactionJson(txType: string, uid: string) {
  if (txType === "transaction") {
    return {
      chainId: 324,
      address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
      abi: ["function approve(address spender, uint256 value)"],
      functionName: "approve",
      args: ["0x4a89caAE3daf3Ec08823479dD2389cE34f0E6c96", "456"],
    };
  } else if (txType === "signature") {
    return {
      domain: {
        name: "Tether USD",
        version: "1",
        chainId: 324,
        verifyingContract: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
      },
      primaryType: "Permit",
      types: {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      message: {
        owner: "0xD0eA653E473d7a544268e0DCc7CE0a4F45133f4A",
        spender: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
        value: "12345",
        nonce: 5,
        deadline: "1916240884",
      },
    };
  }

  throw new Error("Invalid transaction type");
}

export function generateBridgeUrl(
  botName: string,
  txType: string,
  uid: string
) {
  const callbackUrl = `${serverConfig.callbackBaseUrl}/api/transaction-callback`;
  const sourceUrl = `${serverConfig.sourceBaseUrl}/api/transaction/${uid}?txType=${txType}`;

  return `${
    serverConfig.web3BridgeBaseUrl
  }/?botName=${botName}&type=${txType}&uid=${uid}&source=${encodeURIComponent(
    sourceUrl
  )}&callback=${encodeURIComponent(callbackUrl)}`;
}
