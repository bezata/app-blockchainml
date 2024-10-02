"use client";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import ContextProvider from "@/context/wagmiContext";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </ContextProvider>
  );
}
