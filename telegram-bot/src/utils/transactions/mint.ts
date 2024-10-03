import { serverConfig } from "../../config/server";

interface mintTransaction {
  chainId: number;
  address: string;
}

export function generateMintTransactionJson({
  chainId,
  address,
}: mintTransaction) {
  return {
    chainId: chainId,
    address: address,
    abi: ["function mint() external payable"],
    functionName: "mint",
    args: [], // msg.value ??
  };
}

interface mintUrlType {
  botName: string;
  chainId: number;
  address: string;
  uid: string;
  txType: string;
}

export function generateMintUrl({
  botName,
  chainId,
  address,
  uid,
  txType,
}: mintUrlType) {
  const callbackUrl = `${serverConfig.callbackBaseUrl}/api/transaction-callback`;
  const sourceUrl = `${serverConfig.sourceBaseUrl}/api/transaction/mint/${uid}?txType=${txType}&chainId=${chainId}&address=${address}`;

  return `${
    serverConfig.web3BridgeBaseUrl
  }/?botName=${botName}&type=${txType}&uid=${uid}&source=${encodeURIComponent(
    sourceUrl
  )}&callback=${encodeURIComponent(callbackUrl)}`;
}
