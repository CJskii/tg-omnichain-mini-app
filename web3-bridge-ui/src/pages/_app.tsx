import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";
import { Montserrat } from "next/font/google";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";

import { ThemeProvider } from "@/components/theme-provider";

const client = new QueryClient();

export const monsterrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: "500",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider theme={darkTheme()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return <div className={monsterrat.className}>{children}</div>;
}

export default MyApp;
