import { NextRequest, NextResponse } from "next/server";
import canvasData from "../canvasData.json"; // Adjust the import path as necessary

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const [userid, layoutid, modelid] = params.slug;
  console.log("slug values:" + userid, modelid, layoutid);
  // if (!userid || !modelid) {
  //   return NextResponse.json(
  //     { error: "User ID and Model ID are required" },
  //     { status: 400 }
  //   );
  // }

  if (canvasData) {
    return NextResponse.json({ canvasData: canvasData });
  } else {
    return NextResponse.json(
      { error: "Canvas data not found" },
      { status: 404 }
    );
  }
};
