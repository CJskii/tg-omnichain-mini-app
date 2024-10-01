"use client";
import { useQueryParams } from "@/context/QueryParamsContext";
import TransactionInitiator from "@/components/TransactionInitiator";
import TransactionStatus from "@/components/TransactionStatus";

export default function ConnectPage() {
  const { botName, uid } = useQueryParams();

  return (
    <div>
      <h1>OmniTransfer Frontend</h1>
      {botName && uid && (
        <>
          <TransactionInitiator />
          <TransactionStatus chatId={uid} />
        </>
      )}
    </div>
  );
}
