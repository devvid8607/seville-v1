// api/models/[id].ts
import { NextRequest, NextResponse } from "next/server";
import { fetchWithToken } from "../../serverlib/tokenManager";
import modelDetails from "./modelDetailsDummy.json";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const model = modelDetails.find((model) => model.modelId === id);
  return NextResponse.json(model);
  //   const apiRoute = `GETapi/v1/Models/GetModel/${id}`;
  //   const endpoint = `/identity/api/v1/Models/GetModel/${id}`;
  //   return fetchWithToken(req, endpoint, apiRoute);
};
