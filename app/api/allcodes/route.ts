import { NextRequest, NextResponse } from "next/server";
import allcodes from "./allcodes.json";
// import { fetchWithToken } from "../serverlib/tokenManager";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return NextResponse.json(allcodes);
};
