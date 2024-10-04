"use client";
import { useState, useEffect } from "react";
import {
  Section,
  Cell,
  Image,
  List,
  Banner,
  Headline,
  Subheadline,
} from "@telegram-apps/telegram-ui";
import { useInitData } from "@telegram-apps/sdk-react";

import ethereumSvg from "./_assets/ethereum.svg";
import leafSvg from "./_assets/leaf.svg";
import bridgeSvg from "./_assets/bridge.svg";

import { MintModal } from "@/components/Modal/MintModal";
import { ApproveModal } from "@/components/Modal/ApproveModal";
import { BridgeModal } from "@/components/Modal/BridgeModal";

export default function Home() {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const initData = useInitData();

  useEffect(() => {
    if (initData && initData.user) {
      setUsername(initData.user.username ?? null);
    }
  }, [initData]);

  return (
    <List>
      <Banner className="flex justify-center items-center">
        {username && (
          <div>
            <Headline>Hello, {username} 😊</Headline>
            <Subheadline>Welcome to OmniMinter</Subheadline>
          </div>
        )}

        {!username && <Headline>Welcome to OmniMinter</Headline>}
      </Banner>
      <MintModal open={isMintModalOpen} onOpenChange={setIsMintModalOpen} />
      <ApproveModal
        open={isApproveModalOpen}
        onOpenChange={setIsApproveModalOpen}
      />
      <BridgeModal
        open={isBridgeModalOpen}
        onOpenChange={setIsBridgeModalOpen}
      />
      <Section header="Features">
        <Cell
          before={
            <Image
              src={ethereumSvg.src}
              alt="EVM logo"
              style={{ backgroundColor: "#007AFF" }}
            />
          }
          subtitle="Contract spending on your behalf"
          onClick={() => setIsApproveModalOpen(true)}
        >
          Approve
        </Cell>

        <Cell
          before={
            <Image
              src={leafSvg.src}
              alt="Mint logo"
              style={{ backgroundColor: "#6A0DAD" }}
            />
          }
          subtitle="Get NFT to your wallet"
          onClick={() => setIsMintModalOpen(true)}
        >
          Mint
        </Cell>

        <Cell
          before={
            <Image
              src={bridgeSvg.src}
              alt="Bridge logo"
              style={{ backgroundColor: "#FF9500" }}
            />
          }
          subtitle="Cross chain transfer of your NFT"
          onClick={() => setIsBridgeModalOpen(true)}
        >
          Bridge
        </Cell>

        {/* <Link href="/component-test">
          <Cell subtitle="Test your components">Component Test</Cell>
        </Link> */}
      </Section>
    </List>
  );
}
