// lib/tokenManager.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import apiClient from "./axiosInstance";
import axios from "axios";

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
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
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
        "Cache-Control": "no-cache, no-store, must-revalidate",

        Pragma: "no-cache",
        Expires: "0",
      },
      data: body ? JSON.stringify(body) : null,
    });
    console.log("dataaaa", response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    // console.error(`Failed to fetch data from ${endpoint}:`, error);
    // return NextResponse.json(
    //   { message: `Failed to fetch data from ${endpoint}` },
    //   { status: 500 }
    // );
    if (axios.isAxiosError(error) && error.response) {
      // Server responded with a status other than 2xx
      console.error(
        `Failed to fetch data from 1 ${endpoint}:`,
        error.response.data
      );
      return new NextResponse(
        JSON.stringify({
          message:
            error.response.data.message ||
            `Failed to fetch data from 2 ${endpoint}`,
        }),
        { status: error.response.status }
      );
    } else if (axios.isAxiosError(error) && error.request) {
      // Request was made but no response was received
      console.error(`No response received from ${endpoint}:`, error.request);
      return new NextResponse(
        JSON.stringify({ message: `No response received from ${endpoint}` }),
        { status: 503 }
      );
    } else if (error instanceof Error) {
      // Something happened in setting up the request
      console.error(`Error in request setup to ${endpoint}:`, error.message);
      return new NextResponse(
        JSON.stringify({ message: `Error in request setup: ${error.message}` }),
        { status: 500 }
      );
    } else {
      // Handle unknown error type
      console.error(`Unknown error:`, error);
      return new NextResponse(
        JSON.stringify({ message: `An unknown error occurred` }),
        { status: 500 }
      );
    }
  }
};
