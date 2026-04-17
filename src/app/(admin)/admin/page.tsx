import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { LeadStatusBadge } from "@/components/admin/ui/LeadStatusBadge";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { formatRelativeTime, formatDateShort } from "@/lib/utils/formatters";
import { Users, FileText, TrendingUp, Inbox } from "lucide-react";

const recentLeadsQuery = () =>
  prisma.lead.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { source: true } });
const recentPostsQuery = () =>
  prisma.post.findMany({ take: 5, orderBy: { updatedAt: "desc" }, include: { author: true } });

type RecentLead = Awaited<ReturnType<typeof recentLeadsQuery>>[number];
type RecentPost = Awaited<ReturnType<typeof recentPostsQuery>>[number];

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const [
    leadsToday,
    leadsThisWeek,
    postsPublished,
    postsDraft,
    recentLeads,
    recentPosts,
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.lead.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    recentLeadsQuery(),
    recentPostsQuery(),
  ]);

  return { leadsToday, leadsThisWeek, postsPublished, postsDraft, recentLeads: recentLeads as RecentLead[], recentPosts: recentPosts as RecentPost[] };
}

export default async function AdminDashboard() {
  const { leadsToday, leadsThisWeek, postsPublished, postsDraft, recentLeads, recentPosts } =
    await getDashboardData();

  const kpis = [
    { label: "Leads Today", value: leadsToday, icon: Inbox, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Leads This Week", value: leadsThisWeek, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Posts Published", value: postsPublished, icon: FileText, color: "text-green-600", bg: "bg-green-50" },
    { label: "Posts in Draft", value: postsDraft, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Overview of leads, content, and site activity."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex p-2 rounded-lg ${kpi.bg} mb-3`}>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Leads</h2>
            <Link href="/admin/leads" className="text-xs text-stone-600 hover:text-stone-900 font-medium">
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">
              No leads yet. Submit a form to see leads here.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentLeads.map((lead: RecentLead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-stone-700 truncate">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {lead.email}
                      {lead.propertyCity ? ` · ${lead.propertyCity}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <LeadStatusBadge status={lead.status} />
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(lead.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-stone-600 hover:text-stone-900 font-medium">
              View all →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">
              No posts yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentPosts.map((post: RecentPost) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="block px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="text-sm font-medium text-gray-900 group-hover:text-stone-700 line-clamp-2 mb-1">
                    {post.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={post.status} />
                    <span className="text-xs text-gray-400">
                      {formatDateShort(post.updatedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          + New Blog Post
        </Link>
        <Link
          href="/admin/leads"
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Users className="w-4 h-4 inline mr-1.5" />
          View All Leads
        </Link>
      </div>
    </div>
  );
}
