"use client";
import { Cell, Section } from "@telegram-apps/telegram-ui";
import { postEvent } from "@telegram-apps/sdk-react";
import Image from "next/image";

import { deployedContracts } from "@/constants";

interface MintProps {
  chainId: number;
  address: string;
}

export default function ConnectPage() {
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

    // here we should call backend to return a link for mint transaction

    // when we have the link we can open it in the browser using telegram API

    // postEvent("web_app_open_link", { url: mintUrl });
  };

  return (
    <Section
      header="Minting section"
      footer="Select one of the options above to start minting"
    >
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
