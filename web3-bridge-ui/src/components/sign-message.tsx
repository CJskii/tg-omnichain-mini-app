import { useEffect, useState } from "react";
import { useAccount, useSignTypedData, useSwitchChain } from "wagmi";
import { Button } from "./ui/button";
import { Typography } from "./ui/typography";

interface Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: `0x${string}`;
}

export interface SignMessageProps {
  domain: Domain;
  primaryType: string;
  types: any;
  message: any;
  uid: string;
  sendEvent: (event: any) => void;
}

export function SignMessage(props: SignMessageProps) {
  const { domain, primaryType, types, message, sendEvent } = props;
  const { signTypedData, isPending } = useSignTypedData();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<any>();
  const [hash, setHash] = useState<`0x${string}`>();

  const account = useAccount();

  const isCorrectChain = account.chainId === domain.chainId;

  const signMessage = () => {
    signTypedData(
      {
        domain,
        primaryType,
        types,
        message,
      },
      {
        onError: (error) => setError(error),
        onSuccess: (hash) => setHash(hash),
      }
    );
  };

  async function requestSwitch(chainId: number) {
    try {
      switchChain({ chainId });
    } catch (error) {
      setError(error);
    }
  }

  const StatusPanel = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        {hash && <Typography>Signature hash: {hash}</Typography>}
        {error && (
          <>
            <Typography className="text-destructive text-center">
              Error: {error.shortMessage || error.message}
            </Typography>
            <Typography variant={"small"} className="text-center p-2">
              Please try again.
            </Typography>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (hash) {
      sendEvent({ hash });
    }
    if (error) {
      sendEvent({ error });
    }
  }, [hash, error]);

  return (
    <>
      <Button
        className="transcationButton"
        disabled={isPending}
        onClick={
          isCorrectChain ? signMessage : () => requestSwitch(domain.chainId)
        }
      >
        {isPending
          ? "Confirming..."
          : isCorrectChain
          ? "Sign Message"
          : "Switch Chain"}
      </Button>
      {(hash || error) && <StatusPanel />}
    </>
  );
}
