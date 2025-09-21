
export const navItems = [
  { id: "dashboard", label: "🏠 Dashboard", icon: "🏠", href: "/" },
  { id: "predictions", label: "🔮 Predictions", icon: "🔮", href: "/predictions" },
  { id: "scores", label: "📊 Live Scores", icon: "📊", href: "/scores" },
  { id: "news", label: "📰 News", icon: "📰", href: "/news" },
  { id: "quiz", label: "🎯 Quiz", icon: "🎯", href: "/quiz" },
  { id: "tools", label: "🛠️ Tools", icon: "🛠️", href: "/tools" },
  { id: "search", label: "🔍 Search", icon: "🔍", href: "/search" },
  { id: "community", label: "👥 Community", icon: "👥", href: "/community" },
  { id: "leaderboard", label: "🏆 Leaderboard", icon: "🏆", href: "/leaderboard" },
  { id: "wallet", label: "🪙 Pi Wallet", icon: "🪙", href: "/wallet" },
  { id: "profile", label: "👤 Profile", icon: "👤", href: "/profile" },
  { id: "settings", label: "⚙️ Settings", icon: "⚙️", href: "/settings" },
];

// Navigation categories for better organization
export const navCategories = {
  main: ["dashboard", "predictions", "scores", "news"],
  interactive: ["quiz", "tools", "community"],
  user: ["leaderboard", "wallet", "profile", "settings"]
};
