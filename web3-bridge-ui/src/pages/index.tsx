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

const HomePage: NextPage = () => {
  const { isConnected } = useAccount();
  const account = useAccount();
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
    try {
      const queryParameters = new URLSearchParams(window.location.search);
      const source = queryParameters.get("source");
      const botName = queryParameters.get("botName");
      const uid = queryParameters.get("uid");
      const callback = queryParameters.get("callback");
      const operationType = queryParameters.get("type") || "transaction";
      const action = queryParameters.get("action") || "transaction";

      setBotName(botName || "");
      setUid(uid || "");
      setSource(source || "");
      setCallbackEndpoint(callback || "");
      setOperationType(operationType);

      if (!source) {
        console.warn("Missing source URL");
        setSchemaError("Source URL is missing.");
        return;
      }

      let chainId, address, spenderAddress;
      try {
        const sourceUrl = new URL(source);
        const sourceParams = new URLSearchParams(sourceUrl.search);
        chainId = sourceParams.get("chainId");
        address = sourceParams.get("address");
        spenderAddress = sourceParams.get("spenderAddress");
      } catch (e) {
        console.warn("Error parsing source URL parameters:", e);
        setSchemaError("Invalid source URL parameters.");
        return;
      }

      setEndpointType(action);

      let requestBody: any;
      switch (action) {
        case "mint":
          requestBody = {
            chainId: chainId ? Number(chainId) : undefined,
            address: address || "",
          };
          break;
        case "approve":
          requestBody = {
            chainId: chainId ? Number(chainId) : undefined,
            address: address || "",
            spenderAddress: spenderAddress || account?.address || "",
          };
          break;
        default:
          console.warn("Invalid action type.");
          setSchemaError("Invalid action type.");
          return;
      }

      console.log("Request body:", requestBody);

      if (!requestBody) {
        console.warn("Invalid request body.");
        setSchemaError("Invalid request body.");
        return;
      }

      fetch(source, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          const error = getSchemaError(operationType, data);
          if (error) {
            setSchemaError(error);
            return;
          }

          if (action === "mint" || action === "approve") {
            setTransactionData(data);
          } else if (action === "signature") {
            setSignMessageData(data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch transaction data:", error);
          setSchemaError("Failed to fetch transaction data.");
        });
    } catch (e) {
      console.error("An error occurred in useEffect:", e);
      setSchemaError("An unexpected error occurred.");
    }
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
