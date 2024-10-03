import { serverConfig } from "../../config/server";

interface approveTransaction {
  chainId: number;
  address: string;
  spenderAddress: string;
}

export function generateApproveTransactionJson({
  chainId,
  address,
  spenderAddress,
}: approveTransaction) {
  return {
    chainId: chainId,
    address: address,
    abi: ["function approve(address spender, uint256 value)"],
    functionName: "approve",
    args: [spenderAddress, "456"],
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
