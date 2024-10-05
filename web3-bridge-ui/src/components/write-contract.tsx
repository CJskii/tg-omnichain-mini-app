import { useEffect } from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useSwitchChain,
  useReadContract,
} from "wagmi";
import { parseAbi } from "viem";
import { useState } from "react";

import { Button } from "./ui/button";
import { Typography } from "./ui/typography";

export interface WriteContractData {
  chainId: number;
  address: `0x{string}`;
  abi: string[];
  functionName: string;
  args: any[];
}

type WriteContractProps = WriteContractData & {
  uid: string;
  sendEvent: (event: any) => void;
  endpointType: string;
};

export function WriteContract(data: WriteContractProps) {
  const { sendEvent, endpointType, uid } = data;
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { switchChain } = useSwitchChain();

  const [fee, setFee] = useState<string | undefined>();

  const account = useAccount();

  if (endpointType === "mint") {
    const feeAbi = ["function fee() view returns (uint256)"];

    const { data: mintData } = useReadContract({
      address: data.address,
      abi: parseAbi(feeAbi),
      functionName: "fee",
      chainId: data.chainId,
    });

    useEffect(() => {
      if (mintData) {
        setFee(mintData.toString());
      }
    }, [mintData]);
  }

  if (endpointType === "bridge") {
    const feeAbi = [
      "function estimateSendFee(uint16 _dstChainId, bytes _toAddress, uint256 _tokenId, bool _useZro, bytes _adapterParams) external view returns (uint256 nativeFee, uint256 zroFee)",
    ];

    const { data: estimateSendFee }: { data: [BigInt, BigInt] | undefined } =
      useReadContract({
        address: data.address,
        abi: parseAbi(feeAbi),
        functionName: "estimateSendFee",
        args: [
          data.args[1], // _dstChainId
          data.args[2], // _toAddress
          data.args[3], // _tokenId
          false, // _useZro
          data.args[6], // _adapterParams
        ],
        chainId: data.chainId,
      });

    useEffect(() => {
      if (estimateSendFee) {
        setFee(estimateSendFee?.[0].toString());
      }
    }, [estimateSendFee]);
  }

  const isCorrectChain = account?.chainId === data.chainId;

  async function submitTransaction() {
    writeContract({
      address: data.address,
      abi: parseAbi(data.abi),
      functionName: data.functionName,
      args: data.args,
      chainId: data.chainId,
      value: fee ? BigInt(fee) : undefined,
    });
  }

  async function requestSwitch(chainId: number) {
    switchChain({ chainId });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      return sendEvent({ confirmed: true });
    }
    if (hash) {
      //TODO: Triggering twice?
      return sendEvent({ hash });
    }
    if (error) {
      return sendEvent({ error });
    }
  }, [hash, error, isConfirmed]);

  const StatusPanel = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        {hash && <Typography>Transaction Hash: {hash}</Typography>}
        {isConfirming && <Typography>Waiting for confirmation...</Typography>}
        {isConfirmed && <Typography>Transaction confirmed.</Typography>}
        {error && (
          <>
            <Typography className="text-destructive text-center">
              Error: {(error as BaseError).shortMessage || error.message}
            </Typography>
            <Typography variant={"small"} className="text-center p-2">
              Please try again.
            </Typography>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Button
        className="transcationButton"
        disabled={isPending}
        onClick={
          isCorrectChain ? submitTransaction : () => requestSwitch(data.chainId)
        }
      >
        {isPending
          ? "Confirming..."
          : isCorrectChain
          ? "Confirm"
          : "Switch Chain"}
      </Button>
      {(hash || isConfirming || isConfirmed || error) && <StatusPanel />}
    </>
  );
}
