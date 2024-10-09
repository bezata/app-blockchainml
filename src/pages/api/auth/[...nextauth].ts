import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  SIWESession,
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: string;
    user: {
      id: string;
      walletAddress: string;
      apiKey: string;
    };
    accessToken: string;
  }
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set");
}

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

const authOptions: NextAuthOptions = {
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
          if (!credentials?.message || !credentials?.signature) {
            throw new Error("Missing message or signature");
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

          if (!isValid) {
            throw new Error("Invalid signature");
          }

          // SIWE verification successful, now validate with backend
          const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend validation failed:", errorData);
            throw new Error(errorData.error || "Backend validation failed");
          }

          const data = await response.json();
          return {
            id: data.user.id,
            walletAddress: data.user.walletAddress,
            chainId: data.user.chainId,
            apiKey: data.user.apiKey,
            accessToken: data.accessToken,
          };
        } catch (e) {
          console.error("Authorization error:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress;
        token.chainId = user.chainId;
        token.apiKey = user.apiKey;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.address = token.walletAddress as string;
      session.chainId = token.chainId as string;
      session.user = {
        id: token.id as string,
        walletAddress: token.walletAddress as string,
        apiKey: token.apiKey as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Specify custom sign-in page if you have one
    error: "/auth/error", // Specify custom error page if you have one
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
