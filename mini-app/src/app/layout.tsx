import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Root } from "@/components/Root/Root";
import { QueryParamsProvider } from "@/context/QueryParamsContext";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";

export const metadata: Metadata = {
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        {/* <Script
          id="telegram-web-app"
          strategy="beforeInteractive"
          src="https://telegram.org/js/telegram-web-app.js"
        /> */}
        <Root>
          <QueryParamsProvider>{children}</QueryParamsProvider>
        </Root>
      </body>
    </html>
  );
}
