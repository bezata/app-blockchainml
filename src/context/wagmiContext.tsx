"use client";

import { wagmiAdapter, projectId } from "@/configs/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { polygon } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { WagmiProvider, type Config } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: "appkit-example-scroll",
  description: "AppKit Example - Scroll",
  url: "https://scrollapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [polygon],
  defaultNetwork: polygon,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    swaps: true,
    onramp: true,
    email: true, // default to true
    socials: [
      "google",
      "x",
      "github",
      "discord",
      "apple",
      "facebook",
      "farcaster",
    ],
    emailShowWallets: false, // default to true
  },
  themeMode: "light",
});

function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
