import React from "react";
import { Modal } from "@telegram-apps/telegram-ui";
import { Cell, Section } from "@telegram-apps/telegram-ui";
import { postEvent } from "@telegram-apps/sdk-react";
import Image from "next/image";

import { useQueryParams } from "@/context/QueryParamsContext";

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
  chainId: number;
  address: string;
}

export function Mint() {
  const { botName, uid } = useQueryParams();

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

      const { mintUrl } = await response.json();

      console.log(`Mint URL: ${mintUrl}`);

      postEvent("web_app_open_link", { url: mintUrl });
    } catch (error) {
      console.error("Failed to mint", error);
    }
  };

  return (
    <Section header="Select a chain to mint">
      {deployedContracts.map(({ chainId, chainName, address, iconPath }) => (
        <Cell
          key={chainId}
          subtitle={`Chain ID: ${chainId}`}
          onClick={() => mint({ chainId, address })}
          before={
            <Image src={iconPath} alt={chainName} width={36} height={36} />
          }
        >
          {chainName}
        </Cell>
      ))}
    </Section>
  );
}
