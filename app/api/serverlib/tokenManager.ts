// lib/tokenManager.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import apiClient from "./axiosInstance";

const secret = process.env.NEXTAUTH_SECRET;

export const fetchWithToken = async (
  req: NextRequest,
  endpoint: string,
  apiRoute: string,
  method: string = "GET",
  body: any = null
) => {
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const endpointToken = token.endpoint_tokens.find(
    (t) => t.endpoint_route === apiRoute
  )?.access_token;

  if (!endpointToken) {
    return NextResponse.json(
      { message: `No token found for ${apiRoute}` },
      { status: 400 }
    );
  }

  const cookieHeader = token.cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await apiClient.request({
      url: endpoint,
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${endpointToken} ${token.access_token}`,
        Cookie: cookieHeader,
      },
      data: body ? JSON.stringify(body) : null,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    return NextResponse.json(
      { message: `Failed to fetch data from ${endpoint}` },
      { status: 500 }
    );
  }
};
