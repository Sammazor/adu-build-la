"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ImageIcon,
  UserCircle,
  Globe,
  LayoutTemplate,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users, exact: false },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText, exact: false },
  { href: "/admin/site-pages", label: "Site Pages", icon: Layers, exact: false },
  { href: "/admin/pages", label: "CMS Pages", icon: LayoutTemplate, exact: false },
  { href: "/admin/services", label: "Services", icon: Globe, exact: false },
  { href: "/admin/authors", label: "Authors", icon: UserCircle, exact: false },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-stone-900 text-white flex flex-col z-40">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-stone-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold leading-tight">ADU Build LA</div>
            <div className="text-xs text-stone-400 leading-tight">Admin Portal</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-stone-700 text-white"
                  : "text-stone-300 hover:bg-stone-800 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: sign out */}
      <div className="px-3 py-4 border-t border-stone-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
