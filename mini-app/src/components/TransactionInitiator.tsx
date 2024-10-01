"use client";
import { useState } from "react";
import { useQueryParams } from "@/context/QueryParamsContext";

function TransactionInitiator() {
  const { botName, uid } = useQueryParams();
  const [status, setStatus] = useState<string | null>(null);
  const [params, setParams] = useState<Record<string, string>>({});

  const initiateTransaction = async () => {
    if (!botName || !uid) return;

    try {
      const txType = "transaction"; // Update as needed

      // Ensure required parameters are present
      if (!botName || !txType || !uid) {
        console.error("Missing required query parameters");
        setStatus("Missing required query parameters.");
        setParams({ botName, txType, uid });
        return;
      }

      // Prepare the request body with required parameters
      const requestBody = { botName, txType, uid };

      const response = await fetch(
        "http://localhost:3001/api/generate-bridge-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate bridge URL");
      }

      const { bridgeUrl } = await response.json();
      console.log("Bridge URL:", bridgeUrl);

      // Open the bridge URL in a new tab
      window.open(bridgeUrl, "_blank");
      setStatus(
        "Transaction initiated. Check the new tab for further actions."
      );
    } catch (error) {
      console.error("Failed to initiate transaction:", error);
      setStatus("Failed to initiate transaction.");
    }
  };

  return (
    <div>
      <button onClick={initiateTransaction}>Sign Transaction</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default TransactionInitiator;
