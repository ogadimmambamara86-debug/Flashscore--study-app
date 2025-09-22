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

export default function ManagementNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 border-b border-gray-300">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
  );
}