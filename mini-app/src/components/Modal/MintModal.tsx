"use client";

import { useState } from "react";
import { useQueryParams } from "@/context/QueryParamsContext";
import { postEvent } from "@telegram-apps/sdk-react";
import TransactionStatus from "@/components/TransactionStatus";
import { Cell, Section, Modal } from "@telegram-apps/telegram-ui";
import Image from "next/image";
import StatusDisplay from "../DisplayData/StatusDisplay";
import TransactionButton from "../Button/TransactionButton";
import { deployedContracts } from "@/constants";

interface MintModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const MintModal: React.FC<MintModalProps> = ({
  open: isModalOpen,
  onOpenChange: setIsModalOpen,
}) => {
  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Mint />
    </Modal>
  );
};

interface MintProps {
  chainName: string;
  chainId: number;
  address: string;
}

export function Mint() {
  const { botName, uid } = useQueryParams();

  const [userSelection, setUserSelection] = useState<MintProps | null>(null);
  const [status, setStatus] = useState<string | null>(
    "Waiting for user selection"
  );

  const mint = async ({ chainId, address }: MintProps) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_ENVIROMENT === "production"
            ? process.env.NEXT_PUBLIC_PROD_API_URL
            : process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:3001"
        }/api/generate-url/mint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            botName,
            chainId,
            address,
            uid,
            txType: "transaction",
          }),
        }
      );

      if (!response.ok) {
        setStatus("Failed to fetch mint URL");
        return;
      }

      const { mintUrl } = await response.json();

      console.log(`Mint URL: ${mintUrl}`);
      setStatus(`Transaction initiated. Check your wallet to confirm.`);
      postEvent("web_app_open_link", { url: mintUrl });
    } catch (error) {
      setStatus("Failed to mint");
    }
  };

  return (
    <Section header="Select a chain to mint">
      <StatusDisplay status={status} />

      <Cell subhead="Selected Chain">
        {userSelection ? userSelection.chainName : "None"}
      </Cell>

      <Cell subhead="Selected Address">
        {userSelection ? userSelection.address : "None"}
      </Cell>

      {deployedContracts.map(({ chainId, chainName, address, iconPath }) => (
        <Cell
          key={chainId}
          subtitle={`Chain ID: ${chainId}`}
          onClick={() => {
            setUserSelection({ chainName, chainId, address });
            setStatus("Ready to mint");
          }}
          before={
            <Image src={iconPath} alt={chainName} width={36} height={36} />
          }
        >
          {chainName}
        </Cell>
      ))}

      <TransactionButton
        onClick={userSelection ? () => mint(userSelection) : () => {}}
        label="Mint"
        disabled={!userSelection}
      />

      {uid && <TransactionStatus chatId={uid} />}
    </Section>
  );
}
