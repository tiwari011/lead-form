import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-700">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back
        </Link>
        <div className="mt-8">
          <Dashboard />
        </div>
      </div>
    </main>
  );
}
