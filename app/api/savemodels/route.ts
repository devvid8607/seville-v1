import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log("model saving", body);
  const returnDataDummy = { message: "success" };
  return NextResponse.json(returnDataDummy);
};
