
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  id?: string;
  label?: string;
}

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    name: 'Dashboard',
    href: '/',
    icon: '🏠',
    label: "🏠 Dashboard",
    description: 'Main dashboard and predictions'
  },
  {
    id: "predictions", 
    name: 'Predictions',
    href: '/predictions',
    icon: '🔮',
    label: "🔮 Predictions",
    description: 'AI-powered sports predictions'
  },
  {
    id: "scores",
    name: 'Live Scores',
    href: '/scores',
    icon: '⚽',
    label: "📊 Live Scores", 
    description: 'Real-time match updates'
  },
  {
    id: "news",
    name: 'News',
    href: '/news',
    icon: '📰',
    label: "📰 News",
    description: 'Latest sports news'
  },
  {
    id: "quiz",
    name: 'Quiz',
    href: '/quiz',
    icon: '🧠',
    label: "🎯 Quiz",
    description: 'Test your sports knowledge'
  },
  {
    id: "tools",
    name: 'Tools',
    href: '/tools',
    icon: '🛠️',
    label: "🛠️ Tools",
    description: 'Interactive prediction tools'
  },
  {
    id: "search",
    name: 'Search',
    href: '/search',
    icon: '🔍',
    label: "🔍 Search",
    description: 'Search sports content'
  },
  {
    id: "community",
    name: 'Community',
    href: '/community',
    icon: '👥',
    label: "👥 Community",
    description: 'Sports community discussions'
  },
  {
    id: "store",
    name: 'Store',
    href: '/store',
    icon: '🛒',
    label: "🛒 Store",
    description: 'Pi coin store'
  },
  {
    id: "profile",
    name: 'Profile',
    href: '/profile',
    icon: '👤',
    label: "👤 Profile",
    description: 'User profile and settings'
  }
];
export const navItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Predictions", href: "/predictions", icon: "🔮" },
  { label: "News", href: "/news", icon: "📰" },
  { label: "Quiz", href: "/quiz", icon: "🧠" },
  { label: "Community", href: "/community", icon: "👥" },
];

export default navItems;
