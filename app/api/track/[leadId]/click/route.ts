import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import Lead from "@/lib/schemas/Lead";

const FALLBACK_REDIRECT = "https://admexo.com";

type Params = {
  params: Promise<{
    leadId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { leadId } = await params;
  const redirectParam = request.nextUrl.searchParams.get("redirect");
  const redirectUrl = getSafeRedirectUrl(redirectParam);

  try {
    if (isDatabaseConfigured()) {
      await connectToDatabase();
      const now = new Date();
      await Lead.findByIdAndUpdate(leadId, {
        emailOpened: true,
        emailOpenedAt: now,
        linkClicked: true,
        linkClickedAt: now
      });
    }
  } catch (error) {
    console.error(`Failed to track click for ${leadId}`, error);
  }

  return NextResponse.redirect(redirectUrl);
}

function getSafeRedirectUrl(value: string | null) {
  if (!value) {
    return FALLBACK_REDIRECT;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : FALLBACK_REDIRECT;
  } catch {
    return FALLBACK_REDIRECT;
  }
}
