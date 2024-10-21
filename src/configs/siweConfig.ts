import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";
import type {
  SIWEVerifyMessageArgs,
  SIWECreateMessageArgs,
  SIWESession,
} from "@reown/appkit-siwe";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
import { base, polygon } from "@reown/appkit/networks";

export const siweConfig = createSIWEConfig({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [polygon.id, base.id],
    statement:
      "Welcome to the BlockchainML! Verify your identity for next generation auth!",
  }),

  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),

  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      throw new Error("Failed to get nonce!");
    }
    return nonce;
  },

  getSession: async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("Failed to get session!");
    }

    const { address, chainId } = session as unknown as SIWESession;

    return { address, chainId };
  },

  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/protected",
      });

      return Boolean(success?.ok);
    } catch (error) {
      return false;
    }
  },

  signOut: async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
      return true;
    } catch (error) {
      console.error("Sign-out error:", error);
      return false;
    }
  },

  onSignIn: (session?: SIWESession) => {
    console.log("User signed in:", session);
    // Perform any additional actions on sign in
  },

  onSignOut: () => {
    console.log("User signed out");
    // Perform any additional actions on sign out
  },

  nonceRefetchIntervalMs: 300000, // 5 minutes
  sessionRefetchIntervalMs: 300000, // 5 minutes
  signOutOnDisconnect: true,
  signOutOnAccountChange: true,
});
