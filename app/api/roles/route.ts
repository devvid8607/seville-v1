import { NextRequest, NextResponse } from "next/server";
import { fetchWithToken } from "../serverlib/tokenManager";

export const GET = async (req: NextRequest) => {
  const apiRoute = "GETapi/v1/Roles/GetAvailableRoles";
  const endpoint = "/identity/api/v1/Roles/GetAvailableRoles";
  return fetchWithToken(req, endpoint, apiRoute);
};
