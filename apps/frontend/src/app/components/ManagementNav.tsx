"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/management/users", label: "Users" },
  { href: "/management/content", label: "Content" },
  { href: "/management/payments", label: "Payments" },
  { href: "/management/notifications", label: "Notifications" },
  { href: "/management/predictions", label: "Predictions" },
  { href: "/management/settings", label: "Settings" },
  { href: "/management/analytics", label: "Analytics" },
];

export default function ManagementNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 border-b border-gray-300">
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}