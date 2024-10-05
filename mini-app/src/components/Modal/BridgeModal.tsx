"use client";

import { useState } from "react";
import { useQueryParams } from "@/context/QueryParamsContext";
import { postEvent } from "@telegram-apps/sdk-react";
import TransactionStatus from "@/components/TransactionStatus";
import { Cell, Section, Modal, Input } from "@telegram-apps/telegram-ui";
import Image from "next/image";
import StatusDisplay from "../DisplayData/StatusDisplay";
import TransactionButton from "../Button/TransactionButton";
import { deployedContracts } from "@/constants";

interface BridgeModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const BridgeModal: React.FC<BridgeModalProps> = ({
  open: isModalOpen,
  onOpenChange: setIsModalOpen,
}) => {
  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Bridge />
    </Modal>
  );
};

interface UserSelectionProps {
  chainName: string;
  chainId: number;
  address: string;
  remote_chain_id: number;
}

const Bridge = () => {
  const { botName, uid } = useQueryParams();
  const [status, setStatus] = useState<string | null>(
    "Select source chain for your NFT"
  );
  const [tokenId, setTokenId] = useState<string>("");
  const [targetChain, setTargetChain] = useState<UserSelectionProps | null>(
    null
  );
  const [userSelection, setUserSelection] = useState<UserSelectionProps | null>(
    null
  );
  const [userAddress, setUserAddress] = useState<string>("");

  const startBridge = async ({
    chainId,
    address,
  }: {
    chainId: string;
    address: string;
  }) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_ENVIROMENT === "production"
            ? process.env.NEXT_PUBLIC_PROD_API_URL
            : process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:3001"
        }/api/generate-url/bridge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            botName,
            sourceChainId: chainId,
            targetChainId: targetChain?.remote_chain_id,
            contractAddress: address,
            ownerAddress: userAddress,
            tokenId,
            uid,
            txType: "transaction",
          }),
        }
      );

      if (!response.ok) {
        setStatus("Failed to fetch bridge URL");
        return;
      }

      const { bridgeUrl } = await response.json();
      console.log(`Generated bridge URL: ${bridgeUrl}`);
      setStatus(`Transaction initiated. Check your wallet to confirm.`);
      postEvent("web_app_open_link", { url: bridgeUrl });
    } catch (error) {
      setStatus("Failed to initiate bridge transaction.");
    }
  };

  return (
    <Section header="Bridge your NFTs">
      <StatusDisplay status={status} />

      <Cell
        subhead="Selected Source Chain"
        onClick={() => {
          if (userSelection) {
            setUserSelection(null);
            setStatus("Select source chain for your NFT");
          }
        }}
      >
        {userSelection ? userSelection.chainName : "None"}
      </Cell>

      <Cell
        subhead="Selected Target Chain"
        onClick={() => {
          if (targetChain) {
            setTargetChain(null);
            setStatus("Select target chain for your NFT");
          }
        }}
      >
        {targetChain?.chainName || "None"}
      </Cell>

      {!userSelection &&
        deployedContracts.map(
          ({ chainId, chainName, address, iconPath, remote_chain_id }) =>
            targetChain?.chainId !== chainId && (
              <Cell
                key={chainId}
                subtitle={`Chain ID: ${chainId}`}
                onClick={() => {
                  setUserSelection({
                    chainName,
                    chainId,
                    address,
                    remote_chain_id,
                  });
                  setStatus(
                    targetChain
                      ? "Enter NFT ID and your address on source chain"
                      : "Select Target Chain"
                  );
                }}
                before={
                  <Image
                    src={iconPath}
                    alt={chainName}
                    width={36}
                    height={36}
                  />
                }
              >
                {chainName}
              </Cell>
            )
        )}

      {userSelection &&
        deployedContracts.map(
          ({ chainId, chainName, address, iconPath, remote_chain_id }) =>
            chainId !== userSelection.chainId && (
              <Cell
                key={chainId}
                subtitle={`Chain ID: ${chainId}`}
                onClick={() => {
                  setTargetChain({
                    chainName,
                    chainId,
                    address,
                    remote_chain_id,
                  });
                  setStatus("Enter NFT ID and your address on source chain");
                }}
                before={
                  <Image
                    src={iconPath}
                    alt={chainName}
                    width={36}
                    height={36}
                  />
                }
              >
                {chainName}
              </Cell>
            )
        )}

      <Input
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        header="Your Address"
        placeholder="0x..."
      />

      <Input
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        header="NFT ID"
        placeholder="123"
      />

      <TransactionButton
        onClick={() =>
          startBridge({
            chainId: userSelection?.chainId?.toString() || "",
            address: userSelection?.address || "",
          })
        }
        label="Bridge"
        disabled={!userSelection || !targetChain || !tokenId || !userAddress}
      />

      {uid && <TransactionStatus chatId={uid} />}
    </Section>
  );
};
