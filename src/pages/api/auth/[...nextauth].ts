import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  type SIWESession,
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    ethAddress: string;
    chainId: number;
  }

  interface Session extends SIWESession {
    address: string;
    chainId: number;
    user: {
      id: string;
      ethAddress: string;
    };
  }
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

const backendApiUrl = process.env.BACKEND_API_URL;
if (!backendApiUrl) {
  throw new Error("BACKEND_API_URL is not set");
}

export default NextAuth({
  secret: nextAuthSecret,
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message) {
            throw new Error("SIWEMessage is undefined");
          }
          const { message, signature } = credentials;
          const address = getAddressFromMessage(message);
          const chainId = getChainIdFromMessage(message);

          const isValid = await verifySignature({
            address,
            message,
            signature,
            chainId,
            projectId,
          });

          if (isValid) {
            console.log(`Signature verified for address: ${address}`);
            const response = await fetch(`${backendApiUrl}/api/v1/users/auth`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ethAddress: address,
                chainId: `eip155:${chainId}`,
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Backend authentication failed: ${errorText}`);
              throw new Error(
                `Failed to authenticate with backend: ${errorText}`
              );
            }

            const user = await response.json();
            console.log(`User authenticated: ${JSON.stringify(user)}`);

            return {
              id: user.id,
              ethAddress: user.walletAddress,
              chainId: parseInt(user.chainId),
            };
          }

          console.log(`Invalid signature for address: ${address}`);
          return null;
        } catch (e) {
          console.error("Authorization error:", e);
          throw e; // Rethrow the error to be caught by NextAuth
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.ethAddress = user.ethAddress;
        token.chainId = user.chainId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user = {
          id: token.sub,
          ethAddress: token.ethAddress as string,
        };
        session.address = token.ethAddress as string;
        session.chainId = token.chainId as number;
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error", // Error page to redirect to
  },
});