import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React from "react";
import { Typography } from "@/components/ui/typography";

const HomePage: NextPage = () => {
  return (
    <PageLayout
      title="Homepage"
      description="Welcome to next-web-template"
      flexDirection="col"
      justify="between"
      align="center"
    >
      <Typography variant="h1" className="text-center">
        Welcome to Omnichain App! 🎮
      </Typography>
      <Typography variant="h4" className="text-center">
        Start by connecting your wallet and exploring the app.
      </Typography>

      <Button
        className="gap-2"
        onClick={() => {
          console.log("Connect Wallet");
        }}
      >
        Connect Wallet
      </Button>
    </PageLayout>
  );
};

export default HomePage;
