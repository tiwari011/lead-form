"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  MousePointerClick,
  Percent,
  RefreshCcw,
  Users
} from "lucide-react";
import StatsCard from "./StatsCard";

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  requirement: string;
  submissionTime: string;
  emailSent: boolean;
  emailOpened: boolean;
  emailOpenedAt: string | null;
  linkClicked: boolean;
  linkClickedAt: string | null;
};

type DashboardStats = {
  totalLeads: number;
  emailsSent: number;
  emailsOpened: number;
  openRate: number;
  linksClicked: number;
  clickRate: number;
};

type DashboardResponse = {
  stats: DashboardStats;
  leads: Lead[];
};

const emptyStats: DashboardStats = {
  totalLeads: 0,
  emailsSent: 0,
  emailsOpened: 0,
  openRate: 0,
  linksClicked: 0,
  clickRate: 0
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchDashboard(silent = false) {
    if (!silent) {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch("/api/dashboard", {
        cache: "no-store"
      });
      const data = (await response.json()) as DashboardResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to load dashboard.");
      }

      setStats(data.stats);
      setLeads(data.leads);
      setError("");
      setLastUpdated(new Date());
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to refresh dashboard.");
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => fetchDashboard(), 0);
    const interval = window.setInterval(() => fetchDashboard(true), 5000);

    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
    };
  }, []);

  const statCards = useMemo(
    () => [
      {
        title: "Total Leads",
        value: stats.totalLeads,
        helper: "All submitted lead records",
        icon: Users,
        tone: "indigo" as const
      },
      {
        title: "Emails Sent",
        value: stats.emailsSent,
        helper: "Successfully handed to SMTP",
        icon: Mail,
        tone: "blue" as const
      },
      {
        title: "Emails Opened",
        value: stats.emailsOpened,
        helper: "Tracked by the email pixel",
        icon: CheckCircle2,
        tone: "emerald" as const
      },
      {
        title: "Open Rate",
        value: `${stats.openRate}%`,
        helper: "Opened emails over sent emails",
        icon: Percent,
        tone: "purple" as const
      },
      {
        title: "Links Clicked",
        value: stats.linksClicked,
        helper: "Tracked clicks to admexo.com",
        icon: MousePointerClick,
        tone: "cyan" as const
      },
      {
        title: "Click Rate",
        value: `${stats.clickRate}%`,
        helper: "Clicked links over sent emails",
        icon: BarChart3,
        tone: "amber" as const
      }
    ],
    [stats]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Live analytics</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 md:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Email opens and link clicks refresh every 5 seconds as recipients interact with messages.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading..."}
          </span>
          <button
            type="button"
            onClick={() => fetchDashboard()}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
            disabled={isRefreshing}
            title="Refresh dashboard"
          >
            <RefreshCcw aria-hidden="true" className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Lead Activity</h2>
            <p className="text-sm text-slate-500">Newest submissions first</p>
          </div>
          <ExternalLink aria-hidden="true" className="h-5 w-5 text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-bold">Name</th>
                <th className="px-5 py-3 font-bold">Email</th>
                <th className="px-5 py-3 font-bold">Phone</th>
                <th className="px-5 py-3 font-bold">Company</th>
                <th className="px-5 py-3 font-bold">Requirement</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold">Submitted Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="align-top transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-950">{lead.name}</td>
                    <td className="px-5 py-4 text-slate-600">{lead.email}</td>
                    <td className="px-5 py-4 text-slate-600">{lead.phone}</td>
                    <td className="px-5 py-4 text-slate-600">{lead.company || "-"}</td>
                    <td className="max-w-xs px-5 py-4 text-slate-600">
                      <span className="line-clamp-3">{lead.requirement}</span>
                    </td>
                    <td className="px-5 py-4">{renderStatus(lead)}</td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(lead.submissionTime)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No leads submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function renderStatus(lead: Lead) {
  if (lead.linkClicked) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
        Clicked
      </span>
    );
  }

  if (lead.emailOpened) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
        <Mail aria-hidden="true" className="h-3.5 w-3.5" />
        Opened
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
      <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
