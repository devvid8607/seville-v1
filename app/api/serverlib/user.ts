import apiClient from "./axiosInstance";

export async function fetchUser(
  getUserAccessToken: string,
  accessToken: string,
  cookies: any[]
) {
  const cookieHeader = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await apiClient.get("/identity/api/v1/Users/GetUser", {
      headers: {
        Authorization: `Bearer ${getUserAccessToken} ${accessToken}`,
        Cookie: cookieHeader,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
}

export async function inviteUser(inviteData: any) {
  try {
    const response = await apiClient.post(
      "/identity/api/v1/Users/InviteUser",
      inviteData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to invite user:", error);
    throw error;
  }
}

export async function createUser(userData: any) {
  try {
    const response = await apiClient.post(
      "/identity/api/v1/Users/CreateUser",
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}
