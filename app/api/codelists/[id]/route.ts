import { NextRequest, NextResponse } from "next/server";
import codedata from "./codelistdummy.json";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const code = codedata.find((code) => code.id === id);
  return NextResponse.json(code);
  //   const apiRoute = `GETapi/v1/Models/GetModel/${id}`;
  //   const endpoint = `/identity/api/v1/Models/GetModel/${id}`;
  //   return fetchWithToken(req, endpoint, apiRoute);
};
