"use client";

import { useState } from "react";
import { useQueryParams } from "@/context/QueryParamsContext";
import TransactionStatus from "@/components/TransactionStatus";
import {
  Cell,
  Section,
  Modal,
  Button,
  Input,
  Headline,
} from "@telegram-apps/telegram-ui";
import Image from "next/image";
import { postEvent } from "@telegram-apps/sdk-react";
import { deployedContracts } from "@/constants";

interface BridgeModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface UserSelectionProps {
  chainName: string;
  chainId: number;
  address: string;
  remote_chain_id: number;
}

const StatusDisplay = ({ status }: { status: string | null }) => {
  if (!status) return null;
  return (
    <Cell subhead="Status">
      <Headline>{status}</Headline>
    </Cell>
  );
};

const ChainSelection = ({
  chains,
  onSelect,
  selectedChain,
  title,
  resetSelection,
}: {
  chains: any[];
  onSelect: (chain: UserSelectionProps) => void;
  selectedChain: UserSelectionProps | null;
  title: string;
  resetSelection: () => void;
}) => (
  <>
    <Cell subhead={title} onClick={resetSelection}>
      {selectedChain ? selectedChain.chainName : "None"}
    </Cell>
    {!selectedChain &&
      chains.map(
        ({ chainId, chainName, address, iconPath, remote_chain_id }) => (
          <Cell
            key={chainId}
            subtitle={`Chain ID: ${chainId}`}
            onClick={() =>
              onSelect({ chainName, chainId, address, remote_chain_id })
            }
            before={
              <Image src={iconPath} alt={chainName} width={36} height={36} />
            }
          >
            {chainName}
          </Cell>
        )
      )}
  </>
);

const UserInputs = ({
  userAddress,
  setUserAddress,
  tokenId,
  setTokenId,
}: {
  userAddress: string;
  setUserAddress: (address: string) => void;
  tokenId: string;
  setTokenId: (id: string) => void;
}) => (
  <>
    <Input
      value={userAddress}
      onChange={(e) => setUserAddress(e.target.value)}
      header="Your Address"
    />
    <Input
      value={tokenId}
      onChange={(e) => setTokenId(e.target.value)}
      header="NFT ID"
    />
  </>
);

const BridgeActionButton = ({
  onClick,
  isDisabled,
}: {
  onClick: () => void;
  isDisabled: boolean;
}) => (
  <Button onClick={onClick} stretched disabled={isDisabled}>
    Sign Transaction
  </Button>
);

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
    const contract = deployedContracts.find(
      (contract) => contract.chainId === Number(chainId)
    );
    if (!contract) {
      return;
    }

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
        console.error("Failed to mint", response.statusText);
        setStatus("Failed to fetch mint URL");
        return;
      }

      const { bridgeUrl } = await response.json();
      console.log(`Bridge URL: ${bridgeUrl}`);
      setStatus("Transaction initiated. Check your wallet to confirm.");
      postEvent("web_app_open_link", { url: bridgeUrl });
    } catch (error) {
      console.error("Failed to mint", error);
      setStatus("Failed to mint");
    }
  };

  const handleSourceSelection = (chain: UserSelectionProps) => {
    setUserSelection(chain);
    setStatus(
      targetChain
        ? "Enter NFT ID and your address on source chain"
        : "Select Target Chain"
    );
  };

  const handleTargetSelection = (chain: UserSelectionProps) => {
    setTargetChain(chain);
    setStatus("Enter NFT ID and your address on source chain");
  };

  return (
    <Section header="Bridge your NFTs">
      <StatusDisplay status={status} />

      <ChainSelection
        chains={deployedContracts.filter(
          ({ chainId }) => chainId !== targetChain?.chainId
        )}
        selectedChain={userSelection}
        title="Selected Source Chain"
        onSelect={handleSourceSelection}
        resetSelection={() => {
          setUserSelection(null);
          setStatus("Select source chain for your NFT");
        }}
      />

      {userSelection && (
        <ChainSelection
          chains={deployedContracts.filter(
            ({ chainId }) => chainId !== userSelection.chainId
          )}
          selectedChain={targetChain}
          title="Selected Target Chain"
          onSelect={handleTargetSelection}
          resetSelection={() => {
            setTargetChain(null);
            setStatus("Select target chain for your NFT");
          }}
        />
      )}

      <UserInputs
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        tokenId={tokenId}
        setTokenId={setTokenId}
      />

      <BridgeActionButton
        onClick={() =>
          startBridge({
            chainId: userSelection?.chainId?.toString() || "",
            address: userSelection?.address || "",
          })
        }
        isDisabled={!userSelection || !targetChain || !tokenId || !userAddress}
      />

      {uid && <TransactionStatus chatId={uid} />}
    </Section>
  );
};

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
