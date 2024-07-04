import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const GRAPHQL_ENDPOINT = "https://dev-gateway.seville.studio/graphql";
const secret = process.env.NEXTAUTH_SECRET;

// Handler for GET requests (example for demonstration)
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(token);
}

// Handler for POST requests
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Parse the body
  const body = await request.json();

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`, // Use the token fetched from NextAuth
        "Ocp-Apim-Subscription-Key": "2426f99ff0bb4f04a0454cbd7a5a2308",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("GraphQL request failed:", error);

    return NextResponse.json(error);
  }
}
