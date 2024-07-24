import { NextRequest, NextResponse } from "next/server";
import { fetchWithToken } from "../serverlib/tokenManager";
import modelDetails from "../models/[id]/modelDetailsDummy.json";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return NextResponse.json(modelDetails);
  // const apiRoute = "GETapi/v1/Models/GetModels";
  // const endpoint = "/identity/api/v1/Models/GetModels";
  // return fetchWithToken(req, endpoint, apiRoute);
};

//this is used to create a model using the user given inputs like name, description , template etc
export const POST = async (req: NextRequest) => {
  const apiRoute = "POSTapi/v1/Models/CreateModel";
  const endpoint = "/identity/api/v1/Models/CreateModel";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "POST", body);
};

export const PUT = async (req: NextRequest) => {
  const apiRoute = "PUTapi/v1/Models/UpdateModel";
  const endpoint = "/identity/api/v1/Models/UpdateModel";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PUT", body);
};

export const PATCH = async (req: NextRequest) => {
  const apiRoute = "PATCHapi/v1/Models/RemoveModelEndpoint";
  const endpoint = "/identity/api/v1/Models/RemoveModelEndpoint";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PATCH", body);
};
