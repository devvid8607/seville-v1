import { NextRequest, NextResponse } from "next/server";
import allmodels from "./allmodels.json";
// import { fetchWithToken } from "../serverlib/tokenManager";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return NextResponse.json(allmodels);
};

//this is used to create a model using the user given inputs like name, description , template etc
// export const POST = async (req: NextRequest) => {
//   const returnDataDummy = { id: "dummy-model-id" };
//   return NextResponse.json(returnDataDummy);
//   // const apiRoute = "POSTapi/v1/Models/CreateModel";
//   // const endpoint = "/identity/api/v1/Models/CreateModel";
//   // const body = await req.json();
//   // return fetchWithToken(req, endpoint, apiRoute, "POST", body);
// };
