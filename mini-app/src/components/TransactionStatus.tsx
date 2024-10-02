"use client";

import { Cell } from "@telegram-apps/telegram-ui";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Update as needed

function TransactionStatus({ chatId }: { chatId: string }) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Listen for transaction updates
    socket.on(`transactionUpdate:${chatId}`, (data) => {
      setStatus(
        `Transaction Status: ${data.status}, Hash: ${data.transactionHash}`
      );
    });

    return () => {
      socket.off(`transactionUpdate:${chatId}`);
    };
  }, [chatId]);

  return (
    <Cell subtitle="Transaction Status">
      {status ? <p>{status}</p> : <p>Waiting for transaction status...</p>}
    </Cell>
  );
}

export default TransactionStatus;
