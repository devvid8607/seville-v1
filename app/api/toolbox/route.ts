// pages/api/toolbox/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchWithToken } from "../serverlib/tokenManager";
import toolboxCategories from "./[id]/toolBoxInitial.json";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return NextResponse.json(toolboxCategories);
  // const apiRoute = "GETapi/v1/Toolboxes/GetToolboxes";
  // const endpoint = "/identity/api/v1/Toolboxes/GetToolboxes";
  // return fetchWithToken(req, endpoint, apiRoute);
};

export const PUT = async (req: NextRequest) => {
  const apiRoute = "PUTapi/v1/Toolboxes/UpdateToolbox";
  const endpoint = "/identity/api/v1/Toolboxes/UpdateToolbox";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PUT", body);
};

export const PATCH = async (req: NextRequest) => {
  const apiRoute = "PATCHapi/v1/Toolboxes/RemoveToolboxEndpoint";
  const endpoint = "/identity/api/v1/Toolboxes/RemoveToolboxEndpoint";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PATCH", body);
};
