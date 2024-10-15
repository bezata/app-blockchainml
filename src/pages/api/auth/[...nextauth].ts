import NextAuth, { NextAuthOptions, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  SIWESession,
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

if (!nextAuthSecret) throw new Error("NEXTAUTH_SECRET is not set");
if (!projectId)
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set");

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: string;
    accessToken: string;
  }
  interface User extends DefaultUser {
    address: string;
    chainId: string;
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.message || !credentials?.signature) {
          throw new Error("Message or signature is missing");
        }

        try {
          const { message, signature } = credentials;

          const address = getAddressFromMessage(message);
          const chainId = getChainIdFromMessage(message);

          console.log(
            `Attempting to verify signature for address: ${address}, chainId: ${chainId}`
          );

          const isValid = await verifySignature({
            address,
            message,
            signature,
            chainId: chainId.toString(),
            projectId,
          });

          if (!isValid) {
            console.error("Invalid signature");
            throw new Error("Invalid signature");
          }

          console.log("Signature verified, attempting backend login");

          const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest", // CSRF protection
            },
            body: JSON.stringify({ message, signature }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend authentication failed:", errorData);
            throw new Error(errorData.error || "Backend authentication failed");
          }

          const userData = await response.json();

          if (!userData.user || !userData.accessToken) {
            console.error("Invalid response from backend:", userData);
            throw new Error("Invalid response from backend");
          }

          console.log(
            "Login successful for address:",
            userData.user.walletAddress
          );

          return {
            id: userData.user.walletAddress,
            address: userData.user.walletAddress,
            chainId: userData.user.chainId,
            accessToken: userData.accessToken,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.address;
        token.address = user.address;
        token.chainId = user.chainId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        address: token.address as string,
        chainId: token.chainId as string,
        accessToken: token.accessToken as string,
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export default handler;
