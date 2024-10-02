"use client";
import { useQueryParams } from "@/context/QueryParamsContext";
import TransactionInitiator from "@/components/TransactionInitiator";
import TransactionStatus from "@/components/TransactionStatus";
import { Cell, Section } from "@telegram-apps/telegram-ui";

export default function ConnectPage() {
  const { botName, uid } = useQueryParams();

  return (
    <Section header="OmniTransfer Connect">
      <Cell subtitle="Bot Name">{botName}</Cell>
      <Cell subtitle="Telegram chat ID">{uid}</Cell>
      {botName && uid && (
        <>
          <TransactionInitiator />
          <TransactionStatus chatId={uid} />
        </>
      )}
    </Section>
  );
}
