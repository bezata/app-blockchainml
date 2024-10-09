import { Session } from "next-auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
  session: Session | null
) => {
  if (!session?.accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
