import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";
import type {
  SIWEVerifyMessageArgs,
  SIWECreateMessageArgs,
  SIWESession,
} from "@reown/appkit-siwe";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
import { polygon } from "@reown/appkit/networks";

export const siweConfig = createSIWEConfig({
  // @ts-expect-error : TODO: fix this
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [polygon.id],
    statement: "Sign in with Ethereum to the app",
    version: "1",
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
      return null;
    }
    const { address, chainId } = session as unknown as SIWESession;
    return { address, chainId };
  },

  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const response = await signIn("credentials", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/protected",
      });

      if (response?.error) {
        console.error("Sign-in error:", response.error);
        return false;
      }
      return response?.ok || false;
    } catch (error) {
      console.error("Verification error:", error);
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

  enabled: true,
  nonceRefetchIntervalMs: 300000, // 5 minutes
  sessionRefetchIntervalMs: 300000, // 5 minutes
  signOutOnDisconnect: true,
  signOutOnAccountChange: true,
  signOutOnNetworkChange: true,
});
