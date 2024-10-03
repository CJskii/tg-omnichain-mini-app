"use client";
import { useState } from "react";
import { useQueryParams } from "@/context/QueryParamsContext";
import { Button, Cell, Section, Typography } from "@telegram-apps/telegram-ui";
import { postEvent } from "@telegram-apps/sdk-react";

function TransactionInitiator() {
  const { botName, uid } = useQueryParams();
  const [status, setStatus] = useState<string | null>(null);
  const [bridgeUrl, setBridgeUrl] = useState<string | null>(null);

  const initiateTransaction = async () => {
    if (!botName || !uid) return;

    try {
      const txType = "transaction";

      if (!botName || !txType || !uid) {
        console.error("Missing required query parameters");
        setStatus("Missing required query parameters.");
        return;
      }

      console.log(
        `Initiating transaction for bot ${botName} with UID ${uid} and type ${txType}`
      );

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_ENVIROMENT == "production"
            ? process.env.NEXT_PUBLIC_PROD_API_URL
            : process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:3001"
        }/api/generate-bridge-url/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ botName, txType, uid }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate bridge URL");
      }

      const { bridgeUrl } = await response.json();

      setBridgeUrl(bridgeUrl);

      postEvent("web_app_open_link", { url: bridgeUrl });

      setStatus(
        "Transaction initiated. Check the new tab for further actions."
      );
    } catch (error) {
      console.error("Failed to initiate transaction:", error);
      setStatus("Failed to initiate transaction." + (error as Error).message);
    }
  };

  return (
    <Section>
      <Cell subtitle="Description">
        Initiates a transaction using Web3 Bridge.
      </Cell>

      <Cell>
        <Button onClick={initiateTransaction}>Sign Transaction</Button>
      </Cell>

      {/* <Cell subtitle="Transaction Status">{status}</Cell> */}
      <Cell subtitle="Generated Bridge URL">{bridgeUrl}</Cell>

      {status && <Cell>{status}</Cell>}
    </Section>
  );
}

export default TransactionInitiator;
