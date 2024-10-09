import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

interface ExtendedUser extends User {
  ethAddress: string;
  chainId: number;
  apiKey: string;
  accessToken: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    ethAddress: string;
    chainId: string | null;
    apiKey: string;
  };
  accessToken: string;
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
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            throw new Error("Missing message or signature");
          }
          const { message, signature } = credentials;

          const response = await fetch(`${backendApiUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, signature }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Backend authentication failed: ${errorText}`);
            throw new Error(
              `Failed to authenticate with backend: ${errorText}`
            );
          }

          const { user, token } = await response.json();
          console.log(`User authenticated: ${JSON.stringify(user)}`);

          return {
            id: user.id,
            ethAddress: user.ethAddress,
            chainId: user.chainId ?? null,
            apiKey: user.apiKey,
            accessToken: token,
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
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.ethAddress = extendedUser.ethAddress;
        token.chainId = extendedUser.chainId ?? null;
        token.apiKey = extendedUser.apiKey;
        token.accessToken = extendedUser.accessToken;
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          id: token.id as string,
          ethAddress: token.ethAddress as string,
          chainId: (token.chainId as string) ?? null,
          apiKey: token.apiKey as string,
        },
        accessToken: token.accessToken as string,
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
