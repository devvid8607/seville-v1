import { NextRequest, NextResponse } from "next/server";
import layoutdata from "./dummylayoutdata.json";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userid: string } }
) => {
  const { userid } = params;

  return NextResponse.json(layoutdata);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log("body", body);
  const returnDataDummy = { layoutId: "dummy-layout-id" };
  console.log("returning", returnDataDummy);
  return NextResponse.json(returnDataDummy);
  // const apiRoute = "POSTapi/v1/Models/CreateModel";
  // const endpoint = "/identity/api/v1/Models/CreateModel";
  // const body = await req.json();
  // return fetchWithToken(req, endpoint, apiRoute, "POST", body);
};
