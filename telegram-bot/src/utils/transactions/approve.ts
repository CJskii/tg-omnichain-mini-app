import { serverConfig } from "../../config/server";

interface approveTransaction {
  chainId: number;
  address: string;
  spenderAddress: string;
}

// TODO: Make chainId, address, and spenderAddress required fields
// TODO: Request with default values from telegram web app UI

export function generateApproveTransactionJson({
  chainId,
  address,
  spenderAddress,
}: approveTransaction) {
  return {
    chainId: chainId || "324",
    address: address || "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
    abi: ["function approve(address spender, uint256 value)"],
    functionName: "approve",
    args: [
      spenderAddress || "0x4a89caAE3daf3Ec08823479dD2389cE34f0E6c96",
      "456",
    ],
  };
}

interface approveUrlType {
  botName: string;
  uid: string;
  txType: string;
}

export function generateApproveUrl({ botName, uid, txType }: approveUrlType) {
  const callbackUrl = `${serverConfig.callbackBaseUrl}/api/transaction-callback`;
  const sourceUrl = `${serverConfig.sourceBaseUrl}/api/transaction/approve/${uid}?txType=${txType}`;

  return `${
    serverConfig.web3BridgeBaseUrl
  }/?botName=${botName}&type=${txType}&uid=${uid}&source=${encodeURIComponent(
    sourceUrl
  )}&callback=${encodeURIComponent(callbackUrl)}`;
}
