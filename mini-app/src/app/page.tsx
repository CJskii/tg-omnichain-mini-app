"use client";

import { Section, Cell, Image, List } from "@telegram-apps/telegram-ui";

import { Link } from "@/components/Link/Link";

import ethereumSvg from "./_assets/ethereum.svg";
import leafSvg from "./_assets/leaf.svg";

export default function Home() {
  return (
    <List>
      <Section
        header="Features"
        footer="We're working hard to add more features to this app"
      >
        <Link href="/evm-connect">
          <Cell
            before={
              <Image
                src={ethereumSvg.src}
                alt="EVM logo"
                style={{ backgroundColor: "#007AFF" }}
              />
            }
            subtitle="Connect your EVM wallet"
          >
            EVM Connect
          </Cell>
        </Link>
        <Link href="/mint">
          <Cell
            before={
              <Image
                src={leafSvg.src}
                alt="TON logo"
                className="bg-red-500"
                style={{ backgroundColor: "#6A0DAD" }}
              />
            }
            subtitle="Get NFT to your wallet"
          >
            Mint
          </Cell>
        </Link>
      </Section>
    </List>
  );
}
