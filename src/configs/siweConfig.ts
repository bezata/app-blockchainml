import { getCsrfToken, signIn, signOut, getSession } from "next-auth/react";
import type {
  SIWEVerifyMessageArgs,
  SIWECreateMessageArgs,
  SIWESession,
} from "@reown/appkit-siwe";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
import { mainnet, sepolia } from "@reown/appkit/networks";

export const siweConfig = createSIWEConfig({
  //@ts-expect-error: window is not defined in server side
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: [mainnet.id, sepolia.id],
    statement: "Please sign with your account",
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
      });
      return true;
    } catch (error) {
      console.error("Sign-out error:", error);
      return false;
    }
  },
});
