
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
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  requiresAuth?: boolean;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "🏠 Dashboard", icon: "🏠" },
  { id: "predictions", label: "🔮 Predictions", icon: "🔮" },
  { id: "scores", label: "📊 Live Scores", icon: "📊" },
  { id: "news", label: "📰 News", icon: "📰" },
  { id: "quiz", label: "🎯 Quiz", icon: "🎯" },
  { id: "tools", label: "🛠️ Tools", icon: "🛠️" },
  { id: "search", label: "🔍 Search", icon: "🔍" },
  { id: "voting", label: "🗳️ Community", icon: "🗳️", requiresAuth: true },
  { id: "forum", label: "💬 Forum", icon: "💬", requiresAuth: true },
  { id: "wallet", label: "🪙 Pi Wallet", icon: "🪙", requiresAuth: true },
  { id: "store", label: "🛒 Store", icon: "🛒", requiresAuth: true },
  { id: "leaderboard", label: "🏆 Leaderboard", icon: "🏆" },
  { id: "challenges", label: "⚔️ Challenges", icon: "⚔️", requiresAuth: true },
  { id: "security", label: "🔒 Security", icon: "🔒", requiresAuth: true },
  { id: "creator", label: "✍️ Creator", icon: "✍️", requiresAuth: true }
];
