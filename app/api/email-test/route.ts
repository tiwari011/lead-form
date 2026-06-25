import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");

    if (!process.env.EMAIL_TEST_SECRET || secret !== process.env.EMAIL_TEST_SECRET) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
  }

  try {
    const to = process.env.EMAIL_TEST_TO;

    if (!to) {
      return NextResponse.json({ ok: false, error: "EMAIL_TEST_TO is missing." }, { status: 400 });
    }

    const data = await sendTestEmail(to);
    return NextResponse.json(
      { ok: true, message: "Resend test email sent.", id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email test failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: getEmailErrorMessage(error)
      },
      { status: 500 }
    );
  }
}

function getEmailErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown email error.";

  if (message.includes("RESEND_API_KEY")) {
    return "RESEND_API_KEY is missing.";
  }

  return message;
}
