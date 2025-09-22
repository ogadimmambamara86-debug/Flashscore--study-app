
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: "🏠",
    description: "Main dashboard"
  },
  {
    label: "Predictions",
    href: "/predictions",
    icon: "🔮",
    description: "Sports predictions"
  },
  {
    label: "News",
    href: "/news",
    icon: "📰",
    description: "Latest sports news"
  },
  {
    label: "Quiz",
    href: "/quiz",
    icon: "🧠",
    description: "Sports quiz"
  },
  {
    label: "Forum",
    href: "/forum",
    icon: "💬",
    description: "Community discussions"
  }
];
