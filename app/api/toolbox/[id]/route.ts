import { NextRequest, NextResponse } from "next/server";

import subsequentJSON from "./toolboxsubsequent.json";
import modeljson from "./toolboxModelAttributes.json";

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (id == "6") {
    return NextResponse.json(modeljson);
  }
  return NextResponse.json(subsequentJSON);
};
