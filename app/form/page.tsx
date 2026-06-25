import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LeadForm from "@/components/LeadForm";

export default function FormPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-700">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back
        </Link>
        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">Submit a requirement</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 md:text-5xl">Lead Form</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Share your contact details and requirement. The system will create a lead record and send a personalized email automatically.
          </p>
        </div>
        <div className="mt-8">
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
