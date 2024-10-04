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
  Typography,
  Headline,
} from "@telegram-apps/telegram-ui";

import Image from "next/image";
import { postEvent } from "@telegram-apps/sdk-react";

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

interface BridgeProps {
  chainName: string;
  chainId: number;
  address: string;
}

const Bridge = () => {
  const { botName, uid } = useQueryParams();

  const [status, setStatus] = useState<string | null>("🚧 WORK IN PROGRESS 🚧");
  const [txType, setTxType] = useState<string>("transaction");
  const [nftId, setNftId] = useState<string>("1");

  const [userSelection, setUserSelection] = useState<BridgeProps | null>(null);

  const initiateTransaction = async () => {};
  return (
    <Section header="Bridge your NFTs">
      <>
        {status && (
          <Cell subhead="Status">
            <Headline>{status}</Headline>
          </Cell>
        )}
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
        <Input
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
          header="NFT ID"
          disabled
        />

        <Button onClick={initiateTransaction} stretched disabled>
          Sign Transaction
        </Button>

        {uid && <TransactionStatus chatId={uid} />}
      </>
    </Section>
  );
};
