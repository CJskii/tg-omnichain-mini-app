import { useEffect } from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useSwitchChain,
} from "wagmi";
import { parseAbi } from "viem";

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
};

export function WriteContract(data: WriteContractProps) {
  const { sendEvent } = data;
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { switchChain } = useSwitchChain();

  const account = useAccount();

  const isCorrectChain = account?.chainId === data.chainId;

  async function submitTransaction() {
    writeContract({
      address: data.address,
      abi: parseAbi(data.abi),
      functionName: data.functionName,
      args: data.args,
      chainId: data.chainId,
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
