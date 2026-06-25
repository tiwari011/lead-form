import { NextResponse } from "next/server";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import Lead from "@/lib/schemas/Lead";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64"
);

type Params = {
  params: Promise<{
    leadId: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { leadId } = await params;

  try {
    if (isDatabaseConfigured()) {
      await connectToDatabase();
      await Lead.findByIdAndUpdate(leadId, {
        emailOpened: true,
        emailOpenedAt: new Date()
      });
    }
  } catch (error) {
    console.error(`Failed to track open for ${leadId}`, error);
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": TRANSPARENT_GIF.length.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    }
  });
}
