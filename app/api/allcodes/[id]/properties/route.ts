import { NextRequest, NextResponse } from "next/server";
import codeProp from "./codeProp.json";
// import { fetchWithToken } from "../serverlib/tokenManager";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return NextResponse.json(codeProp);
};
