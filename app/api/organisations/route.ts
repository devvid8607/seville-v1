import { NextRequest } from "next/server";
import { fetchWithToken } from "../serverlib/tokenManager";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const apiRoute = "GETapi/v1/Organisations/GetOrganisations";
  const endpoint = "/identity/api/v1/Organisations/GetOrganisations";
  return fetchWithToken(req, endpoint, apiRoute);
};

export const PUT = async (req: NextRequest) => {
  const apiRoute = "PUTapi/v1/Organisations/UpdateOrganisation";
  const endpoint = "/identity/api/v1/Organisations/UpdateOrganisation";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PUT", body);
};

export const PATCH = async (req: NextRequest) => {
  const apiRoute = "PATCHapi/v1/Organisations/RemoveOrganisationEndpoint";
  const endpoint = "/identity/api/v1/Organisations/RemoveOrganisationEndpoint";
  const body = await req.json();
  return fetchWithToken(req, endpoint, apiRoute, "PATCH", body);
};
