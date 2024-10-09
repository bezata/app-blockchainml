import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import ContextProvider from "@/context/wagmiContext";
import { SessionProvider } from "next-auth/react";
import { parseCookies } from "nookies";

export default function App({ Component, pageProps }: AppProps) {
  const cookies = parseCookies();

  return (
    <ContextProvider cookies={JSON.stringify(cookies)}>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </ContextProvider>
  );
}
