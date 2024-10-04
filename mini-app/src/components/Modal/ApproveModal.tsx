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
} from "@telegram-apps/telegram-ui";
import { postEvent } from "@telegram-apps/sdk-react";

interface ApproveModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  open: isModalOpen,
  onOpenChange: setIsModalOpen,
}) => {
  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Approve />
    </Modal>
  );
};

const Approve = () => {
  const { botName, uid } = useQueryParams();

  const [status, setStatus] = useState<string | null>(null);
  const [bridgeUrl, setBridgeUrl] = useState<string | null>(null);
  const [address, setAddress] = useState<string>(
    "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C"
  );
  const [spenderAddress, setSpenderAddress] = useState<string>(
    "0x4a89caAE3daf3Ec08823479dD2389cE34f0E6c96"
  );
  const [chainId, setChainId] = useState<string>("324");
  const [txType, setTxType] = useState<string>("transaction");

  const initiateTransaction = async () => {
    try {
      if (
        !botName ||
        !txType ||
        !uid ||
        !chainId ||
        !address ||
        !spenderAddress
      ) {
        console.error("Missing required query parameters");
        setStatus("Missing required query parameters.");
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_ENVIROMENT == "production"
            ? process.env.NEXT_PUBLIC_PROD_API_URL
            : process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:3001"
        }/api/generate-url/approve/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            botName,
            txType,
            uid,
            chainId,
            address,
            spenderAddress,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate bridge URL");
      }

      const { approveUrl } = await response.json();

      console.log("Generated approve URL:", approveUrl);

      setBridgeUrl(approveUrl);

      postEvent("web_app_open_link", { url: approveUrl });

      setStatus(
        "Transaction initiated. Check the new tab for further actions."
      );
    } catch (error) {
      console.error("Failed to initiate transaction:", error);
      setStatus("Failed to initiate transaction");
    }
  };
  return (
    <Section header="Approve transaction">
      <>
        {status && <Cell subhead="Status">{status}</Cell>}
        <Cell subhead="Contract Name">USDT (TetherUSDT)</Cell>
        <Cell subhead="Network">zkSync Era</Cell>
        <Input
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
          header="Chain ID"
          disabled
        />
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          header="Contract Address"
          disabled
        />
        <Input
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
          header="Spender Address"
          disabled
        />

        <Button onClick={initiateTransaction} stretched>
          Sign Transaction
        </Button>

        {uid && <TransactionStatus chatId={uid} />}
      </>
    </Section>
  );
};
