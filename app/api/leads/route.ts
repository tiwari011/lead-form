import { NextResponse } from "next/server";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import { sendLeadEmail } from "@/lib/email";
import { getDatabaseErrorMessage } from "@/lib/errors";
import Lead from "@/lib/schemas/Lead";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  requirement?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "MONGODB_URI is not configured." }, { status: 503 });
    }

    await connectToDatabase();
    const leads = await Lead.find().sort({ submissionTime: -1 }).lean();

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch leads", error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "MONGODB_URI is not configured." }, { status: 503 });
    }

    const payload = (await request.json()) as LeadPayload;
    const validationError = validateLead(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await connectToDatabase();

    const lead = await Lead.create({
      name: payload.name?.trim(),
      email: payload.email?.trim().toLowerCase(),
      phone: payload.phone?.trim(),
      company: payload.company?.trim() || "",
      requirement: payload.requirement?.trim()
    });

    sendLeadEmail(lead)
      .then(async () => {
        await Lead.findByIdAndUpdate(lead._id, { emailSent: true });
      })
      .catch((error) => {
        console.error(`Failed to send lead email for ${lead._id.toString()}`, error);
      });

    return NextResponse.json(
      {
        message: "Lead created successfully.",
        lead
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create lead", error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

function validateLead(payload: LeadPayload) {
  if (!payload.name?.trim()) {
    return "Full name is required.";
  }

  if (!payload.email?.trim() || !EMAIL_REGEX.test(payload.email)) {
    return "A valid email address is required.";
  }

  if (!payload.phone?.trim()) {
    return "Phone number is required.";
  }

  if (!payload.requirement?.trim()) {
    return "Requirement is required.";
  }

  return null;
}
