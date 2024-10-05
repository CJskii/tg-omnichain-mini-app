import { serverConfig } from "../../config/server";
import { ethers } from "ethers";

interface bridgeTransaction {
  chainId: number;
  address: string;
  ownerAddress: string;
  remoteChainId: number;
  tokenId: string;
}

export function generateBridgeTransactionJson({
  chainId,
  address,
  ownerAddress,
  remoteChainId,
  tokenId,
}: bridgeTransaction) {
  const adapterParams = ethers.utils.solidityPack(
    ["uint16", "uint256"],
    [1, 400000]
  );
  return {
    chainId: chainId,
    address: address,
    abi: [
      "function sendFrom(address _from, uint16 _dstChainId, bytes memory _toAddress, uint _tokenId, address payable _refundAddress, address _zroPaymentAddress, bytes memory _adapterParams) public payable virtual override",
    ],
    functionName: "sendFrom",
    args: [
      ownerAddress, // _from address
      remoteChainId, // _dstChainId
      ownerAddress, // _toAddress
      tokenId, // _tokenId
      ownerAddress, // _refundAddress
      ethers.constants.AddressZero, // _zroPaymentAddress - address(0x0) if not paying in ZRO (LayerZero Token)
      adapterParams, // _adapterParams - flexible bytes array to indicate messaging adapter services
    ],
  };
}

interface bridgeUrlType {
  botName: string;
  sourceChainId: number;
  targetChainId: number;
  contractAddress: string;
  ownerAddress: string;
  tokenId: string;
  uid: string;
  txType: string;
}

export function generateBridgeUrl({
  botName,
  sourceChainId,
  targetChainId,
  contractAddress,
  ownerAddress,
  tokenId,
  uid,
  txType,
}: bridgeUrlType) {
  const action = "bridge";
  const callbackUrl = `${serverConfig.callbackBaseUrl}/api/transaction-callback`;
  const sourceUrl = `${serverConfig.sourceBaseUrl}/api/transaction/bridge/${uid}?chainId=${sourceChainId}&address=${contractAddress}&ownerAddress=${ownerAddress}&remoteChainId=${targetChainId}&tokenId=${tokenId}`;

  return `${
    serverConfig.web3BridgeBaseUrl
  }/?botName=${botName}&txType=${txType}&uid=${uid}&action=${action}&source=${encodeURIComponent(
    sourceUrl
  )}&callback=${encodeURIComponent(callbackUrl)}`;
}
