import { useState, useEffect } from "react";
import { PageLayout } from "@/components/page-layout";
import { NextPage } from "next/types";

import { WriteContract, WriteContractData } from "@/components/write-contract";
import { SignMessage, SignMessageProps } from "@/components/sign-message";
import { Typography } from "@/components/ui/typography";
import { ConnectWalletButton } from "@/components/ui/connect-button";

import { useAccount } from "wagmi";
import { getSchemaError, sendEvent } from "@/utils";
import { JsonEditor } from "json-edit-react";

import { buildRequestBody } from "@/utils/build-request-body";

const HomePage: NextPage = () => {
  const { isConnected } = useAccount();
  const [transactionData, setTransactionData] = useState<WriteContractData>();
  const [signMessageData, setSignMessageData] = useState<SignMessageProps>();
  const [callbackEndpoint, setCallbackEndpoint] = useState("");
  const [schemaError, setSchemaError] = useState<any>(false);
  const [callbackError, setCallbackError] = useState<any>();
  const [uid, setUid] = useState<string | undefined>();
  const [operationType, setOperationType] = useState<string>("");
  const [botName, setBotName] = useState<string>("");
  const [source, setSource] = useState<string>("");

  const [endpointType, setEndpointType] = useState<string>("");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const source = queryParameters.get("source") as string;

    setBotName(queryParameters.get("botName") as string);
    setUid(queryParameters.get("uid") as string);
    setSource(queryParameters.get("source") as string);
    setCallbackEndpoint(queryParameters.get("callback") as string);
    setOperationType(queryParameters.get("type") as string);

    const actionType =
      queryParameters.get("type") === "signature" ? "signature" : "transaction";
    setOperationType(actionType);

    const endpointType = source.split("/")[5];
    setEndpointType(endpointType);

    const sourceUrl = new URL(source);
    const sourceParams = new URLSearchParams(sourceUrl.search);

    const chainId = sourceParams.get("chainId");
    const address = sourceParams.get("address");

    const { requestBody } = buildRequestBody({
      operationType: endpointType,
      uid: uid || "",
      chainId: Number(chainId),
      address: address || "",
      setSchemaError,
    });

    const response = fetch(source, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    response
      .then((res) => res.json())
      .then((data) => {
        const error = getSchemaError(actionType, data);
        if (error) {
          setSchemaError(error);
          return;
        } else {
          if (endpointType === "mint") {
            setTransactionData(data);
          } else if (endpointType === "signature") {
            setSignMessageData(data);
          }
        }
      })

      .catch((error) => {
        console.error("Failed to fetch transaction data", error);
        setSchemaError(error);
      });
  }, []);

  const onCallbackError = (error: any) => {
    setCallbackError(error);
  };

  return (
    <PageLayout title="Homepage" description="Welcome to next-web-template">
      <Typography className="text-center">
        <span className="font-bold">{botName} </span>is requesting to confirm
        this transaction
      </Typography>
      <ConnectWalletButton />
      {isConnected && !schemaError && (transactionData || signMessageData) && (
        <>
          {operationType === "transaction" && transactionData && uid && (
            <div className="flex flex-col justify-center items-center gap-8">
              <JsonEditor
                restrictEdit={true}
                restrictAdd={true}
                restrictDelete={true}
                collapse
                data={transactionData}
              />
              <WriteContract
                uid={uid}
                chainId={transactionData.chainId}
                address={transactionData.address}
                abi={transactionData.abi}
                functionName={transactionData.functionName}
                args={transactionData.args}
                endpointType={endpointType}
                sendEvent={(data: any) =>
                  sendEvent(uid, callbackEndpoint, onCallbackError, {
                    ...data,
                    transaction: true,
                  })
                }
              />
            </div>
          )}
          {operationType === "signature" && signMessageData && uid && (
            <div className="flex flex-col justify-center items-center gap-8">
              <Typography>{signMessageData.domain.chainId}</Typography>
              <JsonEditor restrictEdit={true} data={signMessageData} collapse />
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
