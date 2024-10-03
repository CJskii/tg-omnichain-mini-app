"use client";
import { Cell, Section } from "@telegram-apps/telegram-ui";
import { postEvent } from "@telegram-apps/sdk-react";
import Image from "next/image";

import { useQueryParams } from "@/context/QueryParamsContext";

import { deployedContracts } from "@/constants";

interface MintProps {
  chainId: number;
  address: string;
}

export default function MintPage() {
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
