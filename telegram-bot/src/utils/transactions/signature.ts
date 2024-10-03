import { serverConfig } from "../../config/server";

interface signatureTransaction {
  domainName: string;
  chainId: number;
  verifyingContract: string;
  owner: string;
  spender: string;
  value: string;
  nonce: number;
  deadline: string;
}

export function generateSignatureTransactionJson({
  domainName,
  chainId,
  verifyingContract,
  owner,
  spender,
  value,
  nonce,
  deadline,
}: signatureTransaction) {
  return {
    domain: {
      name: domainName,
      version: "1",
      chainId: chainId,
      verifyingContract: verifyingContract,
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
      owner: owner,
      spender: spender,
      value: value,
      nonce: nonce,
      deadline: deadline,
    },
  };
}

interface signatureUrlType {
  botName: string;
  uid: string;
  txType: string;
}

export function generateSignatureUrl({
  botName,
  uid,
  txType,
}: signatureUrlType) {
  const callbackUrl = `${serverConfig.callbackBaseUrl}/api/transaction-callback`;
  const sourceUrl = `${serverConfig.sourceBaseUrl}/api/transaction/signature/${uid}?txType=${txType}`;

  return `${
    serverConfig.web3BridgeBaseUrl
  }/?botName=${botName}&type=${txType}&uid=${uid}&source=${encodeURIComponent(
    sourceUrl
  )}&callback=${encodeURIComponent(callbackUrl)}`;
}
