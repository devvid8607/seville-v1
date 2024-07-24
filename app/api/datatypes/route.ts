// pages/api/datatypes/route.ts
import { NextRequest } from "next/server";
import { fetchWithToken } from "../serverlib/tokenManager";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const apiRoute = "GETapi/v1/DataTypes/GetDataTypes";
  const endpoint = "/identity/api/v1/DataTypes/GetDataTypes";
  return fetchWithToken(req, endpoint, apiRoute);
};

export const PUT = async (req: NextRequest) => {
  const apiRoute = "PUTapi/v1/DataTypes/UpdateDataType";
  const endpoint = "/identity/api/v1/DataTypes/UpdateDataType";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PUT", body);
};

export const PATCH = async (req: NextRequest) => {
  const apiRoute = "PATCHapi/v1/DataTypes/RemoveDataTypeEndpoint";
  const endpoint = "/identity/api/v1/DataTypes/RemoveDataTypeEndpoint";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PATCH", body);
};
