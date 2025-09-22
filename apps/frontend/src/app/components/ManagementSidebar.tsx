"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  FileText,
  CreditCard,
  Bell,
  Activity,
  Settings,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/management/users", label: "Users", icon: Users },
  { href: "/management/content", label: "Content", icon: FileText },
  { href: "/management/payments", label: "Payments", icon: CreditCard },
  { href: "/management/notifications", label: "Notifications", icon: Bell },
  { href: "/management/predictions", label: "Predictions", icon: Activity },
  { href: "/management/settings", label: "Settings", icon: Settings },
  { href: "/management/analytics", label: "Analytics", icon: BarChart3 },
];

export default function ManagementSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-100 border-r border-gray-300 flex flex-col">
      <div className="p-4 text-lg font-bold border-b">Management</div>
      <nav className="flex flex-col flex-1 p-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors mb-1 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}