"use client";

import { Cell } from "@telegram-apps/telegram-ui";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_ENVIROMENT == "production"
    ? process.env.NEXT_PUBLIC_PROD_API_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:3001"
);

function TransactionStatus({ chatId }: { chatId: string }) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    socket.on(`transactionUpdate:${chatId}`, (data) => {
      setStatus(
        `Transaction Status: ${data.status}, Hash: ${data.transactionHash}`
      );
    });

    return () => {
      socket.off(`transactionUpdate:${chatId}`);
    };
  }, [chatId]);

  return status ? <Cell subhead="Transaction Status">{status}</Cell> : null;
}

export default TransactionStatus;
