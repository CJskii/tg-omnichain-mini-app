import { useEffect } from "react";
import {
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseAbi } from "viem";
import { Button } from "./ui/button";

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

  async function submit() {
    writeContract({
      address: data.address,
      abi: parseAbi(data.abi),
      functionName: data.functionName,
      args: data.args,
    });
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
      <div className="container transactionStatus">
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button
        className="transcationButton"
        disabled={isPending}
        onClick={submit}
      >
        {isPending ? "Confirming..." : "Send"}
      </Button>
      {(hash || isConfirming || isConfirmed || error) && <StatusPanel />}
    </>
  );
}
