import { useState, useEffect } from "react";

import { PageLayout } from "@/components/page-layout";
import { NextPage } from "next/types";
import React from "react";
import { Typography } from "@/components/ui/typography";
import { ConnectWalletButton } from "@/components/ui/connect-button";
import { useAccount } from "wagmi";

import { WriteContract, WriteContractData } from "@/components/write-contract";
import { SignMessage, SignMessageProps } from "@/components/sign-message";

import { getSchemaError, sendEvent } from "@/utils";
import { JsonEditor } from "json-edit-react";

const HomePage: NextPage = () => {
  const { isConnected } = useAccount();
  const { chainId } = useAccount();
  const [transactionData, setTransactionData] = useState<WriteContractData>();
  const [signMessageData, setSignMessageData] = useState<SignMessageProps>();
  const [callbackEndpoint, setCallbackEndpoint] = useState("");
  const [schemaError, setSchemaError] = useState<any>(false);
  const [callbackError, setCallbackError] = useState<any>();
  const [uid, setUid] = useState<string | undefined>();
  const [operationType, setOperationType] = useState<string>("");
  const [botName, setBotName] = useState<string>("");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const source = queryParameters.get("source") as string;
    setBotName(queryParameters.get("botName") as string);
    setUid(queryParameters.get("uid") as string);
    setCallbackEndpoint(queryParameters.get("callback") as string);

    const actionType =
      queryParameters.get("type") === "signature" ? "signature" : "transaction";
    setOperationType(actionType);

    fetch(source)
      .then((response) => response.json())
      .then((data) => {
        const error = getSchemaError(actionType, data);
        if (error) {
          setSchemaError(error);
        } else {
          actionType === "signature"
            ? setSignMessageData(data)
            : setTransactionData(data);
        }
      })
      .catch((error) => {
        setSchemaError(error);
      });
  }, []);

  const onCallbackError = (error: any) => {
    setCallbackError(error);
  };

  return (
    <PageLayout title="Homepage" description="Welcome to next-web-template">
      <ConnectWalletButton />
      {isConnected && !schemaError && (transactionData || signMessageData) && (
        <>
          {operationType === "transaction" && transactionData && uid && (
            <div className="flex flex-col justify-center items-center gap-8">
              <Typography>{transactionData.chainId}</Typography>
              <WriteContract
                uid={uid}
                chainId={transactionData.chainId}
                address={transactionData.address}
                abi={transactionData.abi}
                functionName={transactionData.functionName}
                args={transactionData.args}
                sendEvent={(data: any) =>
                  sendEvent(uid, callbackEndpoint, onCallbackError, {
                    ...data,
                    transaction: true,
                  })
                }
              />
              <JsonEditor
                restrictEdit={true}
                restrictAdd={true}
                restrictDelete={true}
                collapse={false}
                data={transactionData}
              />
            </div>
          )}
          {operationType === "signature" && signMessageData && uid && (
            <div className="flex flex-col justify-center items-center gap-8">
              <Typography>{signMessageData.domain.chainId}</Typography>
              <SignMessage
                uid={uid}
                domain={signMessageData.domain}
                primaryType={signMessageData.primaryType}
                types={signMessageData.types}
                message={signMessageData.message}
                sendEvent={(data: any) =>
                  sendEvent(uid, callbackEndpoint, onCallbackError, {
                    ...data,
                    signature: true,
                  })
                }
              />
              <JsonEditor restrictEdit={true} data={signMessageData} collapse />
            </div>
          )}
        </>
      )}

      {schemaError && (
        <div className="flex flex-col justify-center items-center gap-8">
          <Typography className="text-destructive">
            Error: Source doesn't match schema
          </Typography>

          <JsonEditor
            restrictEdit={true}
            restrictAdd={true}
            restrictDelete={true}
            collapse={false}
            data={JSON.parse(JSON.stringify(schemaError))}
          />
        </div>
      )}
      {callbackError && (
        <div className="flex flex-col justify-center items-center gap-8">
          <Typography className="text-destructive">
            There was an error during callback request to {callbackEndpoint}
          </Typography>

          <JsonEditor
            restrictEdit={true}
            restrictAdd={true}
            restrictDelete={true}
            collapse={false}
            data={JSON.parse(JSON.stringify(callbackError))}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default HomePage;
