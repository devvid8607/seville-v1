import { NextRequest, NextResponse } from "next/server";

import subsequentJSON from "./toolboxsubsequent.json";
import modeljson from "./toolboxModelAttributes.json";
import addrerssjson from "./toolboxAdressModel.json";
import datatypesjson from "./toolboxDatatypes.json";
import codelistjson from "./toolboxcodelist.json";

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (id === "6") {
    return NextResponse.json(modeljson);
  }
  if (id === "567") {
    return NextResponse.json(addrerssjson);
  }
  if (id === "3") {
    return NextResponse.json(datatypesjson);
  }
  if (id === "2") {
    return NextResponse.json(codelistjson);
  }
  return NextResponse.json(subsequentJSON);
};
