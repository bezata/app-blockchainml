import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import ContextProvider from "@/context/wagmiContext";
import { SessionProvider } from "next-auth/react";
import { parseCookies } from "nookies";
import { CookieProvider } from "@/context/sessionProvider";

export default function App({ Component, pageProps }: AppProps) {
  const cookies = parseCookies();

  return (
    <ContextProvider cookies={JSON.stringify(cookies)}>
      <SessionProvider>
        <CookieProvider>
          <Component {...pageProps} />
        </CookieProvider>
      </SessionProvider>
    </ContextProvider>
  );
}
