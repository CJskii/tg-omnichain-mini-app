import React, { useState } from "react";
import { Button, Modal } from "@telegram-apps/telegram-ui";
import { Cell, Section } from "@telegram-apps/telegram-ui";
import { postEvent } from "@telegram-apps/sdk-react";
import Image from "next/image";

import { useQueryParams } from "@/context/QueryParamsContext";

import { deployedContracts } from "@/constants";
import TransactionStatus from "../TransactionStatus";

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
  const [status, setStatus] = useState<string | null>(null);

  const mint = async ({ chainId, address }: MintProps) => {
    const contract = deployedContracts.find(
      (contract) => contract.chainId === chainId
    );
    if (!contract) {
      return;
    }

    console.log(
      `Minting on chain ${contract.chainName} with address ${address} and chain ID ${chainId}`
    );

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_ENVIROMENT == "production"
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
        console.error("Failed to mint", response.statusText);
        setStatus("Failed to fetch mint URL");
        return;
      }

      const { mintUrl } = await response.json();

      console.log(`Mint URL: ${mintUrl}`);

      setStatus(`Transaction initiated. Check your wallet to confirm.`);
      postEvent("web_app_open_link", { url: mintUrl });
    } catch (error) {
      console.error("Failed to mint", error);
      setStatus("Failed to mint");
    }
  };

  return (
    <Section header="Select a chain to mint">
      {status && <Cell subhead="Status">{status}</Cell>}
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
          onClick={() => setUserSelection({ chainName, chainId, address })}
          before={
            <Image src={iconPath} alt={chainName} width={36} height={36} />
          }
        >
          {chainName}
        </Cell>
      ))}

      {userSelection && (
        <Button stretched onClick={() => mint(userSelection)}>
          Mint
        </Button>
      )}

      {uid && <TransactionStatus chatId={uid} />}
    </Section>
  );
}
