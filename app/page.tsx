import Link from "next/link";
import { BarChart3, ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#eef2ff_34%,#ffffff_70%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <section className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">Lead management and email tracking</p>
          <h1 className="mt-5 text-5xl font-black tracking-normal text-slate-950 md:text-7xl">
            Lead Tracking System
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Capture lead requirements, send personalized tracking emails, and monitor opens and clicks from a live admin dashboard.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/form"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <ClipboardList aria-hidden="true" className="h-4 w-4" />
              Submit Lead Form
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-blue-300 hover:text-blue-700"
            >
              <BarChart3 aria-hidden="true" className="h-4 w-4" />
              View Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
