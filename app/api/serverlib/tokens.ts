import apiClient from "./axiosInstance";
import setCookieParser from "set-cookie-parser";
// import tokenManager from "./tokenManager";

export async function createBrowserToken(username: string, password: string) {
  const url = "/identity/api/v1/Tokens/CreateBrowserToken";

  const headers = {
    "Ocp-Apim-Subscription-Key": "2426f99ff0bb4f04a0454cbd7a5a2308",
  };

  const payload = {
    userName: username,
    password: password,
  };

  try {
    const response = await apiClient.post(url, payload, { headers });
    let cookies = null;
    if (response.headers && response.headers["set-cookie"]) {
      cookies = setCookieParser.parse(response.headers["set-cookie"]);
    }
    return { data: response.data, cookies };
  } catch (error) {
    console.error("Error creating browser token:", error);
    throw error;
  }
}

// export async function refreshAccessToken(): Promise<{
//   accessToken: string;
//   accessTokenExpiry: number;
//   refreshToken: string;
// }> {
//   try {
//     const response = await apiClient.post(
//       "/identity/api/v1/Tokens/RefreshBrowserToken",
//       {
//         refreshToken: tokenManager.getRefreshToken(),
//       }
//     );

//     if (response.data) {
//       tokenManager.setTokens({
//         accessToken: response.data.access_token,
//         refreshToken: response.data.refresh_token,
//         expiresIn: response.data.expires_in,
//         endpointTokens: tokenManager.getEndpointTokens(), // Preserve existing endpoint tokens
//       });

//       return {
//         accessToken: response.data.access_token,
//         accessTokenExpiry: Date.now() + response.data.expires_in * 1000,
//         refreshToken:
//           response.data.refresh_token ?? tokenManager.getRefreshToken(),
//       };
//     } else {
//       throw new Error("Failed to refresh token");
//     }
//   } catch (error) {
//     console.error("Error refreshing access token:", error);
//     tokenManager.clearTokens();
//     throw error;
//   }
// }

// export async function revokeToken(token: string) {
//   try {
//     await apiClient.post("/identity/api/v1/Tokens/RevokeToken", { token });
//     tokenManager.clearTokens();
//   } catch (error) {
//     console.error("Failed to revoke token:", error);
//     throw error;
//   }
// }
