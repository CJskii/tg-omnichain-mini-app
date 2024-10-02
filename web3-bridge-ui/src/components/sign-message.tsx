import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { Button } from "./ui/button";

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
  const { signTypedData } = useSignTypedData();
  const { chainId } = useAccount();
  const [error, setError] = useState<any>();
  const [hash, setHash] = useState<`0x${string}`>();

  const signMessage = () => {
    if (chainId !== domain.chainId) {
      setError(new Error("Chain ID mismatch"));
      return;
    }

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

  const StatusPanel = () => {
    return (
      <div className="container signatureStatus">
        {hash && <div>Signature hash: {hash}</div>}
        {error && <div>Error: {error.shortMessage || error.message}</div>}
      </div>
    );
  };

  useEffect(() => {
    if (hash) {
      return sendEvent({ hash });
    }
    if (error) {
      return sendEvent({ error });
    }
  }, [hash, error]);

  return (
    <>
      <Button className="transcationButton" onClick={signMessage}>
        Sign message
      </Button>
      {(hash || error) && <StatusPanel />}
    </>
  );
}
