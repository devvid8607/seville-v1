// lib/authHelpers.ts
import { JWT } from "next-auth/jwt";
import apiClient from "./axiosInstance";

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await apiClient.post(
      "/api/v1/Tokens/RefreshBrowserToken",
      {
        refreshToken: token.refresh_token,
      }
    );

    const refreshedTokens = response.data;

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Failed to refresh access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
