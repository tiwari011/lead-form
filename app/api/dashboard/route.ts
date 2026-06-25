import { NextResponse } from "next/server";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import { getDatabaseErrorMessage } from "@/lib/errors";
import Lead from "@/lib/schemas/Lead";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          error: "MONGODB_URI is not configured.",
          stats: {
            totalLeads: 0,
            emailsSent: 0,
            emailsOpened: 0,
            openRate: 0,
            linksClicked: 0,
            clickRate: 0
          },
          leads: []
        },
        { status: 503 }
      );
    }

    await connectToDatabase();

    const [totalLeads, emailsSent, emailsOpened, linksClicked] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ emailSent: true }),
      Lead.countDocuments({ emailOpened: true }),
      Lead.countDocuments({ linkClicked: true })
    ]);

    const openRate = emailsSent ? Math.round((emailsOpened / emailsSent) * 100) : 0;
    const clickRate = emailsSent ? Math.round((linksClicked / emailsSent) * 100) : 0;
    const leads = await Lead.find().sort({ submissionTime: -1 }).lean();

    return NextResponse.json(
      {
        stats: {
          totalLeads,
          emailsSent,
          emailsOpened,
          openRate,
          linksClicked,
          clickRate
        },
        leads
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}
