import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React from "react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { GitFork, StarIcon } from "lucide-react";
import { GitHubIcon } from "@/assets/icons/social";
import { ConnectWalletButton } from "@/components/ui/connect-button";
import { useAccount } from "wagmi";

const HomePage: NextPage = () => {
  const account = useAccount();

  console.log(account.address);

  return (
    <PageLayout title="Homepage" description="Welcome to next-web-template">
      <ConnectWalletButton />
    </PageLayout>
  );
};

export default HomePage;
