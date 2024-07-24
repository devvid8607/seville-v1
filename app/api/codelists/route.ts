// pages/api/codelist/route.ts
import { NextRequest } from "next/server";
import { fetchWithToken } from "../serverlib/tokenManager";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const apiRoute = "GETapi/v1/CodeLists/GetCodeLists";
  const endpoint = "/identity/api/v1/CodeLists/GetCodeLists";
  return fetchWithToken(req, endpoint, apiRoute);
};

export const PUT = async (req: NextRequest) => {
  const apiRoute = "PUTapi/v1/CodeLists/UpdateCodeList";
  const endpoint = "/identity/api/v1/CodeLists/UpdateCodeList";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PUT", body);
};

export const PATCH = async (req: NextRequest) => {
  const apiRoute = "PATCHapi/v1/CodeLists/RemoveCodeListEndpoint";
  const endpoint = "/identity/api/v1/CodeLists/RemoveCodeListEndpoint";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PATCH", body);
};
