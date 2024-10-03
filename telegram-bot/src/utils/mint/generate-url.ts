import { serverConfig } from "../../config/server";

interface mintUrlType {
  botName: string;
  chainId: number;
  address: string;
  uid: string;
}

export function generateMintUrl({
  botName,
  chainId,
  address,
  uid,
}: mintUrlType) {
  const txType = "mint";
  const callbackUrl = `${serverConfig.callbackBaseUrl}/api/transaction-callback`;
  const sourceUrl = `${serverConfig.sourceBaseUrl}/api/transaction/${uid}?txType=${txType}&chainId=${chainId}&address=${address}`;

  return `${
    serverConfig.web3BridgeBaseUrl
  }/?botName=${botName}&type=${txType}&uid=${uid}&source=${encodeURIComponent(
    sourceUrl
  )}&callback=${encodeURIComponent(callbackUrl)}`;
}
